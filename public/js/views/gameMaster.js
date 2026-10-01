// AI Game Master Sanctum View: Chat, Tactical Adaptation, Emergency Mode, Mini-Quests

function renderGameMasterView() {
  const container = document.getElementById('viewContainer');
  if (!container) return;

  const profile = window.state.profile;
  const currentKey = localStorage.getItem('rlq_gemini_key') || '';

  container.innerHTML = `
    <div class="section-header">
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--xp-glow); font-weight: 700;">SANCTUM OF GUIDANCE</div>
        <h2 class="section-title">🤖 AI Game Master</h2>
        <div class="section-subtitle">Tactical advisor, quest sculptor, and emergency arc commander.</div>
      </div>
      <button class="btn-secondary btn-sm" id="toggleApiKeyModalBtn">🔑 Configure Gemini Key</button>
    </div>

    <!-- GEMINI KEY BANNER (IF NOT SET) -->
    <div id="apiKeyNotice" style="background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: var(--radius-md); padding: 0.85rem 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <span>✨</span>
        <span>${currentKey ? '<strong>Gemini AI Active:</strong> Running with custom API key.' : '<strong>Smart RPG Engine Active:</strong> Full offline procedural intelligence enabled. You can optionally plug in your Gemini API key anytime.'}</span>
      </div>
      <button class="btn-secondary btn-sm" onclick="promptApiKey()" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;">${currentKey ? 'Change Key' : 'Add Gemini Key'}</button>
    </div>

    <!-- CHAT CONTAINER -->
    <div class="chat-window">
      <div class="chat-messages" id="chatMessages">
        <div class="chat-bubble gm">
          Greetings, <strong>${profile?.username || 'Adventurer'}</strong>. I am your AI Game Master.
          <br><br>
          Whether your energy is soaring or time is tight today, tell me what you face. I can craft micro-quests ("I only have 20 minutes"), activate Emergency Mode ("Exam in 3 days"), or adjust your difficulty.
        </div>
      </div>

      <!-- QUICK CHIPS -->
      <div class="quick-prompt-chips">
        <button class="prompt-chip" data-msg="I only have 20 minutes today. Give me a micro-quest.">⏱️ Only have 20 minutes</button>
        <button class="prompt-chip" data-msg="Emergency Mode: I have an exam approaching soon!">🚨 Emergency: Exam Soon</button>
        <button class="prompt-chip" data-msg="I feel tired and unmotivated today. Scale it down.">🛋️ Low motivation / tired</button>
        <button class="prompt-chip" data-msg="I want to challenge myself with a hard quest today!">🔥 Give me a Hard Quest</button>
      </div>

      <!-- INPUT BAR -->
      <form class="chat-input-bar" id="gameMasterChatForm">
        <input type="text" class="chat-input" id="gmChatInput" placeholder="Speak to your Game Master... (e.g. 'I only have 30 minutes', 'Exam in 2 days')" autocomplete="off">
        <button type="submit" class="btn-primary btn-sm" id="sendGmMsgBtn">Send ⚔️</button>
      </form>
    </div>
  `;

  // Attach handlers
  const form = document.getElementById('gameMasterChatForm');
  const input = document.getElementById('gmChatInput');
  const chatMessages = document.getElementById('chatMessages');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      appendUserBubble(text);
      input.value = '';

      // Loading bubble
      const loadingId = 'loading_' + Date.now();
      appendGmBubble('🧙 <em>Consulting the ancient scrolls & calculating quest coordinates...</em>', loadingId);

      try {
        const response = await window.api.chatGameMaster(text);
        const loadEl = document.getElementById(loadingId);
        if (loadEl) loadEl.remove();

        let replyHtml = response.reply.replace(/\n/g, '<br>');
        
        if (response.suggestedMiniQuest) {
          const mq = response.suggestedMiniQuest;
          replyHtml += `
            <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: var(--radius-md); padding: 1rem; margin-top: 1rem;">
              <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--gold-glow); font-weight: 700; margin-bottom: 0.25rem;">⚔️ TACTICAL MINI-QUEST SUMMONED</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.35rem; color: #fff;">${mq.title}</div>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.75rem;">${mq.description}</div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 0.8rem; font-weight: 600;">
                  <span style="color: var(--xp-glow);">+${mq.xp} XP</span> • <span style="color: var(--gold-glow);">+${mq.gold} 🪙</span> • ⏱️ ${mq.estimatedMinutes}m
                </div>
                <button class="btn-primary btn-sm accept-mini-quest-btn" data-mq='${JSON.stringify(mq)}'>
                  + Add to Quest Board
                </button>
              </div>
            </div>
          `;
        }

        appendGmBubble(replyHtml);
      } catch (err) {
        const loadEl = document.getElementById(loadingId);
        if (loadEl) loadEl.remove();
        appendGmBubble(`⚠️ Error from the astral plane: ${err.message}`);
      }
    });
  }

  // Quick Chips
  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const msg = e.currentTarget.getAttribute('data-msg');
      if (input) {
        input.value = msg;
        form.dispatchEvent(new Event('submit'));
      }
    });
  });
}

function appendUserBubble(text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user';
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function appendGmBubble(html, id = null) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble gm';
  if (id) bubble.id = id;
  bubble.innerHTML = html;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;

  // Bind accept mini-quest buttons inside
  bubble.querySelectorAll('.accept-mini-quest-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const raw = e.currentTarget.getAttribute('data-mq');
      try {
        const mq = JSON.parse(raw);
        await window.api.createCustomQuest({
          title: mq.title,
          description: mq.description,
          type: mq.type || 'task',
          xp: mq.xp || 100,
          gold: mq.gold || 50,
          estimatedMinutes: mq.estimatedMinutes || 30
        });
        window.soundFx.playQuestStart();
        alert(`⚔️ Quest "${mq.title}" inscribed onto Today's Quest Board!`);
        await window.state.refreshAll();
      } catch (err) {
        alert(err.message);
      }
    });
  });
}

function promptApiKey() {
  const current = localStorage.getItem('rlq_gemini_key') || '';
  const key = prompt('Enter your Google Gemini API Key (stored locally in browser):', current);
  if (key !== null) {
    window.api.setGeminiApiKey(key.trim());
    renderGameMasterView();
  }
}
