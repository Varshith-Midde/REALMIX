// Campaign View: Interactive Multi-Chapter Map Tree & Milestones

async function renderCampaignView() {
  const container = document.getElementById('viewContainer');
  if (!container) return;

  const campaigns = window.state.campaigns || [];
  const activeCamp = window.state.activeCampaign;

  if (!activeCamp) {
    container.innerHTML = `
      <div class="rpg-card" style="text-align: center; padding: 4rem 2rem;">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🗺️</div>
        <h2 style="font-family: var(--font-rpg); font-size: 1.8rem; margin-bottom: 0.5rem;">No Active Campaign</h2>
        <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem auto;">
          Transform your real-life goal into a structured adventure map. The AI Game Master will plot out progressive chapters leading up to a Final Boss.
        </p>
        <button class="btn-primary" onclick="document.getElementById('newGoalModal').classList.add('active')">
          ✨ Summon AI Campaign
        </button>
      </div>
    `;
    return;
  }

  // Fetch campaign full details (chapters & quests)
  let details = null;
  try {
    details = await window.api.getCampaignDetails(activeCamp.id);
  } catch (err) {
    console.warn('Failed to load campaign details:', err);
  }

  const chapters = details?.chapters || [];
  const quests = details?.quests || [];

  container.innerHTML = `
    <div class="section-header">
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold-glow); font-weight: 700;">ACTIVE CAMPAIGN ARC</div>
        <h2 class="section-title" style="font-size: 1.6rem;">🗺️ ${activeCamp.title}</h2>
        <div class="section-subtitle">${activeCamp.description || 'Your structured path from beginner to mastery.'}</div>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="btn-secondary btn-sm" onclick="document.getElementById('newGoalModal').classList.add('active')">+ New Campaign</button>
      </div>
    </div>

    <!-- CAMPAIGN ROADMAP MAP -->
    <div class="campaign-map-container">
      ${renderChapterNodes(chapters, quests)}
    </div>
  `;
}

function renderChapterNodes(chapters, quests) {
  if (chapters.length === 0) {
    return `<div class="rpg-card">No chapters mapped yet.</div>`;
  }

  return chapters.map((chap, idx) => {
    const chapQuests = quests.filter(q => q.chapterId === chap.id);
    const completedCount = chapQuests.filter(q => q.status === 'COMPLETED').length;
    const isActive = true; // All chapters and levels unlocked as requested!

    return `
      <div class="chapter-node ${isActive ? 'active' : 'locked'}">
        <div class="chapter-header">
          <div>
            <div class="chapter-badge-title">
              <span>${isCompleted ? '✅' : (idx === chapters.length - 1 ? '🐉' : '⚔️')}</span>
              <span>${chap.title}</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">${chap.description}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background: rgba(255,255,255,0.06); color: var(--gold-glow);">
              ${completedCount} / ${chapQuests.length} Quests Finished
            </span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          ${chapQuests.map(q => {
            const isDone = q.status === 'COMPLETED';
            return `
              <div style="background: rgba(0,0,0,0.3); border: 1px solid ${isDone ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}; border-radius: var(--radius-md); padding: 1rem; opacity: ${isDone ? 0.7 : 1};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <span class="badge badge-${q.type || 'task'}">${q.type?.toUpperCase()}</span>
                  <span style="font-size: 0.78rem; color: var(--xp-glow); font-weight: 700;">+${q.xp} XP</span>
                </div>
                <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.25rem; ${isDone ? 'text-decoration: line-through;' : ''}">${q.title}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">${q.description}</div>
                ${!isDone ? `
                  <button class="btn-primary btn-sm" onclick="executeCompleteQuest('${q.id}')" style="width: 100%;">
                    ⚔️ Complete Quest (+${q.gold} 🪙)
                  </button>
                ` : `
                  <div style="font-size: 0.78rem; color: var(--success-green); font-weight: 700;">✓ Completed</div>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join(`
    <div style="display: flex; justify-content: center; color: var(--gold-glow); font-size: 1.5rem; margin: -1rem 0;">
      ↓
    </div>
  `);
}
