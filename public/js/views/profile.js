// Character Profile View: 6 RPG Attributes, Title, Pet, and Stats

function renderProfileView() {
  const container = document.getElementById('viewContainer');
  if (!container) return;

  const profile = window.state.profile;
  if (!profile) return;

  const stats = profile.stats || {
    knowledge: 50,
    technical: 50,
    discipline: 50,
    fitness: 50,
    creativity: 50,
    social: 50
  };

  const statConfig = [
    { key: 'knowledge', label: 'Knowledge', icon: '🧠', desc: 'Study, reading, and theory comprehension.', color: '#f59e0b' },
    { key: 'technical', label: 'Technical / Skill', icon: '💻', desc: 'Coding, engineering, and architecture.', color: '#38bdf8' },
    { key: 'discipline', label: 'Discipline', icon: '⚡', desc: 'Streaks, focus sessions, and punctuality.', color: '#a855f7' },
    { key: 'fitness', label: 'Fitness', icon: '💪', desc: 'Workouts, physical training, and stamina.', color: '#ef4444' },
    { key: 'creativity', label: 'Creativity', icon: '🎨', desc: 'Design, writing, and inventive thinking.', color: '#ec4899' },
    { key: 'social', label: 'Social / Community', icon: '🤝', desc: 'Communication, networking, and teamwork.', color: '#10b981' }
  ];

  container.innerHTML = `
    <div class="section-header">
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--xp-glow); font-weight: 700;">HERO SHEET</div>
        <h2 class="section-title">👤 Character Sheet & Attributes</h2>
        <div class="section-subtitle">Real-world actions shape your character's RPG DNA.</div>
      </div>
    </div>

    <!-- PROFILE HERO HEADER -->
    <div class="rpg-card" style="display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 1.25rem;">
        <div class="hero-avatar-frame" style="width: 84px; height: 84px; font-size: 2.8rem;">
          ${profile.avatar || '⚔️'}
        </div>
        <div>
          <h2 style="font-family: var(--font-rpg); font-size: 1.6rem; margin-bottom: 0.2rem;">
            ${profile.username}
          </h2>
          <div style="color: var(--gold-glow); font-weight: 600; font-size: 0.9rem; margin-bottom: 0.4rem;">
            🛡️ ${profile.activeTitle || profile.heroTitle || 'Vanguard'} • Level ${profile.level}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Companion: <strong>${profile.equippedPet || 'None (visit Shop)'}</strong>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <div style="text-align: center; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); padding: 0.75rem 1.25rem; border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted);">Total XP</div>
          <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700; color: var(--xp-glow);">${profile.xp}</div>
        </div>
        <div style="text-align: center; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); padding: 0.75rem 1.25rem; border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted);">Gold Coins</div>
          <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700; color: var(--gold-glow);">${profile.gold} 🪙</div>
        </div>
        <div style="text-align: center; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); padding: 0.75rem 1.25rem; border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted);">Streak</div>
          <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700; color: var(--streak-flame);">${profile.streak} Days 🔥</div>
        </div>
      </div>
    </div>

    <!-- 6 RPG ATTRIBUTES GRID -->
    <h3 style="font-family: var(--font-rpg); font-size: 1.25rem; margin-bottom: 1rem;">Core RPG Attributes</h3>
    <div class="stats-grid" style="margin-bottom: 2rem;">
      ${statConfig.map(s => {
        const val = stats[s.key] || 40;
        const percent = Math.min(100, Math.floor((val / 120) * 100));
        return `
          <div class="stat-metric-card">
            <div class="stat-metric-header">
              <span style="display: flex; align-items: center; gap: 0.4rem;">
                <span>${s.icon}</span>
                <span>${s.label}</span>
              </span>
              <span style="color: ${s.color}; font-family: var(--font-mono);">${val}</span>
            </div>
            <div class="stat-bar-track">
              <div class="stat-bar-fill" style="width: ${percent}%; background: ${s.color};"></div>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${s.desc}</div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- AVATAR & CUSTOMIZATION CARD -->
    <div class="rpg-card">
      <h3 style="font-family: var(--font-rpg); font-size: 1.15rem; margin-bottom: 0.75rem;">Change Character Avatar</h3>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        ${['⚔️', '🧙', '💻', '🗡️', '🧭', '🏹', '🐉', '⚡', '👑'].map(av => `
          <button class="icon-btn" onclick="updateAvatar('${av}')" style="font-size: 1.4rem; width: 44px; height: 44px; ${profile.avatar === av ? 'border-color: var(--xp-purple); background: rgba(168,85,247,0.3);' : ''}">
            ${av}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

async function updateAvatar(avatar) {
  try {
    window.soundFx.playClick();
    await window.api.updateProfile({ avatar });
    await window.state.refreshAll();
  } catch (err) {
    alert(err.message);
  }
}
