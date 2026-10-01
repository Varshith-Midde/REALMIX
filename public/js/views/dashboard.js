// Dashboard View: Hero HUD, Boss Bar, Daily Quest Board, Quick Actions

function renderDashboardView() {
  const container = document.getElementById('viewContainer');
  if (!container) return;

  const profile = window.state.profile;
  const quests = window.state.quests || [];
  const boss = window.state.activeBoss;

  if (!profile) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚔️</div>
        <h2 style="font-family: var(--font-rpg); font-size: 1.8rem; margin-bottom: 0.5rem;">Awaken Your Character</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Loading your hero profile or initializing your journey...</p>
        <button class="btn-primary" onclick="window.api.loadDemo().then(() => window.state.refreshAll())">Load Demo Adventurer</button>
      </div>
    `;
    return;
  }

  const activeQuests = quests.filter(q => q.status !== 'COMPLETED');
  const completedToday = quests.filter(q => q.status === 'COMPLETED');

  // Boss HP percent
  const bossHpPercent = boss ? Math.max(0, Math.floor((boss.currentHp / boss.maxHp) * 100)) : 100;

  container.innerHTML = `
    <!-- TOP DASHBOARD HERO CARD -->
    <div class="rpg-card hero-character-card rpg-card-glow" style="margin-bottom: 1.75rem;">
      <div class="hero-avatar-area">
        <div class="hero-avatar-frame">${profile.avatar || '⚔️'}</div>
        <div class="hero-details">
          <h2>
            ${profile.username}
            <span class="hero-level-tag">LEVEL ${profile.level}</span>
          </h2>
          <div class="hero-class-title">
            <span>🛡️ ${profile.activeTitle || profile.heroTitle || 'Novice Vanguard'}</span>
            ${profile.equippedPet ? `• <span>🐾 ${profile.equippedPet}</span>` : ''}
          </div>

          <div class="hero-stat-chips">
            <div class="stat-chip" title="Knowledge Stat">🧠 <strong>${profile.stats?.knowledge || 50}</strong> Knowledge</div>
            <div class="stat-chip" title="Technical Skill Stat">💻 <strong>${profile.stats?.technical || 50}</strong> Technical</div>
            <div class="stat-chip" title="Discipline Stat">⚡ <strong>${profile.stats?.discipline || 50}</strong> Discipline</div>
            <div class="stat-chip" title="Fitness Stat">💪 <strong>${profile.stats?.fitness || 50}</strong> Fitness</div>
          </div>
        </div>
      </div>

      <div style="min-width: 240px; text-align: right;">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.08em;">Character Progression</div>
        <div style="font-family: var(--font-rpg); font-size: 1.4rem; color: var(--xp-glow); font-weight: 800; margin: 0.2rem 0;">
          ${profile.xp} <span style="font-size: 0.9rem; color: var(--text-dim);">/ ${profile.xp + (profile.nextLevelXp - (profile.currentLevelXp || 0))} XP</span>
        </div>
        <div class="xp-track-large" style="margin-top: 0.4rem;">
          <div class="xp-fill-large" style="width: ${profile.progressPercent || 0}%;"></div>
        </div>
        <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.35rem;">
          ${profile.progressPercent || 0}% toward Level ${profile.level + 1}
        </div>
      </div>
    </div>

    <!-- MAIN TWO COLUMN GRID -->
    <div class="dashboard-grid">
      
      <!-- LEFT: DAILY QUEST BOARD -->
      <div>
        <div class="section-header">
          <div>
            <h2 class="section-title">⚔️ Today's Quest Board</h2>
            <div class="section-subtitle">Complete daily real-life actions to claim XP, level up, and deal boss damage</div>
          </div>
          <button class="btn-secondary btn-sm" id="addQuickQuestBtn">+ Custom Quest</button>
        </div>

        <div class="quest-list" id="dashboardQuestList">
          ${renderQuestCards(activeQuests, completedToday)}
        </div>
      </div>

      <!-- RIGHT COLUMN: BOSS & STREAK WIDGETS -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- ACTIVE BOSS WIDGET -->
        ${boss ? `
        <div class="rpg-card boss-banner-widget" id="bossCardWidget">
          <div class="boss-header-row">
            <div class="boss-avatar-frame">${boss.avatar || '🐉'}</div>
            <div>
              <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--hp-red); font-weight: 700;">EPIC BOSS BATTLE</div>
              <h3 style="font-family: var(--font-rpg); font-size: 1.15rem; color: #fff;">${boss.name}</h3>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${boss.subtitle || 'Guardian of Procrastination'}</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; color: #fca5a5;">
            <span>BOSS HP</span>
            <span>${boss.currentHp} / ${boss.maxHp} (${bossHpPercent}%)</span>
          </div>

          <div class="boss-hp-track">
            <div class="boss-hp-fill" style="width: ${bossHpPercent}%;"></div>
          </div>

          <div class="boss-callout">
            <span>🗡️</span>
            <span>Completing any quest strikes this monster with heavy damage!</span>
          </div>
        </div>
        ` : ''}

        <!-- STREAK & SHIELD CARD -->
        <div class="rpg-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.6rem;">🔥</span>
              <div>
                <div style="font-family: var(--font-rpg); font-size: 1.1rem; font-weight: 700;">${profile.streak} Day Streak</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Personal Best: ${profile.longestStreak || profile.streak} days</div>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 1.4rem;">🛡️</span>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${profile.streakShields || 0} Shield(s)</div>
            </div>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">
            Complete at least 1 quest today to extend your flame. Streak Shields automatically protect your streak if you miss a day!
          </p>
        </div>

        <!-- TELANGANA STUDY SHORTCUT -->
        <div class="rpg-card" style="background: linear-gradient(135deg, rgba(12,8,30,0.9), rgba(25,10,50,0.7)); border: 1px solid rgba(168,85,247,0.3);">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem;">
            <span style="font-size: 1.4rem;">🏛️</span>
            <div style="font-family: var(--font-rpg); font-size: 0.92rem; font-weight: 700; color: var(--xp-glow);">Telangana Study Arc</div>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 0.85rem;">
            Study board topics chapter-by-chapter, take challenge quizzes, and earn <strong style="color: var(--gold-glow);">Gold coins</strong> for correct answers!
          </p>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-primary btn-sm" onclick="window.navigateTo('telangana')" style="flex: 1; justify-content: center;">
              📚 Study Now
            </button>
          </div>
        </div>

        <!-- GAME MASTER QUICK ADVICE -->
        <div class="rpg-card rpg-card-gold" style="background: rgba(30, 24, 15, 0.7);">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
            <span style="font-size: 1.4rem;">🧙</span>
            <div style="font-family: var(--font-rpg); font-size: 0.95rem; font-weight: 700; color: var(--gold-glow);">Game Master Advice</div>
          </div>
          <p style="font-size: 0.84rem; color: #fde68a; line-height: 1.45; margin-bottom: 0.85rem;">
            "A master adventurer doesn't conquer a mountain in a single leap. Finish today's focused task, collect your gold, and let tomorrow's quest find you ready."
          </p>
          <button class="btn-secondary btn-sm" onclick="window.navigateTo('gameMaster')" style="width: 100%; justify-content: center;">
            Open Game Master Sanctum 🤖
          </button>
        </div>

      </div>
    </div>
  `;

  // Attach handlers
  attachDashboardHandlers();
}

function renderQuestCards(activeQuests, completedToday) {
  if (activeQuests.length === 0 && completedToday.length === 0) {
    return `
      <div class="rpg-card" style="text-align: center; padding: 3rem 1.5rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🌱</div>
        <h3 style="font-family: var(--font-rpg); font-size: 1.25rem; margin-bottom: 0.4rem;">Your Quest Log is Clear</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">
          You have no active quests right now. Generate a new campaign or forge a quick custom quest!
        </p>
        <button class="btn-primary" onclick="document.getElementById('newGoalModal').classList.add('active')">
          ✨ Summon AI Campaign
        </button>
      </div>
    `;
  }

  let html = '';

  activeQuests.forEach(q => {
    const stars = '⭐'.repeat(Math.min(5, Math.max(1, q.difficulty || 2)));
    const badgeClass = `badge-${q.type || 'task'}`;

    html += `
      <div class="quest-card" data-quest-id="${q.id}">
        <div class="quest-main">
          <div class="quest-meta-row">
            <span class="badge ${badgeClass}">${q.type || 'TASK'}</span>
            <span style="font-size: 0.78rem; color: #fbbf24;" title="Difficulty Tier">${stars}</span>
            <span class="quest-reward-pill quest-reward-time">⏱️ ${q.estimatedMinutes || 30}m</span>
          </div>
          <div class="quest-title">${q.title}</div>
          <div class="quest-desc">${q.description}</div>
          <div class="quest-rewards-row">
            <span class="quest-reward-pill quest-reward-xp">⚡ +${q.xp} XP</span>
            <span class="quest-reward-pill quest-reward-gold">🪙 +${q.gold} Gold</span>
          </div>
        </div>

        <div class="quest-actions">
          <button class="btn-secondary btn-sm start-timer-btn" data-id="${q.id}">⏱️ Focus</button>
          <button class="btn-primary btn-sm complete-quest-btn" data-id="${q.id}">⚔️ Complete</button>
        </div>
      </div>
    `;
  });

  if (completedToday.length > 0) {
    html += `
      <div style="margin-top: 1.5rem; margin-bottom: 0.75rem; font-size: 0.85rem; font-weight: 700; color: var(--success-green); display: flex; align-items: center; gap: 0.4rem;">
        <span>✓</span> Completed Quests Today (${completedToday.length})
      </div>
    `;
    completedToday.forEach(q => {
      html += `
        <div class="quest-card completed">
          <div class="quest-main">
            <div class="quest-meta-row">
              <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">✓ COMPLETED</span>
              <span class="quest-reward-pill quest-reward-xp">+${q.xp} XP</span>
              <span class="quest-reward-pill quest-reward-gold">+${q.gold} Gold</span>
            </div>
            <div class="quest-title" style="text-decoration: line-through; color: var(--text-muted);">${q.title}</div>
          </div>
        </div>
      `;
    });
  }

  return html;
}

function attachDashboardHandlers() {
  // Complete quest buttons
  document.querySelectorAll('.complete-quest-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const qId = e.currentTarget.getAttribute('data-id');
      await executeCompleteQuest(qId);
    });
  });

  // Focus Timer buttons
  document.querySelectorAll('.start-timer-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const qId = e.currentTarget.getAttribute('data-id');
      const quest = window.state.quests.find(q => q.id === qId);
      if (!quest) return;

      window.soundFx.playQuestStart();
      openQuestTimerModal(quest);
    });
  });

  // Add quick quest button
  const addQuickBtn = document.getElementById('addQuickQuestBtn');
  if (addQuickBtn) {
    addQuickBtn.addEventListener('click', () => {
      const title = prompt('Enter Quest Title (e.g. Study DBMS for 45 minutes, Solve 5 DSA):');
      if (title) {
        window.api.createCustomQuest({ title, estimatedMinutes: 30, xp: 100, gold: 50 }).then(() => {
          window.state.refreshAll();
        });
      }
    });
  }
}

// Global Complete Quest Flow
async function executeCompleteQuest(questId, notes = '') {
  try {
    window.soundFx.playClick();
    const result = await window.api.completeQuest(questId, notes);

    // Audio & Confetti & 3D Shockwave
    window.soundFx.playQuestComplete();
    window.spawnConfetti();
    if (window.triggerQuestCompleteEffect) {
      window.triggerQuestCompleteEffect();
    }

    // If boss took hit
    if (result.bossDamageDealt > 0) {
      setTimeout(() => {
        window.soundFx.playBossHit();
        if (window.triggerBossHitEffect) window.triggerBossHitEffect();
        const bossWidget = document.getElementById('bossCardWidget');
        if (bossWidget) {
          bossWidget.classList.add('shake-hit');
          setTimeout(() => bossWidget.classList.remove('shake-hit'), 500);
        }
      }, 250);
    }

    // Refresh state
    await window.state.refreshAll();

    // Show Reward Popup
    showRewardModal(result);

    // Check if leveled up!
    if (result.leveledUp) {
      setTimeout(() => {
        window.soundFx.playLevelUp();
        if (window.triggerLevelUpEffect) window.triggerLevelUpEffect();
        showLevelUpModal(result.newLevel);
      }, 900);
    }
  } catch (err) {
    alert(err.message);
  }
}

function openQuestTimerModal(quest) {
  const modal = document.getElementById('questTimerModal');
  const title = document.getElementById('modalQuestTitle');
  const desc = document.getElementById('modalQuestDesc');
  const badge = document.getElementById('modalQuestBadge');

  if (title) title.textContent = quest.title;
  if (desc) desc.textContent = quest.description;
  if (badge) badge.textContent = `⚔️ ${quest.type?.toUpperCase() || 'QUEST'}`;

  window.state.startQuestTimer(quest);
  modal.classList.add('active');
}

function showRewardModal(result) {
  const modal = document.getElementById('questRewardModal');
  const title = document.getElementById('rewardModalQuestTitle');
  const xp = document.getElementById('rewardXpDisplay');
  const gold = document.getElementById('rewardGoldDisplay');
  const bossDmg = document.getElementById('rewardBossDamageText');
  const statsGained = document.getElementById('rewardStatsGained');

  if (title) title.textContent = result.quest.title;
  if (xp) xp.textContent = `+${result.xpEarned} XP`;
  if (gold) gold.textContent = `+${result.goldEarned} 🪙`;
  if (bossDmg) bossDmg.textContent = `-${result.bossDamageDealt} HP`;

  if (statsGained && result.statsGained) {
    const statsList = Object.entries(result.statsGained)
      .map(([k, v]) => `+${v} ${k.charAt(0).toUpperCase() + k.slice(1)}`)
      .join(' • ');
    statsGained.innerHTML = `Character Attribute Gains: <strong>${statsList}</strong>`;
  }

  modal.classList.add('active');
}

function showLevelUpModal(newLevel) {
  const modal = document.getElementById('levelUpModal');
  const lvlText = document.getElementById('newLevelBadgeText');
  if (lvlText) lvlText.textContent = `LEVEL ${newLevel}`;
  modal.classList.add('active');
}
