const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { db, saveDatabase, CLASSES } = require('./db');
const {
  calculateLevelFromXp,
  processStreak,
  completeQuest,
  checkAchievements
} = require('./gameEngine');
const {
  generateCampaignWithAI,
  handleGameMasterChat
} = require('./aiEngine');
const { DEFAULT_BOSSES } = require('./defaultData');
const { TELANGANA_CLASSES, TELANGANA_SYLLABUS } = require('./telanganaSyllabus');
const { getTopicStudyAndQuiz } = require('./studyEngine');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = (process.env.FRONTEND_URL || '').trim();

app.use(cors({
  origin: FRONTEND_URL || true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Simple session/auth helper
function getUserId(req) {
  return req.headers['x-user-id'] || 'user_demo_1';
}

// ---------------- AUTH ROUTES ----------------
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, heroClass = 'warrior', avatar = '⚔️' } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const existingUser = db.users.find(u => u.username.toLowerCase() === username.toLowerCase() || (email && u.email === email));
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const userId = `usr_${Date.now()}`;
    const newUser = {
      id: userId,
      username,
      email: email || `${username.toLowerCase()}@quest.local`,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);

    // Initial stats with class bonus
    const classConfig = CLASSES[heroClass] || CLASSES.warrior;
    const baseStats = {
      knowledge: 40,
      technical: 40,
      discipline: 45,
      fitness: 40,
      creativity: 40,
      social: 35
    };
    if (classConfig.statBonus) {
      for (const [k, v] of Object.entries(classConfig.statBonus)) {
        baseStats[k] = (baseStats[k] || 40) + v;
      }
    }

    const newProfile = {
      userId,
      username,
      heroClass,
      heroTitle: classConfig.title,
      avatar,
      level: 1,
      xp: 0,
      xpNext: 100,
      gold: 150, // Starter gold
      streak: 1,
      longestStreak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      streakShields: 1, // 1 free starter streak shield!
      activeBuffs: { xpPotionCharges: 0 },
      equippedPet: null,
      activeTitle: classConfig.title,
      stats: baseStats
    };
    db.profiles.push(newProfile);

    // Initialize Default Boss
    const starterBoss = {
      id: `boss_${Date.now()}`,
      bossDefId: DEFAULT_BOSSES[0].id,
      userId,
      name: DEFAULT_BOSSES[0].name,
      subtitle: DEFAULT_BOSSES[0].subtitle,
      avatar: DEFAULT_BOSSES[0].avatar,
      maxHp: DEFAULT_BOSSES[0].maxHp,
      currentHp: DEFAULT_BOSSES[0].currentHp,
      description: DEFAULT_BOSSES[0].description,
      rewardXp: DEFAULT_BOSSES[0].rewardXp,
      rewardGold: DEFAULT_BOSSES[0].rewardGold,
      status: 'active'
    };
    db.bosses.push(starterBoss);

    // Initialize starter inventory
    db.inventory.push({
      id: `inv_${Date.now()}`,
      userId,
      itemId: 'item_streak_shield',
      quantity: 1
    });

    saveDatabase();
    res.json({ user: newUser, profile: newProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { username } = req.body;
  const user = db.users.find(u => u.username.toLowerCase() === (username || '').toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Adventurer not found. Create an account first!' });
  }
  const profile = db.profiles.find(p => p.userId === user.id);
  res.json({ user, profile });
});

// Quick Instant Demo Adventurer
app.post('/api/auth/demo', (req, res) => {
  let demoUser = db.users.find(u => u.id === 'user_demo_1');
  if (!demoUser) {
    demoUser = {
      id: 'user_demo_1',
      username: 'Varshith',
      email: 'varshith@quest.local',
      createdAt: new Date().toISOString()
    };
    db.users.push(demoUser);

    const demoProfile = {
      userId: demoUser.id,
      username: demoUser.username,
      heroClass: 'engineer',
      heroTitle: 'Tech Artisan',
      avatar: '💻',
      level: 3,
      xp: 280,
      xpNext: 350,
      gold: 320,
      streak: 5,
      longestStreak: 5,
      lastActiveDate: new Date().toISOString().split('T')[0],
      streakShields: 1,
      activeBuffs: { xpPotionCharges: 0 },
      equippedPet: '🐉 Baby Coding Wyrm',
      activeTitle: 'The Relentless',
      stats: {
        knowledge: 65,
        technical: 78,
        discipline: 60,
        fitness: 50,
        creativity: 55,
        social: 45
      }
    };
    db.profiles.push(demoProfile);

    // Starter Boss
    db.bosses.push({
      id: `boss_demo_1`,
      bossDefId: DEFAULT_BOSSES[0].id,
      userId: demoUser.id,
      name: DEFAULT_BOSSES[0].name,
      subtitle: DEFAULT_BOSSES[0].subtitle,
      avatar: DEFAULT_BOSSES[0].avatar,
      maxHp: 1000,
      currentHp: 650, // partially damaged!
      description: DEFAULT_BOSSES[0].description,
      rewardXp: 1000,
      rewardGold: 500,
      status: 'active'
    });

    saveDatabase();
  }

  const profile = db.profiles.find(p => p.userId === demoUser.id);
  res.json({ user: demoUser, profile });
});

// ---------------- PROFILE ROUTES ----------------
app.get('/api/profile', (req, res) => {
  const userId = getUserId(req);
  let profile = db.profiles.find(p => p.userId === userId);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  const levelInfo = calculateLevelFromXp(profile.xp);
  res.json({
    ...profile,
    level: levelInfo.level,
    currentLevelXp: levelInfo.currentLevelXp,
    nextLevelXp: levelInfo.nextLevelXp,
    progressPercent: levelInfo.progressPercent
  });
});

app.put('/api/profile', (req, res) => {
  const userId = getUserId(req);
  const profile = db.profiles.find(p => p.userId === userId);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  const { avatar, activeTitle, equippedPet } = req.body;
  if (avatar) profile.avatar = avatar;
  if (activeTitle) profile.activeTitle = activeTitle;
  if (equippedPet !== undefined) profile.equippedPet = equippedPet;

  saveDatabase();
  res.json({ profile });
});

// ---------------- GOALS & CAMPAIGNS ----------------
app.post('/api/campaigns/generate', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { title, category, level, availableMinutes, deadline, userApiKey } = req.body;

    if (!title) return res.status(400).json({ error: 'Goal title is required' });

    // 1. Create Goal
    const goalId = `goal_${Date.now()}`;
    const newGoal = {
      id: goalId,
      userId,
      title,
      category: category || 'career',
      level: level || 'beginner',
      availableMinutes: Number(availableMinutes) || 45,
      deadline: deadline || '30 days',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    db.goals.push(newGoal);

    // 2. Generate Campaign with AI / Procedural Engine
    const generated = await generateCampaignWithAI(newGoal, userApiKey);

    // 3. Save Campaign
    const campaignId = `camp_${Date.now()}`;
    const newCampaign = {
      id: campaignId,
      userId,
      goalId,
      title: generated.campaign.title,
      description: generated.campaign.description,
      difficulty: generated.campaign.difficulty,
      estimatedDays: generated.campaign.estimated_days,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    db.campaigns.push(newCampaign);

    // 4. Save Chapters and Quests
    const createdChapters = [];
    const createdQuests = [];

    (generated.chapters || []).forEach((chap, cIdx) => {
      const chapterId = `chap_${campaignId}_${cIdx + 1}`;
      const newChapter = {
        id: chapterId,
        campaignId,
        title: chap.title,
        description: chap.description,
        orderIndex: cIdx + 1,
        status: cIdx === 0 ? 'ACTIVE' : 'LOCKED'
      };
      db.chapters.push(newChapter);
      createdChapters.push(newChapter);

      (chap.quests || []).forEach((q, qIdx) => {
        const questId = `qst_${chapterId}_${qIdx + 1}`;
        const newQuest = {
          id: questId,
          userId,
          campaignId,
          chapterId,
          title: q.title,
          description: q.description,
          type: q.type || 'task',
          difficulty: q.difficulty || 2,
          xp: q.xp || (q.difficulty * 50),
          gold: q.gold || Math.floor((q.xp || (q.difficulty * 50)) * 0.5),
          estimatedMinutes: q.estimatedMinutes || 30,
          statRewards: q.statRewards || { discipline: 4 },
          status: cIdx === 0 ? 'AVAILABLE' : 'LOCKED',
          createdAt: new Date().toISOString(),
          completedAt: null
        };
        db.quests.push(newQuest);
        createdQuests.push(newQuest);
      });
    });

    saveDatabase();

    res.json({
      goal: newGoal,
      campaign: newCampaign,
      chapters: createdChapters,
      quests: createdQuests
    });
  } catch (err) {
    console.error('Error generating campaign:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/campaigns', (req, res) => {
  const userId = getUserId(req);
  const campaigns = db.campaigns.filter(c => c.userId === userId);
  res.json({ campaigns });
});

app.get('/api/campaigns/:id', (req, res) => {
  const userId = getUserId(req);
  const campaign = db.campaigns.find(c => c.id === req.params.id && c.userId === userId);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

  const chapters = db.chapters.filter(ch => ch.campaignId === campaign.id);
  const quests = db.quests.filter(q => q.campaignId === campaign.id && q.userId === userId);

  res.json({ campaign, chapters, quests });
});

// ---------------- QUESTS ----------------
app.get('/api/quests/today', (req, res) => {
  const userId = getUserId(req);
  // Quests available or active for user
  const userQuests = db.quests.filter(q => q.userId === userId && q.status !== 'LOCKED');
  res.json({ quests: userQuests });
});

app.post('/api/quests', (req, res) => {
  const userId = getUserId(req);
  const { title, description, type = 'task', difficulty = 2, xp = 100, gold = 50, estimatedMinutes = 30 } = req.body;

  if (!title) return res.status(400).json({ error: 'Quest title is required' });

  const newQuest = {
    id: `qst_custom_${Date.now()}`,
    userId,
    campaignId: null,
    chapterId: null,
    title,
    description: description || 'Custom adventurer challenge',
    type,
    difficulty: Number(difficulty),
    xp: Number(xp),
    gold: Number(gold),
    estimatedMinutes: Number(estimatedMinutes),
    statRewards: { discipline: 4 },
    status: 'AVAILABLE',
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  db.quests.unshift(newQuest);
  saveDatabase();
  res.json({ quest: newQuest });
});

app.post('/api/quests/:id/start', (req, res) => {
  const userId = getUserId(req);
  const quest = db.quests.find(q => q.id === req.params.id && q.userId === userId);
  if (!quest) return res.status(404).json({ error: 'Quest not found' });

  quest.status = 'ACTIVE';
  quest.startedAt = new Date().toISOString();
  saveDatabase();
  res.json({ quest });
});

app.post('/api/quests/:id/complete', (req, res) => {
  try {
    const userId = getUserId(req);
    const { notes } = req.body;
    const result = completeQuest(userId, req.params.id, notes);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------- BOSS BATTLES ----------------
app.get('/api/bosses/active', (req, res) => {
  const userId = getUserId(req);
  let activeBoss = db.bosses.find(b => b.userId === userId && b.status === 'active');
  if (!activeBoss) {
    // Respawn or default
    activeBoss = {
      id: `boss_${Date.now()}`,
      bossDefId: DEFAULT_BOSSES[0].id,
      userId,
      name: DEFAULT_BOSSES[0].name,
      subtitle: DEFAULT_BOSSES[0].subtitle,
      avatar: DEFAULT_BOSSES[0].avatar,
      maxHp: DEFAULT_BOSSES[0].maxHp,
      currentHp: DEFAULT_BOSSES[0].maxHp,
      description: DEFAULT_BOSSES[0].description,
      rewardXp: DEFAULT_BOSSES[0].rewardXp,
      rewardGold: DEFAULT_BOSSES[0].rewardGold,
      status: 'active'
    };
    db.bosses.push(activeBoss);
    saveDatabase();
  }

  const logs = db.combat_logs.filter(l => l.userId === userId && l.bossId === activeBoss.id).slice(0, 10);
  res.json({ boss: activeBoss, logs });
});

// ---------------- ACHIEVEMENTS ----------------
app.get('/api/achievements', (req, res) => {
  const userId = getUserId(req);
  const userUnlocked = db.user_achievements.filter(ua => ua.userId === userId);
  const unlockedMap = {};
  userUnlocked.forEach(u => { unlockedMap[u.achievementId] = u.unlockedAt; });

  const achievements = db.achievements.map(ach => ({
    ...ach,
    unlocked: !!unlockedMap[ach.id],
    unlockedAt: unlockedMap[ach.id] || null
  }));

  res.json({ achievements });
});

// ---------------- SHOP & INVENTORY ----------------
app.get('/api/shop', (req, res) => {
  res.json({ items: db.shop_items });
});

app.get('/api/inventory', (req, res) => {
  const userId = getUserId(req);
  const userItems = db.inventory.filter(i => i.userId === userId);
  const detailed = userItems.map(inv => {
    const itemDef = db.shop_items.find(si => si.id === inv.itemId);
    return {
      ...inv,
      item: itemDef
    };
  });
  res.json({ inventory: detailed });
});

app.post('/api/shop/buy', (req, res) => {
  const userId = getUserId(req);
  const { itemId } = req.body;
  const item = db.shop_items.find(si => si.id === itemId);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const profile = db.profiles.find(p => p.userId === userId);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  if (profile.gold < item.price) {
    return res.status(400).json({ error: `Not enough gold! You need ${item.price} gold, but only have ${profile.gold}.` });
  }

  // Deduct gold
  profile.gold -= item.price;

  // Add to inventory or activate
  if (item.id === 'item_streak_shield') {
    profile.streakShields = (profile.streakShields || 0) + 1;
  } else if (item.id === 'item_xp_potion') {
    profile.activeBuffs.xpPotionCharges = (profile.activeBuffs.xpPotionCharges || 0) + 3;
  } else if (item.type === 'pet') {
    profile.equippedPet = `${item.icon} ${item.name}`;
  } else if (item.type === 'cosmetic') {
    profile.activeTitle = 'The Relentless';
  }

  const existingInv = db.inventory.find(i => i.userId === userId && i.itemId === itemId);
  if (existingInv) {
    existingInv.quantity += 1;
  } else {
    db.inventory.push({
      id: `inv_${Date.now()}`,
      userId,
      itemId,
      quantity: 1
    });
  }

  saveDatabase();
  res.json({
    message: `Purchased ${item.name}!`,
    profile,
    item
  });
});

// ---------------- GAME MASTER AI CHAT ----------------
app.post('/api/ai/game-master', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { message, userApiKey } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const profile = db.profiles.find(p => p.userId === userId) || {};
    const activeCampaign = db.campaigns.find(c => c.userId === userId && c.status === 'ACTIVE') || {};

    const context = {
      level: profile.level,
      heroClass: profile.heroClass,
      streak: profile.streak,
      campaignTitle: activeCampaign.title,
      goalTitle: activeCampaign.title
    };

    const response = await handleGameMasterChat(message, context, userApiKey);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- TELANGANA GOVERNMENT BOARD SYLLABUS ----------------
app.get('/api/telangana/classes', (req, res) => {
  res.json({ classes: TELANGANA_CLASSES });
});

app.get('/api/telangana/syllabus/:classId', (req, res) => {
  const { classId } = req.params;
  const syl = TELANGANA_SYLLABUS[classId];
  if (!syl) {
    // Generate a generic SCERT structure if not explicitly hardcoded
    const clsObj = TELANGANA_CLASSES.find(c => c.id === classId) || { name: classId };
    return res.json({
      syllabus: {
        title: `Telangana SCERT ${clsObj.name}`,
        subjects: [
          {
            name: "Mathematics (గణితం)",
            chapters: [
              { title: "Numbers & Operations", quests: ["Solve exercise 1 & 2 problem set", "Practice formula derivations"] },
              { title: "Geometry & Spatial Measurements", quests: ["Draw accurate geometric shapes", "Calculate area and perimeter exercises"] }
            ]
          },
          {
            name: "General Science (విజ్ఞాన శాస్త్రం)",
            chapters: [
              { title: "Living World & Ecology", quests: ["Study plant and animal cell structures", "Document local flora and fauna"] },
              { title: "Matter & Physical Changes", quests: ["Review physical vs chemical changes", "Solve textbook conceptual questions"] }
            ]
          },
          {
            name: "Social Studies (సాంఘిక శాస్త్రం)",
            chapters: [
              { title: "Telangana Heritage & Geography", quests: ["Trace Godavari and Krishna river courses in Telangana", "Study Kakatiya dynasty architecture (Ramappa & Thousand Pillar)"] }
            ]
          }
        ]
      }
    });
  }
  res.json({ syllabus: syl });
});

app.post('/api/telangana/generate-campaign', (req, res) => {
  try {
    const userId = getUserId(req);
    const { classId, subjectName, stream = 'mpc', days = 45 } = req.body;

    const classInfo = TELANGANA_CLASSES.find(c => c.id === classId) || { name: "Telangana Board Curriculum" };
    let syl = TELANGANA_SYLLABUS[classId];

    let chosenSubject = null;
    if (syl) {
      if (Array.isArray(syl.subjects)) {
        chosenSubject = syl.subjects.find(s => s.name === subjectName) || syl.subjects[0];
      } else if (syl.subjects && syl.subjects[stream.toLowerCase()]) {
        chosenSubject = syl.subjects[stream.toLowerCase()].find(s => s.name === subjectName) || syl.subjects[stream.toLowerCase()][0];
      }
    }

    if (!chosenSubject) {
      chosenSubject = {
        name: subjectName || "Core TS Curriculum",
        chapters: [
          { title: "Foundations & High-Yield Theory", quests: ["Complete syllabus chapter 1 notes", "Solve 5 model questions"] },
          { title: "Advanced Problems & Model Papers", quests: ["Work through 3 previous year board questions", "Complete 45-min timed test"] }
        ]
      };
    }

    // 1. Goal
    const goalId = `goal_tg_${Date.now()}`;
    const newGoal = {
      id: goalId,
      userId,
      title: `${classInfo.name} - ${chosenSubject.name}`,
      category: 'education',
      level: 'intermediate',
      availableMinutes: 45,
      deadline: `${days} days`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    db.goals.push(newGoal);

    // 2. Campaign
    const campaignId = `camp_tg_${Date.now()}`;
    const newCampaign = {
      id: campaignId,
      userId,
      goalId,
      title: `${classInfo.name}: ${chosenSubject.name} Board Arc`,
      description: `Official Telangana State Board curriculum campaign. Master textbook chapters, conquer previous-year board questions, and defeat the final exam wyrm!`,
      difficulty: 'intermediate',
      estimatedDays: Number(days),
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    db.campaigns.push(newCampaign);

    // 3. Chapters & Quests
    const createdChapters = [];
    const createdQuests = [];

    chosenSubject.chapters.forEach((ch, cIdx) => {
      const chapterId = `chap_${campaignId}_${cIdx + 1}`;
      const newChapter = {
        id: chapterId,
        campaignId,
        title: `Chapter ${cIdx + 1}: ${ch.title}`,
        description: ch.weightage ? `IPE Weightage: ${ch.weightage}` : 'TS Board Syllabus Essential Topic',
        orderIndex: cIdx + 1,
        status: cIdx === 0 ? 'ACTIVE' : 'LOCKED'
      };
      db.chapters.push(newChapter);
      createdChapters.push(newChapter);

      const questTitles = ch.quests || [`Study ${ch.title} for 45 minutes`, `Solve 5 textbook problems for ${ch.title}`];

      questTitles.forEach((qText, qIdx) => {
        const questId = `qst_${chapterId}_${qIdx + 1}`;
        const newQuest = {
          id: questId,
          userId,
          campaignId,
          chapterId,
          title: qText,
          description: `Telangana Board Prep: Master ${ch.title}. Read text, write formulas, or solve questions without looking at solutions.`,
          type: qIdx % 2 === 0 ? 'study' : 'challenge',
          difficulty: 2 + (qIdx % 3),
          xp: 100 + (qIdx * 40),
          gold: 50 + (qIdx * 20),
          estimatedMinutes: 45,
          statRewards: { knowledge: 8, discipline: 5 },
          status: cIdx === 0 ? 'AVAILABLE' : 'LOCKED',
          createdAt: new Date().toISOString(),
          completedAt: null
        };
        db.quests.push(newQuest);
        createdQuests.push(newQuest);
      });
    });

    // 4. Set Custom Telangana Boss if available
    if (syl?.boss) {
      const existingBoss = db.bosses.find(b => b.userId === userId && b.status === 'active');
      if (existingBoss) {
        existingBoss.name = syl.boss.name;
        existingBoss.subtitle = syl.boss.subtitle;
        existingBoss.avatar = syl.boss.avatar;
        existingBoss.maxHp = syl.boss.maxHp;
        existingBoss.currentHp = syl.boss.maxHp;
      }
    }

    saveDatabase();

    res.json({
      goal: newGoal,
      campaign: newCampaign,
      chapters: createdChapters,
      quests: createdQuests
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- REAL MONEY & EXTRA GOLD COINS ----------------
app.get('/api/real-money/store', (req, res) => {
  const userId = getUserId(req);
  const profile = db.profiles.find(p => p.userId === userId) || {};
  const currentGold = profile.gold || 0;
  // 100 Gold = 10 INR (1 Gold = 0.10 INR)
  const inrEquivalent = (currentGold * 0.10).toFixed(2);

  res.json({
    gold: currentGold,
    inrEquivalent,
    exchangeRateText: "100 Gold Coins = ₹10.00 INR (10 Gold = ₹1.00 INR)",
    packs: db.real_money_packs,
    rewards: db.real_money_rewards
  });
});

app.post('/api/real-money/buy-gold', (req, res) => {
  try {
    const userId = getUserId(req);
    const { packId, paymentMethod = 'UPI' } = req.body;

    const pack = db.real_money_packs.find(p => p.id === packId);
    if (!pack) return res.status(404).json({ error: 'Coin pack not found' });

    const profile = db.profiles.find(p => p.userId === userId);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    // Credit gold
    profile.gold += pack.goldAmount;

    // Apply perks
    if (pack.bonusShields) {
      profile.streakShields = (profile.streakShields || 0) + pack.bonusShields;
    }
    if (pack.bonusPotion) {
      profile.activeBuffs.xpPotionCharges = (profile.activeBuffs.xpPotionCharges || 0) + (pack.bonusPotion * 3);
    }
    if (pack.petUnlocked) {
      profile.equippedPet = pack.petUnlocked;
    }
    if (pack.titleUnlocked) {
      profile.activeTitle = pack.titleUnlocked;
    }

    // Record real money transaction
    const txId = `tx_rm_${Date.now()}`;
    const newTx = {
      id: txId,
      userId,
      type: 'buy_gold',
      packName: pack.name,
      amountInr: pack.priceInr,
      goldCredited: pack.goldAmount,
      paymentMethod,
      paymentStatus: 'SUCCESS',
      timestamp: new Date().toISOString()
    };
    db.real_money_transactions.unshift(newTx);

    saveDatabase();

    res.json({
      success: true,
      message: `🎉 Payment of ₹${pack.priceInr} Successful! Added +${pack.goldAmount} Gold Coins to your pouch!`,
      profile,
      transaction: newTx
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/real-money/redeem', (req, res) => {
  try {
    const userId = getUserId(req);
    const { rewardId, upiId = '', email = '' } = req.body;

    const reward = db.real_money_rewards.find(r => r.id === rewardId);
    if (!reward) return res.status(404).json({ error: 'Reward option not found' });

    const profile = db.profiles.find(p => p.userId === userId);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    if (profile.gold < reward.goldCost) {
      return res.status(400).json({
        error: `Insufficient Gold! You need ${reward.goldCost} Gold Coins to cash out ₹${reward.realValueInr}, but you currently have ${profile.gold} Gold.`
      });
    }

    // Deduct gold
    profile.gold -= reward.goldCost;

    // Generate Voucher or UPI Payout Reference
    const refCode = `RLQ-INR-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx = {
      id: `tx_redeem_${Date.now()}`,
      userId,
      type: 'redeem_cashout',
      rewardName: reward.name,
      goldDeducted: reward.goldCost,
      realValueInr: reward.realValueInr,
      referenceCode: refCode,
      destination: upiId || email || 'Digital Delivery',
      status: 'PROCESSING_DISBURSED',
      timestamp: new Date().toISOString()
    };
    db.real_money_transactions.unshift(newTx);

    saveDatabase();

    res.json({
      success: true,
      message: `💸 Cashout Approved! ₹${reward.realValueInr} voucher/transfer initiated with code ${refCode}!`,
      profile,
      transaction: newTx
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/real-money/transactions', (req, res) => {
  const userId = getUserId(req);
  const userTxs = db.real_money_transactions.filter(t => t.userId === userId);
  res.json({ transactions: userTxs });
});

// ---------------- RESET / SEED FOR TESTING ----------------
app.post('/api/settings/reset', (req, res) => {
  const userId = getUserId(req);
  db.quests = db.quests.filter(q => q.userId !== userId);
  db.campaigns = db.campaigns.filter(c => c.userId !== userId);
  db.goals = db.goals.filter(g => g.userId !== userId);
  db.user_achievements = db.user_achievements.filter(ua => ua.userId !== userId);
  db.inventory = db.inventory.filter(i => i.userId !== userId);
  db.bosses = db.bosses.filter(b => b.userId !== userId);
  saveDatabase();
  res.json({ message: 'User adventure data successfully reset!' });
});

// ---------------- TOPIC STUDY & CHALLENGE ROUTES ----------------

// GET topic study notes + quiz for a chapter
app.post('/api/study/topic', async (req, res) => {
  try {
    const { topicTitle, subject, classId } = req.body;
    if (!topicTitle) return res.status(400).json({ error: 'topicTitle is required' });
    const content = await getTopicStudyAndQuiz(topicTitle, subject, classId);
    res.json({ topic: content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit challenge quiz answers & award XP + Gold based on performance
app.post('/api/study/submit-quiz', (req, res) => {
  try {
    const userId = getUserId(req);
    const { topicTitle, subject, classId, answers, questions } = req.body;
    // answers = array of {questionId, selectedIndex}
    // questions = array of {id, correctIndex, explanation}

    const profile = db.profiles.find(p => p.userId === userId);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    // Score the quiz
    let correctCount = 0;
    const results = (answers || []).map(ans => {
      const q = (questions || []).find(qq => qq.id === ans.questionId);
      const correct = q && (ans.selectedIndex === q.correctIndex);
      if (correct) correctCount++;
      return {
        questionId: ans.questionId,
        correct,
        selectedIndex: ans.selectedIndex,
        correctIndex: q ? q.correctIndex : 0,
        explanation: q ? q.explanation : ''
      };
    });

    const total = questions ? questions.length : 3;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // XP and gold based on performance
    let xpReward = 0, goldReward = 0, grade = '';
    if (pct === 100) {
      xpReward = 150; goldReward = 75; grade = 'S';
    } else if (pct >= 67) {
      xpReward = 100; goldReward = 50; grade = 'A';
    } else if (pct >= 34) {
      xpReward = 60; goldReward = 25; grade = 'B';
    } else {
      xpReward = 20; goldReward = 0; grade = 'C';
    }

    // Apply streak XP multiplier
    const streakMult = Math.min(1.0 + (profile.streak || 1) * 0.05, 2.0);
    const finalXp = Math.round(xpReward * streakMult);

    // Apply XP potion buff
    const potionCharges = profile.activeBuffs?.xpPotionCharges || 0;
    let bonusXp = 0;
    if (potionCharges > 0) {
      bonusXp = Math.round(finalXp * 0.5);
      profile.activeBuffs.xpPotionCharges = potionCharges - 1;
    }

    profile.xp = (profile.xp || 0) + finalXp + bonusXp;
    profile.gold = (profile.gold || 0) + goldReward;

    // Check level up
    const { calculateLevelFromXp } = require('./gameEngine');
    const levelData = calculateLevelFromXp(profile.xp);
    let leveledUp = false;
    if (levelData.level > profile.level) {
      profile.level = levelData.level;
      profile.gold += 100; // Level-up gold bonus
      goldReward += 100;
      leveledUp = true;
    }
    profile.xpNext = levelData.xpToNext;

    // Log study activity
    if (!db.study_log) db.study_log = [];
    db.study_log.unshift({
      id: `study_${Date.now()}`,
      userId,
      topicTitle,
      subject,
      classId,
      correctCount,
      total,
      pct,
      grade,
      xpEarned: finalXp + bonusXp,
      goldEarned: goldReward,
      timestamp: new Date().toISOString()
    });

    saveDatabase();

    res.json({
      success: true,
      correctCount,
      total,
      pct,
      grade,
      results,
      xpEarned: finalXp + bonusXp,
      goldEarned: goldReward,
      leveledUp,
      newLevel: profile.level,
      profile
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET study log/history for user
app.get('/api/study/log', (req, res) => {
  const userId = getUserId(req);
  const log = (db.study_log || []).filter(l => l.userId === userId);
  res.json({ log: log.slice(0, 20) });
});

// Start Server
app.listen(PORT, () => {
  console.log(`⚔️ Real-Life Quest server running on http://localhost:${PORT}`);
});
