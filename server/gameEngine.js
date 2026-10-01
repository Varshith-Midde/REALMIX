const { db, saveDatabase } = require('./db');

// Calculate level details from total XP
// Level 1: 0-100 XP
// Formula: XP required for level N to reach N+1: Math.floor(100 * Math.pow(N, 1.35))
function getXpForLevel(level) {
  if (level <= 1) return 100;
  return Math.floor(100 * Math.pow(level, 1.35));
}

function calculateLevelFromXp(totalXp) {
  let level = 1;
  let accumulatedXp = 0;

  while (true) {
    const neededForNext = getXpForLevel(level);
    if (totalXp >= accumulatedXp + neededForNext) {
      accumulatedXp += neededForNext;
      level++;
    } else {
      const currentLevelXp = totalXp - accumulatedXp;
      const progressPercent = Math.min(100, Math.floor((currentLevelXp / neededForNext) * 100));
      return {
        level,
        currentLevelXp,
        nextLevelXp: neededForNext,
        progressPercent,
        totalXp
      };
    }
  }
}

// Format date string YYYY-MM-DD
function getTodayDateStr() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Calculate days difference between two YYYY-MM-DD
function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Update streak logic
function processStreak(profile) {
  const today = getTodayDateStr();
  const lastActive = profile.lastActiveDate;

  if (!lastActive) {
    profile.streak = 1;
    profile.longestStreak = Math.max(profile.longestStreak || 0, 1);
    profile.lastActiveDate = today;
    return { streakUpdated: true, streak: 1, shieldUsed: false };
  }

  if (lastActive === today) {
    // Already active today
    return { streakUpdated: false, streak: profile.streak, shieldUsed: false };
  }

  const daysPassed = daysBetween(lastActive, today);

  if (daysPassed === 1) {
    // Consecutive day!
    profile.streak = (profile.streak || 0) + 1;
    profile.longestStreak = Math.max(profile.longestStreak || 0, profile.streak);
    profile.lastActiveDate = today;
    return { streakUpdated: true, streak: profile.streak, shieldUsed: false };
  }

  if (daysPassed > 1) {
    // Missed a day: check for streak shield
    if (profile.streakShields && profile.streakShields > 0) {
      profile.streakShields -= 1;
      profile.lastActiveDate = today;
      return {
        streakUpdated: true,
        streak: profile.streak,
        shieldUsed: true,
        message: `🛡️ Streak Shield activated! Preserved your ${profile.streak}-day streak.`
      };
    } else {
      // Reset streak
      const oldStreak = profile.streak;
      profile.streak = 1;
      profile.lastActiveDate = today;
      return {
        streakUpdated: true,
        streak: 1,
        shieldUsed: false,
        message: `Your ${oldStreak}-day streak ended, but your XP and level progression are 100% safe!`
      };
    }
  }

  return { streakUpdated: false, streak: profile.streak, shieldUsed: false };
}

// Check and award achievements
function checkAchievements(userId) {
  const profile = db.profiles.find(p => p.userId === userId);
  if (!profile) return [];

  const completedQuestsCount = db.quests.filter(q => q.userId === userId && q.status === 'COMPLETED').length;
  const userUnlocked = db.user_achievements.filter(ua => ua.userId === userId);
  const unlockedIds = new Set(userUnlocked.map(ua => ua.achievementId));

  const newlyUnlocked = [];

  for (const ach of db.achievements) {
    if (unlockedIds.has(ach.id)) continue;

    let qualifies = false;

    if (ach.requirement_type === 'quests_completed' && completedQuestsCount >= ach.requirement_value) {
      qualifies = true;
    } else if (ach.requirement_type === 'level' && profile.level >= ach.requirement_value) {
      qualifies = true;
    } else if (ach.requirement_type === 'streak' && profile.streak >= ach.requirement_value) {
      qualifies = true;
    } else if (ach.requirement_type === 'gold' && profile.gold >= ach.requirement_value) {
      qualifies = true;
    } else if (ach.requirement_type === 'bosses_defeated') {
      const defeatedCount = db.bosses.filter(b => b.userId === userId && b.status === 'defeated').length;
      if (defeatedCount >= ach.requirement_value) qualifies = true;
    }

    if (qualifies) {
      const unlockEntry = {
        userId,
        achievementId: ach.id,
        unlockedAt: new Date().toISOString()
      };
      db.user_achievements.push(unlockEntry);

      // Add achievement reward
      profile.xp += ach.reward_xp;
      profile.gold += ach.reward_gold;

      newlyUnlocked.push({
        ...ach,
        unlockedAt: unlockEntry.unlockedAt
      });
    }
  }

  return newlyUnlocked;
}

