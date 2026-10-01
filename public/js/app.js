// Global Helper to Scroll Window to Top smoothly and reliably
window.scrollToTop = function(smooth = false) {
  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'instant'
    });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  } catch (e) {
    window.scrollTo(0, 0);
  }
};

window.navigateTo = function(viewName) {
  window.soundFx.playClick();
  window.state.currentView = viewName;
  window.scrollToTop(false);

  // Update nav buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-view') === viewName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Render view
  switch (viewName) {
    case 'dashboard':
      renderDashboardView();
      break;
    case 'campaign':
      renderCampaignView();
      break;
    case 'boss':
      renderBossView();
      break;
    case 'profile':
      renderProfileView();
      break;
    case 'shop':
      renderShopView();
      break;
    case 'achievements':
      renderAchievementsView();
      break;
    case 'gameMaster':
      renderGameMasterView();
      break;
    case 'telangana':
      renderTelanganaView();
      break;
    default:
      renderDashboardView();
  }

  window.scrollToTop(false);
};

// Document Bootstrapper
document.addEventListener('DOMContentLoaded', async () => {
  // Navigation tabs click binding (desktop & mobile)
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.currentTarget.getAttribute('data-view');
      if (view) window.navigateTo(view);
    });
  });

  // Brand button returns to dashboard
  const brandBtn = document.getElementById('brandBtn');
  if (brandBtn) {
    brandBtn.addEventListener('click', () => window.navigateTo('dashboard'));
  }

  // Audio Toggle
  const audioBtn = document.getElementById('audioToggleBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isEnabled = window.soundFx.toggle();
      audioBtn.textContent = isEnabled ? '🔊' : '🔇';
      audioBtn.title = isEnabled ? 'Mute Sounds' : 'Unmute Sounds';
    });
  }

  // Demo Switcher
  const demoBtn = document.getElementById('demoSwitchBtn');
  if (demoBtn) {
    demoBtn.addEventListener('click', async () => {
      window.soundFx.playClick();
      await window.api.loadDemo();
      await window.state.refreshAll();
      window.navigateTo('dashboard');
    });
  }

  // New Campaign / Goal Modal Triggers
  const newCampBtn = document.getElementById('newCampaignBtn');
  const goalModal = document.getElementById('newGoalModal');
  const closeGoalModalBtn = document.getElementById('closeGoalModalBtn');

  if (newCampBtn && goalModal) {
    newCampBtn.addEventListener('click', () => {
      window.soundFx.playClick();
      goalModal.classList.add('active');
    });
  }

  if (closeGoalModalBtn && goalModal) {
    closeGoalModalBtn.addEventListener('click', () => {
      goalModal.classList.remove('active');
    });
  }

  // Campaign Form Submission
  const campaignForm = document.getElementById('campaignWizardForm');
  if (campaignForm) {
    campaignForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('generateCampaignSubmitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '🧙 <em>Weaving Campaign Chapters & Quests...</em>';

      const title = document.getElementById('wizardGoalTitle').value.trim();
      const category = document.getElementById('wizardCategory').value;
      const level = document.getElementById('wizardLevel').value;
      const availableMinutes = document.getElementById('wizardMinutes').value;
      const deadline = document.getElementById('wizardDeadline').value;

      try {
        window.soundFx.playQuestStart();
        const res = await window.api.generateCampaign({
          title,
          category,
          level,
          availableMinutes,
          deadline
        });

        goalModal.classList.remove('active');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🧙 Summon AI Campaign';

        window.soundFx.playLevelUp();
        window.spawnConfetti();

        await window.state.refreshAll();
        window.navigateTo('campaign');
      } catch (err) {
        alert('Generation failed: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🧙 Summon AI Campaign';
      }
    });
  }

  // Timer Modal Actions
  const closeTimerBtn = document.getElementById('closeTimerModalBtn');
  const timerModal = document.getElementById('questTimerModal');
  const pauseResumeBtn = document.getElementById('pauseResumeTimerBtn');
  const resetTimerBtn = document.getElementById('resetTimerBtn');
  const completeQuestBtn = document.getElementById('confirmCompleteQuestBtn');

  if (closeTimerBtn && timerModal) {
    closeTimerBtn.addEventListener('click', () => {
      window.state.stopTimer();
      timerModal.classList.remove('active');
    });
  }

  if (pauseResumeBtn) {
    pauseResumeBtn.addEventListener('click', () => {
      window.soundFx.playClick();
      window.state.pauseResumeTimer();
    });
  }

  if (resetTimerBtn) {
    resetTimerBtn.addEventListener('click', () => {
      window.soundFx.playClick();
      window.state.resetTimer();
    });
  }

  if (completeQuestBtn) {
    completeQuestBtn.addEventListener('click', async () => {
      const q = window.state.timerQuest;
      const notes = document.getElementById('questNotesInput').value.trim();
      if (!q) return;

      window.state.stopTimer();
      timerModal.classList.remove('active');
      document.getElementById('questNotesInput').value = '';

      await executeCompleteQuest(q.id, notes);
    });
  }

  // Reward Modal Close
  const closeRewardBtn = document.getElementById('closeRewardModalBtn');
  const rewardModal = document.getElementById('questRewardModal');
  if (closeRewardBtn && rewardModal) {
    closeRewardBtn.addEventListener('click', () => {
      window.soundFx.playClick();
      rewardModal.classList.remove('active');
    });
  }

  // Level Up Modal Close
  const closeLevelBtn = document.getElementById('closeLevelUpModalBtn');
  const levelModal = document.getElementById('levelUpModal');
  if (closeLevelBtn && levelModal) {
    closeLevelBtn.addEventListener('click', () => {
      window.soundFx.playClick();
      levelModal.classList.remove('active');
    });
  }

  // Subscribe state updates to re-render current view if needed
  window.state.subscribe(() => {
    // Current view can stay in sync
  });

  // Initial Load: if no user exists, load or initialize demo
  try {
    await window.state.refreshAll();
    if (!window.state.profile) {
      await window.api.loadDemo();
      await window.state.refreshAll();
    }
  } catch (e) {
    console.log('Bootstrapping initial state...');
    await window.api.loadDemo();
    await window.state.refreshAll();
  }

  // Initial Render
  window.navigateTo('dashboard');
});
