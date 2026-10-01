// Achievements Trophy Hall View

async function renderAchievementsView() {
  const container = document.getElementById('viewContainer');
  if (!container) return;

  let achievements = [];
  try {
    const res = await window.api.getAchievements();
    achievements = res.achievements || [];
  } catch (err) {
    console.warn('Achievements fetch error:', err);
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  container.innerHTML = `
    <div class="section-header">
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold-glow); font-weight: 700;">HALL OF HEROES</div>
        <h2 class="section-title">🏆 Achievements & Milestones</h2>
        <div class="section-subtitle">Earn permanent glory and treasure as you conquer real-world life goals.</div>
      </div>
      <div class="stat-chip" style="background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.3);">
        <span>Trophies Unlocked:</span>
        <strong style="color: var(--gold-glow);">${unlockedCount} / ${achievements.length}</strong>
      </div>
    </div>

    <!-- ACHIEVEMENTS GRID -->
    <div class="achievements-grid">
      ${achievements.map(ach => `
        <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon-circle">${ach.icon}</div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
              <h4 style="font-size: 0.98rem; font-weight: 700; color: #fff;">${ach.name}</h4>
              <span class="badge" style="font-size: 0.65rem; background: rgba(255,255,255,0.06); color: var(--gold-glow);">${ach.rarity.toUpperCase()}</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.35; margin-bottom: 0.4rem;">${ach.description}</p>
            <div style="font-size: 0.76rem; font-weight: 600; display: flex; gap: 0.6rem;">
              <span style="color: var(--xp-glow);">+${ach.reward_xp} XP</span>
              <span style="color: var(--gold-glow);">+${ach.reward_gold} 🪙</span>
              ${ach.unlocked ? `<span style="color: var(--success-green); margin-left: auto;">✓ Unlocked</span>` : `<span style="color: var(--text-dim); margin-left: auto;">🔒 Locked</span>`}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