// Complete Quest engine function
function completeQuest(userId, questId, notes = '') {
  const quest = db.quests.find(q => q.id === questId && q.userId === userId);
  if (!quest) {
    throw new Error('Quest not found');
  }

  if (quest.status === 'COMPLETED') {
    throw new Error('Quest is already completed');
  }

  const profile = db.profiles.find(p => p.userId === userId);
  if (!profile) {
    throw new Error('Profile not found');
  }

  const oldLevel = profile.level;
  let xpEarned = quest.xp || 50;
  let goldEarned = quest.gold || 25;

  // Check if user has active potion modifier
  if (profile.activeBuffs && profile.activeBuffs.xpPotionCharges > 0) {
    profile.activeBuffs.xpPotionCharges -= 1;
    xpEarned = Math.floor(xpEarned * 1.5);
  }

  // Update Quest status
  quest.status = 'COMPLETED';
  quest.completedAt = new Date().toISOString();
  quest.completionNotes = notes;

  // Update profile XP & Gold
  profile.xp += xpEarned;
  profile.gold += goldEarned;

  // Update Stats
  if (quest.statRewards) {
    for (const [stat, amt] of Object.entries(quest.statRewards)) {
      if (profile.stats && profile.stats[stat] !== undefined) {
        profile.stats[stat] += amt;
      }
    }
  } else {
    // Default stat increase based on type
    if (quest.type === 'study') profile.stats.knowledge = (profile.stats.knowledge || 50) + 4;
    else if (quest.type === 'build' || quest.type === 'task') profile.stats.technical = (profile.stats.technical || 50) + 4;
    else if (quest.type === 'exercise') profile.stats.fitness = (profile.stats.fitness || 50) + 4;
    else profile.stats.discipline = (profile.stats.discipline || 50) + 3;
  }

  // Check Level progression
  const levelInfo = calculateLevelFromXp(profile.xp);
  const leveledUp = levelInfo.level > oldLevel;
  profile.level = levelInfo.level;
  profile.xpNext = levelInfo.nextLevelXp;

  if (leveledUp) {
    profile.gold += 100; // Level-up bonus gold
    goldEarned += 100;
  }

  // Streak processing
  const streakInfo = processStreak(profile);

  // Boss damage
  let bossDamageDealt = Math.floor(xpEarned * 1.2);
  let bossDefeated = false;
  let bossRewardXp = 0;
  let bossRewardGold = 0;

  let activeBoss = db.bosses.find(b => b.userId === userId && b.status === 'active');
  if (activeBoss) {
    activeBoss.currentHp = Math.max(0, activeBoss.currentHp - bossDamageDealt);
    db.combat_logs.unshift({
      id: `log_${Date.now()}`,
      userId,
      bossId: activeBoss.id,
      questTitle: quest.title,
      damage: bossDamageDealt,
      remainingHp: activeBoss.currentHp,
      timestamp: new Date().toISOString()
    });

    if (activeBoss.currentHp === 0) {
      activeBoss.status = 'defeated';
      bossDefeated = true;
      bossRewardXp = activeBoss.rewardXp || 1000;
      bossRewardGold = activeBoss.rewardGold || 500;

      profile.xp += bossRewardXp;
      profile.gold += bossRewardGold;

      // Recalculate level after boss rewards
      const updatedLevelInfo = calculateLevelFromXp(profile.xp);
      profile.level = updatedLevelInfo.level;
      profile.xpNext = updatedLevelInfo.nextLevelXp;
    }
  }

  // Log transactions
  db.xp_transactions.unshift({
    id: `xp_tx_${Date.now()}`,
    userId,
    questId: quest.id,
    xp: xpEarned,
    gold: goldEarned,
    reason: `Completed quest: ${quest.title}`,
    timestamp: new Date().toISOString()
  });

  // Check newly unlocked achievements
  const newAchievements = checkAchievements(userId);

  saveDatabase();

  return {
    quest,
    xpEarned,
    goldEarned,
    statsGained: quest.statRewards || { discipline: 3 },
    profile: {
      level: profile.level,
      totalXp: profile.xp,
      currentLevelXp: levelInfo.currentLevelXp,
      nextLevelXp: levelInfo.nextLevelXp,
      progressPercent: levelInfo.progressPercent,
      gold: profile.gold,
      streak: profile.streak,
      stats: profile.stats,
      streakShields: profile.streakShields || 0
    },
    leveledUp,
    oldLevel,
    newLevel: profile.level,
    streakInfo,
    bossDamageDealt,
    bossDefeated,
    bossRewardXp,
    bossRewardGold,
    activeBoss,
    newAchievements
  };
}

module.exports = {
  calculateLevelFromXp,
  getXpForLevel,
  processStreak,
  checkAchievements,
  completeQuest
};
