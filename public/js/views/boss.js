// Boss Battle Arena View

async function renderBossView() {
  const container = document.getElementById('viewContainer');
  if (!container) return;

  let bossData = null;
  try {
    bossData = await window.api.getActiveBoss();
  } catch (err) {
    console.warn('Boss fetch error:', err);
  }

  const boss = bossData?.boss || window.state.activeBoss;
  const logs = bossData?.logs || [];
  const hpPercent = boss ? Math.max(0, Math.floor((boss.currentHp / boss.maxHp) * 100)) : 100;

  container.innerHTML = `
    <div class="section-header">
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--hp-red); font-weight: 700;">COLOSSEUM OF FOCUS</div>
        <h2 class="section-title">🐉 Boss Battle Arena</h2>
        <div class="section-subtitle">Real-life execution is your weapon. Every completed quest inflicts devastating critical damage.</div>
      </div>
    </div>

    <!-- MAIN BOSS SHOWCASE CARD WITH 3D ARENA PLATFORM -->
    <div class="rpg-card" style="background: linear-gradient(180deg, rgba(45, 15, 25, 0.85), rgba(18, 12, 18, 0.9)); border: 1px solid rgba(239, 68, 68, 0.4); text-align: center; padding: 2.5rem 1.5rem; margin-bottom: 2rem; position: relative;">
      
      <!-- 3D Boss Battle Arena Platform -->
      <div class="boss-arena-platform" style="margin-bottom: 2rem;">
        <div class="boss-arena-stage"></div>
        <div class="boss-floating-core">
          ${boss ? boss.avatar : '🐉'}
        </div>
      </div>

      <h2 style="font-family: var(--font-rpg); font-size: 2.2rem; color: #fff; margin-bottom: 0.25rem;">
        ${boss ? boss.name : 'Procrastination Dragon'}
      </h2>
      <div style="color: #fca5a5; font-size: 0.95rem; font-weight: 600; margin-bottom: 1.5rem;">
        ${boss ? boss.subtitle : 'The Dread of Tomorrow'}
      </div>

      <p style="max-width: 600px; margin: 0 auto 1.5rem auto; color: var(--text-muted); font-size: 0.92rem; line-height: 1.5;">
        ${boss ? boss.description : 'Feeds on delays, excuses, and unread tabs. Every completed quest inflicts severe damage to slay the beast!'}
      </p>

      <!-- GIANT HP BAR -->
      <div style="max-width: 650px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; font-weight: 800; font-family: var(--font-mono); font-size: 1.1rem; color: #f87171; margin-bottom: 0.5rem;">
          <span>HP STATUS</span>
          <span>${boss ? boss.currentHp : 1000} / ${boss ? boss.maxHp : 1000} (${hpPercent}%)</span>
        </div>
        <div class="boss-hp-track" style="height: 22px;">
          <div class="boss-hp-fill" style="width: ${hpPercent}%;"></div>
        </div>
      </div>

      <!-- BOSS DEFEAT REWARDS -->
      <div style="display: flex; justify-content: center; gap: 1.5rem; margin-top: 1.75rem; flex-wrap: wrap;">
        <div class="stat-chip" style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.4);">
          ⚡ Defeat Bounty: <strong>+${boss?.rewardXp || 1000} XP</strong>
        </div>
        <div class="stat-chip" style="background: rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.4);">
          🪙 Dragon Hoard: <strong>+${boss?.rewardGold || 500} Gold</strong>
        </div>
        <div class="stat-chip" style="background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.4);">
          🏆 Title: <strong>'Dragon Slayer'</strong>
        </div>
      </div>
    </div>

    <!-- COMBAT LOGS -->
    <div class="rpg-card">
      <h3 style="font-family: var(--font-rpg); font-size: 1.2rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
        <span>📜</span> Battle Logs
      </h3>

      ${logs.length > 0 ? `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${logs.map(l => `
            <div style="background: rgba(0,0,0,0.3); border-radius: var(--radius-sm); padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; border-left: 3px solid #ef4444;">
              <div>
                <span style="font-weight: 700; color: #fff;">⚔️ Quest Strike:</span>
                <span style="color: var(--text-muted); margin-left: 0.35rem;">${l.questTitle}</span>
              </div>
              <div style="font-family: var(--font-mono); font-weight: 700; color: #ef4444;">
                -${l.damage} HP
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <p style="color: var(--text-muted); font-size: 0.9rem;">
          No attacks recorded yet today. Complete a daily quest on your dashboard to deliver the opening blow!
        </p>
      `}
    </div>
  `;
}
