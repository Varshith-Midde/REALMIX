// Central Reactive State Store for Real-Life Quest

class StateStore {
  constructor() {
    this.profile = null;
    this.quests = [];
    this.activeBoss = null;
    this.campaigns = [];
    this.activeCampaign = null;
    this.achievements = [];
    this.inventory = [];
    this.shopItems = [];
    this.currentView = 'dashboard';
    this.listeners = [];

    // Active Quest timer state
    this.timerQuest = null;
    this.timerInterval = null;
    this.timerSeconds = 0;
    this.timerIsRunning = false;
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.updateHud();
    this.listeners.forEach(fn => fn(this));
  }

  async refreshAll() {
    try {
      const [profileData, questsData, bossData] = await Promise.all([
        window.api.getProfile(),
        window.api.getTodayQuests(),
        window.api.getActiveBoss()
      ]);

      this.profile = profileData;
      this.quests = questsData.quests || [];
      this.activeBoss = bossData.boss || null;

      // Also fetch active campaign if exists
      const campData = await window.api.getCampaigns();
      this.campaigns = campData.campaigns || [];
      this.activeCampaign = this.campaigns[this.campaigns.length - 1] || null;

      this.notify();
    } catch (err) {
      console.warn('Initial load warning:', err.message);
    }
  }

  updateHud() {
    if (!this.profile) return;

    const avatarEl = document.getElementById('hudAvatar');
    const usernameEl = document.getElementById('hudUsername');
    const levelBadgeEl = document.getElementById('hudLevelBadge');
    const xpPercentEl = document.getElementById('hudXpPercent');
    const xpFillEl = document.getElementById('hudXpFill');
    const goldEl = document.getElementById('hudGold');
    const streakEl = document.getElementById('hudStreak');
    const shieldEl = document.getElementById('hudShieldIndicator');

    if (avatarEl) avatarEl.textContent = this.profile.avatar || '⚔️';
    if (usernameEl) usernameEl.textContent = this.profile.username || 'Adventurer';
    if (levelBadgeEl) levelBadgeEl.textContent = `LVL ${this.profile.level || 1}`;

    const percent = this.profile.progressPercent || 0;
    if (xpPercentEl) xpPercentEl.textContent = `${percent}%`;
    if (xpFillEl) xpFillEl.style.width = `${percent}%`;

    if (goldEl) {
      const inrVal = ((this.profile.gold || 0) * 0.10).toFixed(1);
      goldEl.innerHTML = `${this.profile.gold || 0} <span style="font-size: 0.75rem; color: var(--gold-glow); opacity: 0.85;">(₹${inrVal})</span>`;
    }
    if (streakEl) streakEl.textContent = this.profile.streak || 1;

    if (shieldEl) {
      shieldEl.style.display = (this.profile.streakShields && this.profile.streakShields > 0) ? 'inline-block' : 'none';
    }
  }

  // Timer Controls
  startQuestTimer(quest) {
    this.timerQuest = quest;
    this.timerSeconds = 0;
    this.timerIsRunning = true;

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.timerIsRunning) {
        this.timerSeconds++;
        this.renderTimerDisplay();
      }
    }, 1000);

    this.renderTimerDisplay();
  }

  pauseResumeTimer() {
    this.timerIsRunning = !this.timerIsRunning;
    const btn = document.getElementById('pauseResumeTimerBtn');
    if (btn) {
      btn.textContent = this.timerIsRunning ? '⏸️ Pause' : '▶️ Resume';
    }
  }

  resetTimer() {
    this.timerSeconds = 0;
    this.renderTimerDisplay();
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerQuest = null;
    this.timerIsRunning = false;
  }

  renderTimerDisplay() {
    const display = document.getElementById('questTimerDisplay');
    if (!display) return;
    const hrs = String(Math.floor(this.timerSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((this.timerSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(this.timerSeconds % 60).padStart(2, '0');
    display.textContent = `${hrs}:${mins}:${secs}`;
  }
}

window.state = new StateStore();

// Confetti Particle System
window.spawnConfetti = function() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#f59e0b', '#fbbf24', '#a855f7', '#c084fc', '#10b981', '#38bdf8'];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 1.2) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015
    });
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.alpha -= p.decay;

      if (p.alpha > 0) {
        activeCount++;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(frame);
};
