// Telangana State Board Syllabus Arc View
// Complete "Study With Playing" Gamified Learning Chamber
// Master Teacher AI (Acharya Ramanujan AI) + Voice Synthesis + 4-Stage Quest Progression (ALL UNLOCKED) + AI Video Lectures + Real Gold Rewards

// ─── STATE ───────────────────────────────────────────────────────────────────
let tgState = {
  selectedClassId: 'inter_2',
  selectedStream: 'mpc',
  view: 'board',            // 'board' | 'study' | 'quiz' | 'result'
  currentTopic: null,       // { title, subject, classId }
  topicData: null,          // fetched from API
  studyTab: 'scrolls',      // 'scrolls' | 'video'
  activeStageIndex: 0,      // 0 to 3
  unlockedStages: [0, 1, 2, 3], // ALL STAGES UNLOCKED BY DEFAULT!
  drillAnswered: false,
  drillCorrect: false,
  studySparks: 50,          // bonus starter sparks
  hasGrandmasterBuff: true, // Grandmaster Buff unlocked!
  isSpeaking: false,
  videoPlaying: false,
  videoTime: 0,
  videoDuration: 120,       // 2 minutes video
  videoSpeed: 1,
  videoClaimed: false,
  videoSource: 'ai',        // 'ai' | 'stream'
  answers: {},              // { questionId: selectedIndex }
  quizResult: null          // result from API
};

let videoAnimFrameId = null;

// ─── SPEECH SYNTHESIS HELPER (Voice of Master Teacher) ────────────────────────
function toggleTeacherVoice(textToSpeak) {
  if (!('speechSynthesis' in window)) {
    alert('Speech synthesis is not supported on this browser.');
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    tgState.isSpeaking = false;
    updateVoiceButtonUI();
    return;
  }

  const cleanText = textToSpeak.replace(/[\n#*_`~]/g, ' ').replace(/\s+/g, ' ').trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
  if (preferredVoice) utterance.voice = preferredVoice;

  utterance.onstart = () => {
    tgState.isSpeaking = true;
    updateVoiceButtonUI();
  };
  utterance.onend = () => {
    tgState.isSpeaking = false;
    updateVoiceButtonUI();
  };
  utterance.onerror = () => {
    tgState.isSpeaking = false;
    updateVoiceButtonUI();
  };

  window.speechSynthesis.speak(utterance);
}

function updateVoiceButtonUI() {
  const btn = document.getElementById('tgVoiceBtn');
  if (!btn) return;
  if (tgState.isSpeaking) {
    btn.classList.add('speaking');
    btn.innerHTML = '⏹️ Stop Voice';
  } else {
    btn.classList.remove('speaking');
    btn.innerHTML = '🔊 Sensei Reads Lesson';
  }
}

// ─── MAIN RENDER ─────────────────────────────────────────────────────────────
async function renderTelanganaView() {
  const container = document.getElementById('viewContainer');
  if (!container) return;

  if (window.scrollToTop) window.scrollToTop(false);

  if (videoAnimFrameId) {
    cancelAnimationFrame(videoAnimFrameId);
    videoAnimFrameId = null;
  }

  if (tgState.view === 'study') {
    await renderStudyView(container);
  } else if (tgState.view === 'quiz') {
    renderQuizView(container);
  } else if (tgState.view === 'result') {
    renderResultView(container);
  } else {
    await renderBoardView(container);
  }

  if (window.scrollToTop) window.scrollToTop(false);
}

// ─── BOARD VIEW ──────────────────────────────────────────────────────────────
async function renderBoardView(container) {
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    tgState.isSpeaking = false;
  }

  let classes = [];
  try {
    const res = await window.api.getTelanganaClasses();
    classes = res.classes || [];
  } catch (e) { console.warn('Failed to load TG classes:', e); }

  let sylData = null;
  try {
    const res = await window.api.getTelanganaSyllabus(tgState.selectedClassId);
    sylData = res.syllabus;
  } catch (e) { console.warn('Failed to load syllabus:', e); }

  const isInter = tgState.selectedClassId.startsWith('inter');
  let subjects = [];
  if (sylData) {
    if (Array.isArray(sylData.subjects)) {
      subjects = sylData.subjects;
    } else if (sylData.subjects && sylData.subjects[tgState.selectedStream]) {
      subjects = sylData.subjects[tgState.selectedStream];
    }
  }

  let studyLog = [];
  try {
    const lr = await window.api.getStudyLog();
    studyLog = lr.log || [];
  } catch(e) {}

  const recentStudies = studyLog.slice(0, 5);

  container.innerHTML = `
    <!-- HERO HEADER -->
    <div style="background: linear-gradient(135deg, rgba(20,10,40,0.97), rgba(10,5,25,0.97)); border: 1px solid rgba(245,158,11,0.3); border-radius: 18px; padding: 2rem; margin-bottom: 2rem; position: relative; overflow: hidden;">
      <div style="position: absolute; inset: 0; background: radial-gradient(ellipse at 80% 50%, rgba(245,158,11,0.06), transparent 60%), radial-gradient(ellipse at 20% 50%, rgba(168,85,247,0.06), transparent 60%); pointer-events: none;"></div>
      <div style="position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.5rem;">
          <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.18em; color: var(--gold-glow); font-weight: 800;">
            TELANGANA SCERT & TSBIE • ALL STAGES & LEVELS UNLOCKED
          </div>
          <div style="background: rgba(34,197,94,0.18); border: 1px solid rgba(34,197,94,0.4); padding: 0.3rem 0.85rem; border-radius: 20px; font-size: 0.75rem; color: #4ade80; font-weight: 800; display: flex; align-items: center; gap: 0.4rem;">
            <span>🔓</span> All Stages, Levels & AI Videos Unlocked!
          </div>
        </div>

        <h2 style="font-family: var(--font-rpg); font-size: 1.9rem; background: linear-gradient(135deg, #f59e0b, #fbbf24, #fcd34d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 0.4rem;">
          🏛️ Telangana Academic Arc
        </h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0 0 1.25rem; max-width: 650px;">
          Learn every concept deeply like an RPG quest! Choose any chapter topic to enter the <strong style="color:#c084fc;">Study Chamber</strong>, watch <strong style="color:#38bdf8;">🎬 AI Videos & Simulations</strong>, play interactive micro-drills, and claim <strong style="color:var(--gold-glow);">Real Gold Coins</strong>!
        </p>

        <!-- REWARDS & GAMIFIED HIGHLIGHTS -->
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <div style="background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.35); border-radius: 8px; padding: 0.4rem 0.75rem; font-size: 0.78rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>🎬</span> <span>AI Video Lecture → <strong style="color:#38bdf8;">Interactive Simulation</strong></span>
          </div>
          <div style="background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3); border-radius: 8px; padding: 0.4rem 0.75rem; font-size: 0.78rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>🏆</span> <span>S-Rank Challenge → <strong style="color:#c084fc;">+150 XP & 75🪙 Gold</strong></span>
          </div>
          <div style="background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25); border-radius: 8px; padding: 0.4rem 0.75rem; font-size: 0.78rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>🔓</span> <span>All 4 Stages → <strong style="color:#4ade80;">100% Unlocked</strong></span>
          </div>
        </div>
      </div>
    </div>

    <!-- RECENT STUDY LOG -->
    ${recentStudies.length > 0 ? `
    <div class="rpg-card" style="margin-bottom: 1.5rem; padding: 1.1rem 1.25rem;">
      <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--xp-glow); font-weight: 700; margin-bottom: 0.75rem;">
        📊 Recent Study & Quest Activity
      </div>
      <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
        ${recentStudies.map(s => `
          <div style="background: rgba(0,0,0,0.35); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 0.45rem 0.8rem; font-size: 0.78rem; display: flex; align-items: center; gap: 0.4rem;">
            <span style="color: ${s.grade === 'S' ? '#f59e0b' : s.grade === 'A' ? '#4ade80' : '#60a5fa'}; font-weight: 800;">Grade ${s.grade}</span>
            <span style="color: rgba(255,255,255,0.85);">${s.topicTitle.length > 25 ? s.topicTitle.substring(0,24) + '…' : s.topicTitle}</span>
            <span style="color: var(--gold-glow); font-weight: 700;">+${s.goldEarned}🪙</span>
          </div>
        `).join('')}
      </div>
    </div>` : ''}

    <!-- CLASS SELECTION PILLS -->
    <div class="rpg-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
      <label style="display: block; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 0.65rem;">
        📖 Select Grade / Class (All Unlocked):
      </label>
      <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.4rem;" id="tgClassChips">
        ${classes.map(c => `
          <button class="tg-class-chip" data-id="${c.id}" style="white-space: nowrap; padding: 0.45rem 0.85rem; border-radius: 20px; font-size: 0.82rem; font-weight: 600; cursor: pointer; border: 1.5px solid; transition: all 0.2s;
            ${tgState.selectedClassId === c.id
              ? 'border-color: var(--gold-primary); background: rgba(245,158,11,0.18); color: #fff; box-shadow: 0 0 12px rgba(245,158,11,0.25);'
              : 'border-color: var(--border-subtle); background: rgba(0,0,0,0.3); color: var(--text-muted);'}">
            ${c.name}
          </button>
        `).join('')}
      </div>

      ${isInter ? `
      <div style="margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--xp-glow);">Stream:</span>
        <div style="display: flex; gap: 0.5rem;">
          ${[
            { id: 'mpc', label: 'MPC', desc: 'Maths, Physics, Chemistry' },
            { id: 'bipc', label: 'BiPC', desc: 'Biology, Physics, Chemistry' }
          ].map(st => `
            <button class="tg-stream-chip" data-stream="${st.id}" style="padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.82rem; font-weight: 600; cursor: pointer; border: 1.5px solid; transition: all 0.2s;
              ${tgState.selectedStream === st.id
                ? 'border-color: var(--xp-purple); background: rgba(147,51,234,0.22); color: #fff;'
                : 'border-color: var(--border-subtle); background: rgba(0,0,0,0.3); color: var(--text-muted);'}">
              ${st.label} <span style="font-size: 0.72rem; opacity: 0.75;">(${st.desc})</span>
            </button>
          `).join('')}
        </div>
      </div>` : ''}
    </div>

    <!-- SUBJECTS & CHAPTERS -->
    <div>
      <h3 style="font-family: var(--font-rpg); font-size: 1.3rem; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
        📚 ${sylData ? sylData.title : 'Select a class above'}
      </h3>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">
        Every chapter topic connects to our AI Masterclass with deep teacher explanations, 🎬 AI Video Lectures, and gamified interactive drills.
      </p>

      <div style="display: flex; flex-direction: column; gap: 1.75rem;">
        ${subjects.map((sub, sIdx) => `
          <div class="rpg-card tg-subject-card" style="border-left: 4px solid ${['var(--gold-primary)', 'var(--xp-purple)', '#06b6d4', '#10b981', '#ef4444'][sIdx % 5]};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.15rem; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 0.2rem;">
                  📖 ${sub.name}
                </h4>
                <div style="font-size: 0.78rem; color: var(--gold-glow); font-weight: 600;">
                  ${sub.chapters.length} chapters • Instant Access to all stages & AI Videos
                </div>
              </div>
              <button class="btn-primary btn-sm launch-tg-campaign-btn" data-subject="${sub.name}" style="font-size: 0.8rem;">
                ⚡ Launch Full Campaign
              </button>
            </div>

            <!-- CHAPTER CARDS -->
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.75rem;">
              ${sub.chapters.map((ch, cIdx) => `
                <div class="tg-chapter-card" data-title="${encodeURIComponent(ch.title)}" data-subject="${encodeURIComponent(sub.name)}" data-classid="${tgState.selectedClassId}" style="
                  background: rgba(0,0,0,0.35);
                  border: 1px solid rgba(255,255,255,0.08);
                  border-radius: 12px;
                  padding: 0.95rem 1rem;
                  cursor: pointer;
                  transition: all 0.2s;
                  position: relative;
                  overflow: hidden;
                " onmouseover="this.style.borderColor='rgba(168,85,247,0.5)'; this.style.background='rgba(147,51,234,0.12)'; this.style.transform='translateY(-2px)';"
                   onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.background='rgba(0,0,0,0.35)'; this.style.transform='translateY(0)';">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                    <span style="font-size: 0.7rem; color: var(--xp-glow); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Ch. ${cIdx + 1}</span>
                    <span style="font-size: 0.7rem; color: #38bdf8; font-weight: 700;">🎬 AI Video Ready</span>
                  </div>
                  <div style="font-weight: 700; font-size: 0.92rem; color: #fff; margin-bottom: 0.4rem; line-height: 1.35;">${ch.title}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                    ${ch.quests ? ch.quests.slice(0, 2).map(q => `• ${q}`).join('<br>') : 'Click to study with playing & watch video'}
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 0.28rem 0.7rem; border-radius: 20px; display: flex; align-items: center; gap: 0.3rem;">
                      <span>▶</span> Play & Study
                    </span>
                    <span style="font-size: 0.72rem; color: var(--gold-glow); font-weight: 700;">+75🪙 Real Gold</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.querySelectorAll('.tg-class-chip').forEach(btn => {
    btn.addEventListener('click', e => {
      window.soundFx.playClick();
      tgState.selectedClassId = e.currentTarget.getAttribute('data-id');
      tgState.view = 'board';
      renderTelanganaView();
    });
  });

  document.querySelectorAll('.tg-stream-chip').forEach(btn => {
    btn.addEventListener('click', e => {
      window.soundFx.playClick();
      tgState.selectedStream = e.currentTarget.getAttribute('data-stream');
      renderTelanganaView();
    });
  });

  document.querySelectorAll('.tg-chapter-card').forEach(card => {
    card.addEventListener('click', e => {
      const title = decodeURIComponent(card.getAttribute('data-title'));
      const subject = decodeURIComponent(card.getAttribute('data-subject'));
      const classId = card.getAttribute('data-classid');
      window.soundFx.playClick();
      startStudyFlow(title, subject, classId);
    });
  });

  document.querySelectorAll('.launch-tg-campaign-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      const subjectName = e.currentTarget.getAttribute('data-subject');
      try {
        window.soundFx.playQuestStart();
        btn.disabled = true;
        btn.textContent = '⏳ Forging Arc...';
        const res = await window.api.generateTelanganaCampaign({
          classId: tgState.selectedClassId,
          subjectName,
          stream: tgState.selectedStream,
          days: 45
        });
        window.soundFx.playLevelUp();
        window.spawnConfetti();
        alert(`🏛️ Launched: "${res.campaign.title}"!\nAll chapters and levels are completely unlocked on your Campaign Map!`);
        await window.state.refreshAll();
        window.navigateTo('campaign');
      } catch (err) {
        alert(err.message);
        btn.disabled = false;
        btn.textContent = '⚡ Launch Full Campaign';
      }
    });
  });
}

// ─── START STUDY FLOW ────────────────────────────────────────────────────────
async function startStudyFlow(title, subject, classId) {
  if (window.scrollToTop) window.scrollToTop(false);
  tgState.currentTopic = { title, subject, classId };
  tgState.topicData = null;
  tgState.studyTab = 'scrolls';
  tgState.activeStageIndex = 0;
  tgState.unlockedStages = [0, 1, 2, 3]; // ALL 4 STAGES 100% UNLOCKED!
  tgState.drillAnswered = false;
  tgState.drillCorrect = false;
  tgState.studySparks = 60;
  tgState.hasGrandmasterBuff = true;
  tgState.videoPlaying = false;
  tgState.videoTime = 0;
  tgState.videoClaimed = false;
  tgState.videoSource = 'ai';
  tgState.answers = {};
  tgState.quizResult = null;
  tgState.view = 'study';
  await renderTelanganaView();
}

// ─── STUDY VIEW (GAMIFIED LEARNING CHAMBER + AI VIDEOS) ──────────────────────
async function renderStudyView(container) {
  const { title, subject, classId } = tgState.currentTopic;

  if (!tgState.topicData) {
    container.innerHTML = `
      <div style="max-width: 760px; margin: 0 auto;">
        <button id="tgBackBtn" class="btn-secondary btn-sm" style="margin-bottom: 1.25rem;">← Back to Board</button>
        <div class="rpg-card" style="text-align: center; padding: 3.5rem 2rem;">
          <div style="font-size: 3.2rem; margin-bottom: 1rem; animation: teacherFloat 2s ease-in-out infinite;">🧙‍♂️</div>
          <div style="font-family: var(--font-rpg); font-size: 1.35rem; color: var(--xp-glow);">Acharya AI is Preparing Masterclass & Video...</div>
          <div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.6rem;">All stages and AI simulation video ready for: <strong style="color:#fff;">${title}</strong></div>
          <div style="margin-top: 1.75rem; display: flex; justify-content: center; gap: 0.5rem;">
            ${[0,1,2].map(i => `<div style="width: 12px; height: 12px; border-radius: 50%; background: var(--xp-purple); animation: pulse ${1 + i * 0.3}s ease-in-out infinite;"></div>`).join('')}
          </div>
        </div>
      </div>
    `;
    document.getElementById('tgBackBtn').addEventListener('click', () => {
      if (window.scrollToTop) window.scrollToTop(false);
      tgState.view = 'board';
      renderTelanganaView();
    });

    try {
      const res = await window.api.getTopicStudy(title, subject, classId);
      tgState.topicData = res.topic;
    } catch (err) {
      container.innerHTML = `
        <div style="max-width: 760px; margin: 0 auto;">
          <button id="tgBackBtn2" class="btn-secondary btn-sm" style="margin-bottom: 1.25rem;">← Back to Board</button>
          <div class="rpg-card" style="text-align: center; padding: 2.5rem; border-color: rgba(239,68,68,0.4);">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚠️</div>
            <div style="color: #ef4444; font-weight: 700;">Failed to load masterclass</div>
            <div style="color: var(--text-muted); margin-top: 0.5rem; font-size: 0.85rem;">${err.message}</div>
          </div>
        </div>
      `;
      document.getElementById('tgBackBtn2').addEventListener('click', () => {
        if (window.scrollToTop) window.scrollToTop(false);
        tgState.view = 'board';
        renderTelanganaView();
      });
      return;
    }
  }

  const td = tgState.topicData;
  const teacher = td.teacherPersona || {
    name: "Acharya Ramanujan AI",
    avatar: "🧙‍♂️",
    quote: "When you understand the intuition, formulas flow like water.",
    speechScript: `Welcome to ${td.title}. All stages and AI videos are unlocked for you!`
  };

  const stages = td.stages || [
    { id: 1, badge: "🌟 Origin", title: "Stage 1: Core Intuition", teacherTalk: td.summary || "Master the foundations.", visualCard: "Fundamental Principle" },
    { id: 2, badge: "⚡ Masterclass", title: "Stage 2: Deep Breakdown", teacherTalk: "Derivations and step-wise rules.", visualCard: "Core Mathematical Formulas" },
    { id: 3, badge: "🎯 Exam Traps", title: "Stage 3: Secrets & Traps", teacherTalk: "Avoid classic negative mark traps.", visualCard: "Do's & Don'ts" },
    { id: 4, badge: "⚔️ Micro-Trial", title: "Stage 4: Playful Drill", teacherTalk: "Put your knowledge into action.", interactiveCheck: { question: "Ready to conquer?", options: ["Yes, let's crush the test!", "Review again"], correctIndex: 0 } }
  ];

  const currentStage = stages[tgState.activeStageIndex] || stages[0];

  container.innerHTML = `
    <div style="max-width: 820px; margin: 0 auto;">
      <!-- NAVIGATION TOP BAR -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
        <button id="tgBackBtn" class="btn-secondary btn-sm">← Back to Board</button>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="background: rgba(34,197,94,0.18); border: 1px solid rgba(34,197,94,0.4); border-radius: 20px; padding: 0.35rem 0.85rem; font-size: 0.78rem; color: #4ade80; font-weight: 800; display: flex; align-items: center; gap: 0.35rem;">
            <span>🔓</span> All 4 Stages Unlocked
          </div>
          <button id="tgVoiceBtn" class="voice-play-pill ${tgState.isSpeaking ? 'speaking' : ''}">
            ${tgState.isSpeaking ? '⏹️ Stop Voice' : '🔊 Sensei Reads Lesson'}
          </button>
        </div>
      </div>

      <!-- TEACHER AI BANNER -->
      <div style="background: linear-gradient(135deg, rgba(30,12,60,0.95), rgba(15,8,30,0.95)); border: 1px solid rgba(168,85,247,0.35); border-radius: 18px; padding: 1.5rem; margin-bottom: 1.5rem; position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div style="display: flex; gap: 1.25rem; align-items: center; flex-wrap: wrap;">
          <div class="teacher-avatar-frame">${teacher.avatar}</div>
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.25rem;">
              <span style="font-family: var(--font-rpg); font-size: 1.15rem; color: #fff; font-weight: 700;">${teacher.name}</span>
              <span style="background: rgba(168,85,247,0.25); color: #c084fc; font-size: 0.68rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 12px; text-transform: uppercase;">Grandmaster</span>
            </div>
            <div style="font-size: 0.85rem; color: rgba(255,255,255,0.85); font-style: italic; line-height: 1.45;">
              "${teacher.quote}"
            </div>
          </div>
        </div>

        ${td.realWorldLore ? `
          <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.25); border-radius: 10px; padding: 0.85rem 1rem;">
            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold-glow); font-weight: 800; margin-bottom: 0.3rem;">
              ${td.realWorldLore.hookTitle || '🎮 Real-World Superpower'}
            </div>
            <div style="font-size: 0.84rem; color: rgba(255,255,255,0.82); line-height: 1.55;">
              ${td.realWorldLore.story}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- STUDY MODE TOGGLE: MASTERCLASS SCROLLS vs AI VIDEO LECTURE -->
      <div style="display: flex; gap: 0.65rem; margin-bottom: 1.5rem;">
        <button id="tabScrollsBtn" style="flex: 1; padding: 0.85rem; border-radius: 12px; font-weight: 800; font-size: 0.9rem; cursor: pointer; border: 1.5px solid; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          ${tgState.studyTab === 'scrolls'
            ? 'background: linear-gradient(135deg, rgba(147,51,234,0.3), rgba(88,28,135,0.4)); border-color: var(--xp-purple); color: #fff; box-shadow: 0 0 15px rgba(168,85,247,0.3);'
            : 'background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.1); color: var(--text-muted);'}">
          <span>📜</span> 4-Stage Masterclass (All Unlocked)
        </button>

        <button id="tabVideoBtn" style="flex: 1; padding: 0.85rem; border-radius: 12px; font-weight: 800; font-size: 0.9rem; cursor: pointer; border: 1.5px solid; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          ${tgState.studyTab === 'video'
            ? 'background: linear-gradient(135deg, rgba(56,189,248,0.25), rgba(14,165,233,0.35)); border-color: #38bdf8; color: #fff; box-shadow: 0 0 15px rgba(56,189,248,0.35);'
            : 'background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.1); color: var(--text-muted);'}">
          <span>🎬</span> AI Video Lecture & Simulation (4K)
        </button>
      </div>

      <!-- VIEW CONTENT BASED ON TAB -->
      ${tgState.studyTab === 'video' ? renderVideoTheaterHtml(td) : renderScrollsHtml(td, currentStage, stages)}

      <!-- GRANDMASTER'S BUFF BANNER -->
      <div class="grandmaster-buff-banner" style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <div style="font-size: 2rem;">⚡</div>
          <div>
            <div style="font-family: var(--font-rpg); font-size: 1.05rem; color: var(--gold-glow); font-weight: 800;">
              Grandmaster's Buff & All Stages Unlocked!
            </div>
            <div style="font-size: 0.8rem; color: rgba(255,255,255,0.85);">
              All stages, levels and simulation videos are open! +10% Bonus XP active for Challenge Arena!
            </div>
          </div>
        </div>
        <button id="quickArenaBtn" class="btn-gold" style="font-weight: 800; padding: 0.6rem 1.4rem;">
          ⚔️ Challenge Quiz (+75🪙)
        </button>
      </div>
    </div>
  `;

  // Attach handlers
  document.getElementById('tgBackBtn').addEventListener('click', () => {
    if (window.scrollToTop) window.scrollToTop(false);
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    tgState.view = 'board';
    renderTelanganaView();
  });

  document.getElementById('tgVoiceBtn').addEventListener('click', () => {
    window.soundFx.playClick();
    const currentScript = `${teacher.speechScript || ''} ${currentStage.title}. ${currentStage.teacherTalk}`;
    toggleTeacherVoice(currentScript);
  });

  document.getElementById('tabScrollsBtn').addEventListener('click', () => {
    window.soundFx.playClick();
    if (window.scrollToTop) window.scrollToTop(true);
    tgState.studyTab = 'scrolls';
    renderTelanganaView();
  });

  document.getElementById('tabVideoBtn').addEventListener('click', () => {
    window.soundFx.playClick();
    if (window.scrollToTop) window.scrollToTop(true);
    tgState.studyTab = 'video';
    renderTelanganaView();
    initAiVideoPlayer();
  });

  document.getElementById('quickArenaBtn').addEventListener('click', () => {
    if (window.scrollToTop) window.scrollToTop(false);
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    window.soundFx.playQuestStart();
    tgState.answers = {};
    tgState.view = 'quiz';
    renderTelanganaView();
  });

  if (tgState.studyTab === 'scrolls') {
    attachScrollsHandlers(stages);
  } else {
    initAiVideoPlayer();
  }
}

// ─── RENDER 4-STAGE SCROLLS TAB ──────────────────────────────────────────────
function renderScrollsHtml(td, currentStage, stages) {
  return `
    <!-- 4-STAGE QUEST NAVIGATION (ALL UNLOCKED) -->
    <div style="margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-weight: 800;">
        📜 All 4 Knowledge Scrolls (Click Any Stage Freely):
      </span>
      <span style="font-size: 0.78rem; color: #4ade80; font-weight: 800;">
        🔓 Stage ${tgState.activeStageIndex + 1} of ${stages.length} (Unlocked)
      </span>
    </div>

    <div class="study-stages-nav">
      ${stages.map((stg, sIdx) => {
        const isActive = tgState.activeStageIndex === sIdx;
        return `
          <div class="study-stage-tab ${isActive ? 'active' : ''} completed" data-idx="${sIdx}" style="cursor: pointer;">
            <div style="font-size: 1.25rem;">${['🌟', '⚡', '🎯', '⚔️'][sIdx % 4]}</div>
            <div style="font-size: 0.76rem; font-weight: 800; color: ${isActive ? '#fff' : 'var(--text-muted)'}; line-height: 1.2;">
              ${stg.badge || `Stage ${sIdx + 1}`}
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- ACTIVE STAGE CONTAINER -->
    <div class="rpg-card" style="padding: 1.75rem; margin-bottom: 1.5rem; border: 1.5px solid rgba(168,85,247,0.35); background: linear-gradient(135deg, rgba(16,8,32,0.95), rgba(10,5,20,0.95));">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--xp-glow); font-weight: 800;">
            ${currentStage.badge || `Stage ${tgState.activeStageIndex + 1}`}
          </div>
          <h3 style="font-family: var(--font-rpg); font-size: 1.4rem; color: #fff; margin: 0.2rem 0 0;">
            ${currentStage.title}
          </h3>
        </div>
        <div style="font-size: 0.75rem; color: #4ade80; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); padding: 0.3rem 0.75rem; border-radius: 20px; font-weight: 800;">
          ✓ Unlocked Stage
        </div>
      </div>

      <div style="font-size: 0.95rem; color: rgba(255,255,255,0.9); line-height: 1.7; margin-bottom: 1.5rem; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 1.25rem; border-left: 4px solid var(--xp-purple);">
        ${currentStage.teacherTalk.replace(/\n/g, '<br><br>')}
      </div>

      ${currentStage.visualCard ? `
        <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(168,85,247,0.3); border-radius: 12px; padding: 1.15rem 1.35rem; margin-bottom: 1.5rem; font-family: var(--font-mono); font-size: 0.85rem; color: #e9d5ff; line-height: 1.6; white-space: pre-line; box-shadow: inset 0 0 20px rgba(147,51,234,0.1);">
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold-glow); font-weight: 800; margin-bottom: 0.4rem; font-family: var(--font-sans);">
            📐 Concept Blueprint & Core Formula:
          </div>
          ${currentStage.visualCard}
        </div>
      ` : ''}

      ${currentStage.memoryHack ? `
        <div style="background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(20,10,5,0.4)); border: 1px dashed rgba(245,158,11,0.4); border-radius: 10px; padding: 0.85rem 1.1rem; margin-bottom: 1.5rem; font-size: 0.84rem; color: #fde68a; display: flex; align-items: center; gap: 0.6rem;">
          <span>💡</span> <span>${currentStage.memoryHack}</span>
        </div>
      ` : ''}

      <!-- STAGE 4 MICRO-TRIAL DRILL -->
      ${tgState.activeStageIndex === 3 && currentStage.interactiveCheck ? `
        <div style="background: rgba(20,10,40,0.9); border: 1.5px solid var(--xp-purple); border-radius: 14px; padding: 1.35rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="font-family: var(--font-rpg); font-size: 1.05rem; color: var(--xp-glow); display: flex; align-items: center; gap: 0.5rem;">
              ⚔️ Micro-Trial: Test Your Reflexes!
            </div>
            <span style="font-size: 0.72rem; color: var(--gold-glow); font-weight: 800; text-transform: uppercase;">Mini-Game Drill</span>
          </div>
          <p style="color: #fff; font-size: 0.92rem; font-weight: 700; line-height: 1.45; margin-bottom: 1rem;">
            ${currentStage.interactiveCheck.question}
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.6rem;" id="drillOptionsList">
            ${(currentStage.interactiveCheck.options || []).map((opt, oIdx) => `
              <button class="drill-option-card" data-idx="${oIdx}">
                <span style="width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid rgba(168,85,247,0.6); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: var(--xp-glow); flex-shrink: 0;">
                  ${String.fromCharCode(65 + oIdx)}
                </span>
                <span>${opt}</span>
              </button>
            `).join('')}
          </div>
          <div id="drillFeedbackBox" style="display: none; margin-top: 1rem; padding: 0.85rem 1rem; border-radius: 10px; font-size: 0.85rem; line-height: 1.5;"></div>
        </div>
      ` : ''}

      <!-- SCROLL ACTIONS -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; pt: 1rem; border-top: 1px solid rgba(255,255,255,0.08); flex-wrap: wrap; gap: 0.75rem;">
        <button id="prevStageBtn" class="btn-secondary btn-sm" style="${tgState.activeStageIndex === 0 ? 'opacity: 0.4; cursor: not-allowed;' : ''}" ${tgState.activeStageIndex === 0 ? 'disabled' : ''}>
          ← Previous Stage
        </button>

        <div style="display: flex; gap: 0.5rem;">
          ${tgState.activeStageIndex < stages.length - 1 ? `
            <button id="nextStageBtn" class="btn-primary" style="padding: 0.6rem 1.4rem; font-size: 0.88rem; font-weight: 700;">
              Jump to ${stages[tgState.activeStageIndex + 1]?.badge || 'Stage ' + (tgState.activeStageIndex + 2)} ➔
            </button>
          ` : `
            <button id="completeStudyBtn" class="btn-gold" style="padding: 0.75rem 1.75rem; font-size: 0.95rem; font-weight: 800; box-shadow: 0 0 25px rgba(245,158,11,0.4);">
              🎯 Enter Challenge Arena (+75🪙)
            </button>
          `}
        </div>
      </div>
    </div>

    <!-- RAPID REVISION CHEAT SHEET -->
    ${td.cheatSheet && td.cheatSheet.length > 0 ? `
      <div class="rpg-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
        <div style="font-family: var(--font-rpg); font-size: 1rem; color: var(--gold-glow); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
          ⚡ Quick-Fire Formula Cheat Sheet
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${td.cheatSheet.map((item, idx) => `
            <div style="font-size: 0.82rem; color: rgba(255,255,255,0.85); background: rgba(0,0,0,0.3); padding: 0.45rem 0.75rem; border-radius: 6px; border-left: 2px solid var(--gold-glow); font-family: var(--font-mono);">
              ${item}
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

function attachScrollsHandlers(stages) {
  document.querySelectorAll('.study-stage-tab').forEach(tab => {
    tab.addEventListener('click', e => {
      const idx = parseInt(tab.getAttribute('data-idx'));
      window.soundFx.playClick();
      if (window.scrollToTop) window.scrollToTop(true);
      tgState.activeStageIndex = idx;
      renderTelanganaView();
    });
  });

  const prevBtn = document.getElementById('prevStageBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (tgState.activeStageIndex > 0) {
        window.soundFx.playClick();
        if (window.scrollToTop) window.scrollToTop(true);
        tgState.activeStageIndex--;
        renderTelanganaView();
      }
    });
  }

  const nextBtn = document.getElementById('nextStageBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      window.soundFx.playStudySpark();
      window.spawnConfetti();
      if (window.scrollToTop) window.scrollToTop(true);
      tgState.activeStageIndex++;
      renderTelanganaView();
    });
  }

  const completeBtn = document.getElementById('completeStudyBtn');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      if (window.scrollToTop) window.scrollToTop(false);
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) window.speechSynthesis.cancel();
      window.soundFx.playQuestStart();
      tgState.answers = {};
      tgState.view = 'quiz';
      renderTelanganaView();
    });
  }

  // Drill options
  if (tgState.activeStageIndex === 3) {
    const drillCheck = stages[3]?.interactiveCheck;
    if (drillCheck) {
      document.querySelectorAll('.drill-option-card').forEach(card => {
        card.addEventListener('click', e => {
          const chosenIdx = parseInt(card.getAttribute('data-idx'));
          const feedbackBox = document.getElementById('drillFeedbackBox');
          if (!feedbackBox) return;

          document.querySelectorAll('.drill-option-card').forEach(c => c.classList.remove('correct', 'wrong'));

          if (chosenIdx === drillCheck.correctIndex) {
            card.classList.add('correct');
            window.soundFx.playDrillCorrect();
            window.soundFx.playPowerUp();
            window.spawnConfetti();
            tgState.drillAnswered = true;
            tgState.drillCorrect = true;
            tgState.hasGrandmasterBuff = true;
            feedbackBox.style.display = 'block';
            feedbackBox.style.background = 'rgba(34,197,94,0.18)';
            feedbackBox.style.border = '1px solid #22c55e';
            feedbackBox.style.color = '#86efac';
            feedbackBox.innerHTML = `
              <div style="font-weight: 800; margin-bottom: 0.25rem;">✨ CORRECT! GRANDMASTER BUFF UNLOCKED!</div>
              <div>${drillCheck.rewardNote || 'Superb work! You unlocked +10% Bonus XP for the Challenge Test!'}</div>
            `;
          } else {
            card.classList.add('wrong');
            window.soundFx.playDrillWrong();
            feedbackBox.style.display = 'block';
            feedbackBox.style.background = 'rgba(239,68,68,0.18)';
            feedbackBox.style.border = '1px solid #ef4444';
            feedbackBox.style.color = '#fca5a5';
            feedbackBox.innerHTML = `
              <div style="font-weight: 800; margin-bottom: 0.25rem;">⚠️ Not quite! Try again!</div>
              <div>Review the formulas in Stage 2 and take another shot.</div>
            `;
          }
        });
      });
    }
  }
}

// ─── RENDER AI VIDEO LECTURE THEATER TAB ─────────────────────────────────────
function renderVideoTheaterHtml(td) {
  const isStream = tgState.videoSource === 'stream';

  return `
    <div class="ai-video-theater">
      <!-- VIDEO HEADER / SOURCE TOGGLE -->
      <div style="background: rgba(12,6,26,0.98); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.2rem;">🎬</span>
          <div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #fff;">${td.title} — AI Video Explainer</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Real-time Mathematical Canvas Simulation & Voice Synthesis</div>
          </div>
        </div>

        <div style="display: flex; gap: 0.4rem;">
          <button id="toggleAiSimBtn" style="padding: 0.35rem 0.8rem; border-radius: 16px; font-size: 0.75rem; font-weight: 700; cursor: pointer; border: 1px solid;
            ${!isStream ? 'background: #7c3aed; border-color: #a855f7; color: #fff;' : 'background: rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.1); color: var(--text-muted);'}">
            🤖 AI Simulation
          </button>
          <button id="toggleStreamBtn" style="padding: 0.35rem 0.8rem; border-radius: 16px; font-size: 0.75rem; font-weight: 700; cursor: pointer; border: 1px solid;
            ${isStream ? 'background: #0284c7; border-color: #38bdf8; color: #fff;' : 'background: rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.1); color: var(--text-muted);'}">
            📺 TS Educational 4K Stream
          </button>
        </div>
      </div>

      <!-- VIDEO SCREEN -->
      <div class="ai-video-screen" id="aiVideoScreen">
        ${!isStream ? `
          <div class="video-live-badge">AI LIVE SIMULATION</div>
          <div class="video-resolution-badge">60 FPS • 4K ULTRA HD</div>
          <canvas id="aiSimCanvas" width="960" height="540"></canvas>
          <div class="video-subtitles-ribbon" id="videoSubtitles">
            🎙️ Acharya Ramanujan AI: Press Play to start your interactive concept video.
          </div>
        ` : `
          <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/fNk_zzaMoSs?autoplay=1&mute=0&rel=0" title="Educational Video Stream" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border:none;"></iframe>
        `}
      </div>

      <!-- VIDEO CONTROLS PANEL (FOR AI SIMULATION) -->
      ${!isStream ? `
      <div class="video-controls-panel">
        <!-- Scrubbing Timeline -->
        <div class="video-timeline-bar" id="videoTimelineBar">
          <div class="video-timeline-fill" id="videoTimelineFill" style="width: ${(tgState.videoTime / tgState.videoDuration) * 100}%;"></div>
        </div>

        <!-- Buttons row -->
        <div class="video-btn-bar">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <button class="video-play-btn" id="videoPlayPauseBtn">
              ${tgState.videoPlaying ? '⏸️' : '▶'}
            </button>
            <div style="font-family: var(--font-mono); font-size: 0.82rem; color: #fff;" id="videoTimeText">
              ${formatTime(tgState.videoTime)} / ${formatTime(tgState.videoDuration)}
            </div>
            <div style="background: rgba(255,255,255,0.06); border-radius: 12px; padding: 0.2rem 0.6rem; font-size: 0.72rem; color: var(--gold-glow); font-weight: 700;">
              ⚡ Interactive Mode
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <button class="btn-secondary btn-sm" id="videoSpeedBtn" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">
              ${tgState.videoSpeed}x
            </button>
            <button id="claimVideoXpBtn" class="btn-gold btn-sm" style="font-size: 0.78rem; font-weight: 800; ${tgState.videoClaimed ? 'opacity: 0.5; cursor: default;' : ''}">
              ${tgState.videoClaimed ? '✓ +25 XP Claimed' : '🎁 Claim Watch Reward (+25 XP & 15🪙)'}
            </button>
          </div>
        </div>
      </div>
      ` : `
      <div style="background: rgba(15,8,30,0.95); padding: 0.75rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.82rem; color: var(--text-muted);">Curated Official Board & 3Blue1Brown High-Yield Stream</span>
        <button id="claimVideoXpBtn" class="btn-gold btn-sm" style="font-size: 0.78rem; font-weight: 800; ${tgState.videoClaimed ? 'opacity: 0.5; cursor: default;' : ''}">
          ${tgState.videoClaimed ? '✓ +25 XP Claimed' : '🎁 Claim Watch Reward (+25 XP & 15🪙)'}
        </button>
      </div>
      `}
    </div>

    <!-- VIDEO TOPIC KEY TAKEAWAYS -->
    <div class="rpg-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
      <div style="font-family: var(--font-rpg); font-size: 1.05rem; color: #38bdf8; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
        💡 Video Takeaways & Mathematical Summary
      </div>
      <p style="color: rgba(255,255,255,0.85); font-size: 0.88rem; line-height: 1.6; margin: 0 0 0.85rem 0;">
        ${td.summary || 'Visual demonstration of vectors, coordinate scaling, and core theorems.'}
      </p>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        ${(td.cheatSheet || []).map(cs => `
          <div style="background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); border-radius: 8px; padding: 0.4rem 0.75rem; font-size: 0.78rem; color: #e0f2fe; font-family: var(--font-mono);">
            ${cs}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// ─── AI VIDEO CANVAS ANIMATION ENGINE ────────────────────────────────────────
function initAiVideoPlayer() {
  const toggleAiSimBtn = document.getElementById('toggleAiSimBtn');
  const toggleStreamBtn = document.getElementById('toggleStreamBtn');
  const playPauseBtn = document.getElementById('videoPlayPauseBtn');
  const speedBtn = document.getElementById('videoSpeedBtn');
  const timelineBar = document.getElementById('videoTimelineBar');
  const claimBtn = document.getElementById('claimVideoXpBtn');

  if (toggleAiSimBtn) {
    toggleAiSimBtn.addEventListener('click', () => {
      tgState.videoSource = 'ai';
      renderTelanganaView();
      initAiVideoPlayer();
    });
  }

  if (toggleStreamBtn) {
    toggleStreamBtn.addEventListener('click', () => {
      tgState.videoSource = 'stream';
      renderTelanganaView();
    });
  }

  if (claimBtn) {
    claimBtn.addEventListener('click', async () => {
      if (tgState.videoClaimed) return;
      tgState.videoClaimed = true;
      window.soundFx.playPowerUp();
      window.spawnConfetti();
      try {
        await window.api.earnRewards({ xp: 25, gold: 15 });
        await window.state.refreshAll();
      } catch(e) {}
      claimBtn.textContent = '✓ +25 XP & 15🪙 Claimed!';
      claimBtn.style.opacity = '0.6';
    });
  }

  const canvas = document.getElementById('aiSimCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let angle = 0;
  const topicTitle = (tgState.currentTopic?.title || '').toLowerCase();

  const subtitlesList = [
    { t: 0, text: "🎙️ Acharya Ramanujan AI: Welcome to the 4K AI Mathematical Explainer!" },
    { t: 8, text: "Notice how basis vectors deform and transform the spatial coordinate grid." },
    { t: 20, text: "The highlighted region represents the Determinant scaling factor det(A)." },
    { t: 40, text: "As long as det(A) ≠ 0, this geometric transformation is fully invertible!" },
    { t: 65, text: "Watch the phase rotation on the complex Argand plane follow Euler's identity." },
    { t: 90, text: "By connecting geometric intuition with algebraic formulas, exams become effortless!" },
    { t: 110, text: "Mastery achieved! You are ready to crush the Challenge Test!" }
  ];

  function drawFrame() {
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    // Dark grid background
    ctx.fillStyle = '#0a0515';
    ctx.fillRect(0, 0, w, h);

    // Coordinate grid lines
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const cx = w / 2;
    const cy = h / 2;

    // Main Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.stroke();

    // Specific Simulation based on topic
    if (topicTitle.includes('matrix') || topicTitle.includes('matrices') || topicTitle.includes('determinant')) {
      // 3D Matrix Transformation Simulation
      const shear = Math.sin(angle) * 1.2;
      const scaleX = 1 + Math.cos(angle * 0.7) * 0.4;
      const unit = 110;

      // Transformed parallelogram area
      ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + unit * scaleX, cy - unit * shear * 0.5);
      ctx.lineTo(cx + unit * scaleX + unit * shear * 0.6, cy - unit - unit * shear * 0.5);
      ctx.lineTo(cx + unit * shear * 0.6, cy - unit);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Vector i-hat (cyan)
      drawArrow(ctx, cx, cy, cx + unit * scaleX, cy - unit * shear * 0.5, '#06b6d4', 'î = [' + scaleX.toFixed(2) + ', ' + (shear*0.5).toFixed(2) + ']');
      // Vector j-hat (magenta)
      drawArrow(ctx, cx, cy, cx + unit * shear * 0.6, cy - unit, '#ec4899', 'ĵ = [' + (shear*0.6).toFixed(2) + ', 1.00]');

      // Live Telemetry on screen
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 16px "Outfit", sans-serif';
      ctx.fillText(`det(A) Area = ${(scaleX * 1.0 - shear*0.5 * shear*0.6).toFixed(2)}`, cx + 30, cy + 40);
    } else if (topicTitle.includes('complex') || topicTitle.includes('moivre')) {
      // Complex Argand Plane & Euler phasor
      const r = 130;
      const px = cx + r * Math.cos(angle);
      const py = cy - r * Math.sin(angle);

      // Unit circle
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Cube roots of unity dots (1, ω, ω²)
      const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
      const labels = ['1 (1+0i)', 'ω (-0.5+0.86i)', 'ω² (-0.5-0.86i)'];
      angles.forEach((ang, idx) => {
        const ox = cx + r * Math.cos(ang);
        const oy = cy - r * Math.sin(ang);
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(ox, oy, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '13px "Outfit", sans-serif';
        ctx.fillText(labels[idx], ox + 10, oy - 5);
      });

      // Rotating phasor z = r e^(iθ)
      drawArrow(ctx, cx, cy, px, py, '#f59e0b', 'z = r·e^(iθ)');
      // Sine wave projection
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < w; x += 5) {
        const y = cy - Math.sin((x - cx) * 0.03 - angle) * 60;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else {
      // Dynamic Physics / Scientific Particle Nexus
      const speed = angle * 2;
      for (let i = 0; i < 20; i++) {
        const rad = 60 + i * 12;
        const a = angle * (1 + i * 0.08);
        ctx.strokeStyle = `hsla(${260 + i * 8}, 80%, 65%, 0.5)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, a, a + Math.PI * 1.2);
        ctx.stroke();
      }

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 22px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText(tgState.currentTopic?.title || 'Academic Concept', cx, cy - 10);
      ctx.font = '14px "Outfit", sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText('Dynamic AI Knowledge Synthesis • 4K Real-time', cx, cy + 20);
      ctx.textAlign = 'left';
    }

    // Video progress update if playing
    if (tgState.videoPlaying) {
      angle += 0.02 * tgState.videoSpeed;
      tgState.videoTime += (1 / 60) * tgState.videoSpeed;
      if (tgState.videoTime >= tgState.videoDuration) {
        tgState.videoTime = 0;
      }

      // Update Subtitles text
      const sub = subtitlesList.slice().reverse().find(s => tgState.videoTime >= s.t);
      const subEl = document.getElementById('videoSubtitles');
      if (subEl && sub) {
        subEl.textContent = sub.text;
      }

      // Update progress bar UI
      const fill = document.getElementById('videoTimelineFill');
      if (fill) fill.style.width = `${(tgState.videoTime / tgState.videoDuration) * 100}%`;
      const timeText = document.getElementById('videoTimeText');
      if (timeText) timeText.textContent = `${formatTime(tgState.videoTime)} / ${formatTime(tgState.videoDuration)}`;
    }

    videoAnimFrameId = requestAnimationFrame(drawFrame);
  }

  function drawArrow(ctx, fromx, fromy, tox, toy, color, label) {
    const headlen = 12;
    const dx = tox - fromx;
    const dy = toy - fromy;
    const a = Math.atan2(dy, dx);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(a - Math.PI / 6), toy - headlen * Math.sin(a - Math.PI / 6));
    ctx.lineTo(tox - headlen * Math.cos(a + Math.PI / 6), toy - headlen * Math.sin(a + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    if (label) {
      ctx.font = 'bold 13px "Outfit", sans-serif';
      ctx.fillText(label, tox + 8, toy - 8);
    }
  }

  // Play / Pause handler
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      tgState.videoPlaying = !tgState.videoPlaying;
      playPauseBtn.innerHTML = tgState.videoPlaying ? '⏸️' : '▶';
      window.soundFx.playClick();
      if (tgState.videoPlaying) {
        const sub = subtitlesList.slice().reverse().find(s => tgState.videoTime >= s.t);
        if (sub) toggleTeacherVoice(sub.text.replace('🎙️ Acharya Ramanujan AI: ', ''));
      } else {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) window.speechSynthesis.cancel();
      }
    });
  }

  // Speed handler
  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      window.soundFx.playClick();
      const speeds = [1, 1.25, 1.5, 2];
      const curIdx = speeds.indexOf(tgState.videoSpeed);
      tgState.videoSpeed = speeds[(curIdx + 1) % speeds.length];
      speedBtn.textContent = `${tgState.videoSpeed}x`;
    });
  }

  // Timeline scrubber
  if (timelineBar) {
    timelineBar.addEventListener('click', e => {
      const rect = timelineBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      tgState.videoTime = Math.max(0, Math.min(tgState.videoDuration, pos * tgState.videoDuration));
      const fill = document.getElementById('videoTimelineFill');
      if (fill) fill.style.width = `${pos * 100}%`;
    });
  }

  // Start animation loop
  drawFrame();
}

// ─── QUIZ VIEW (THE GRAND CHALLENGE ARENA) ────────────────────────────────────
function renderQuizView(container) {
  const td = tgState.topicData;
  if (!td) { tgState.view = 'board'; renderTelanganaView(); return; }

  const questions = td.questions || [];

  container.innerHTML = `
    <div style="max-width: 740px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
        <button id="tgBackStudyBtn" class="btn-secondary btn-sm">← Back to Masterclass</button>
        <div style="font-size: 0.85rem; color: var(--gold-glow); font-weight: 800; display: flex; align-items: center; gap: 0.4rem;">
          <span>🪙</span> 75 Gold Coins on the line!
        </div>
      </div>

      <div style="background: linear-gradient(135deg, rgba(88,28,135,0.4), rgba(20,10,40,0.9)); border: 1.5px solid rgba(168,85,247,0.4); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; position: relative; overflow: hidden;">
        <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--xp-glow); font-weight: 800; margin-bottom: 0.35rem;">
          ⚔️ The Grand Challenge Arena
        </div>
        <h2 style="font-family: var(--font-rpg); font-size: 1.5rem; color: #fff; margin: 0 0 0.5rem;">
          ${td.title}
        </h2>
        <p style="color: rgba(255,255,255,0.8); font-size: 0.88rem; margin: 0;">
          Answer all ${questions.length} questions to claim your grade, XP, and real gold coins!
        </p>
        <div style="margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.5); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.78rem; color: var(--gold-glow); font-weight: 800;">
          <span>⚡</span> +10% Grandmaster XP Buff Active!
        </div>
      </div>

      <div id="quizQuestionsContainer" style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem;">
        ${questions.map((q, qIdx) => `
          <div class="rpg-card quiz-question-card" data-qid="${q.id}" style="border: 1px solid var(--border-subtle); transition: border-color 0.2s; padding: 1.4rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--xp-glow); font-weight: 800;">
                Question ${qIdx + 1} of ${questions.length}
              </span>
              <span style="font-size: 0.75rem; color: var(--text-dim); font-weight: 600;">Standard Board / IPE Difficulty</span>
            </div>
            <div style="font-weight: 700; font-size: 0.98rem; color: #fff; line-height: 1.5; margin-bottom: 1.15rem;">
              ${q.question}
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.55rem;">
              ${(q.options || []).map((opt, optIdx) => `
                <button class="quiz-option-btn" data-qid="${q.id}" data-idx="${optIdx}" style="
                  text-align: left; padding: 0.8rem 1rem; border-radius: 10px; cursor: pointer;
                  background: rgba(0,0,0,0.3); border: 1.5px solid rgba(255,255,255,0.1);
                  color: rgba(255,255,255,0.88); font-size: 0.88rem; font-family: var(--font-sans);
                  transition: all 0.18s; display: flex; align-items: center; gap: 0.75rem;
                " onmouseover="if(!this.classList.contains('selected')){this.style.borderColor='rgba(168,85,247,0.5)'; this.style.background='rgba(147,51,234,0.12)';}"
                   onmouseout="if(!this.classList.contains('selected')){this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(0,0,0,0.3)';}">
                  <span style="width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid rgba(168,85,247,0.5); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; flex-shrink: 0; color: var(--xp-glow);">
                    ${String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <button id="submitQuizBtn" class="btn-gold" style="width: 100%; padding: 1.1rem; font-size: 1.05rem; font-weight: 800; opacity: 0.5; cursor: not-allowed; margin-bottom: 2rem;" disabled>
        ⚔️ Submit Answers & Claim Rewards
      </button>
    </div>
  `;

  document.getElementById('tgBackStudyBtn').addEventListener('click', () => {
    if (window.scrollToTop) window.scrollToTop(false);
    tgState.view = 'study';
    renderTelanganaView();
  });

  document.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const qid = parseInt(btn.getAttribute('data-qid'));
      const idx = parseInt(btn.getAttribute('data-idx'));
      window.soundFx.playClick();
      tgState.answers[qid] = idx;

      const card = btn.closest('.quiz-question-card');
      card.querySelectorAll('.quiz-option-btn').forEach(b => {
        b.classList.remove('selected');
        b.style.borderColor = 'rgba(255,255,255,0.1)';
        b.style.background = 'rgba(0,0,0,0.3)';
        b.style.color = 'rgba(255,255,255,0.88)';
      });
      btn.classList.add('selected');
      btn.style.borderColor = 'rgba(168,85,247,0.85)';
      btn.style.background = 'rgba(147,51,234,0.25)';
      btn.style.color = '#fff';
      card.style.borderColor = 'rgba(168,85,247,0.4)';

      const answered = Object.keys(tgState.answers).length;
      const submitBtn = document.getElementById('submitQuizBtn');
      if (answered >= (td.questions || []).length) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.style.boxShadow = '0 0 25px rgba(245,158,11,0.5)';
      }
    });
  });

  document.getElementById('submitQuizBtn').addEventListener('click', async () => {
    const submitBtn = document.getElementById('submitQuizBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Grading your challenge test...';

    try {
      const answers = Object.entries(tgState.answers).map(([qid, selectedIndex]) => ({
        questionId: parseInt(qid),
        selectedIndex
      }));
      const questions = (td.questions || []).map(q => ({
        id: q.id,
        correctIndex: q.correctIndex,
        explanation: q.explanation
      }));

      const result = await window.api.submitQuiz({
        topicTitle: tgState.currentTopic.title,
        subject: tgState.currentTopic.subject,
        classId: tgState.currentTopic.classId,
        answers,
        questions
      });

      if (tgState.hasGrandmasterBuff && result.xpEarned) {
        const bonus = Math.round(result.xpEarned * 0.1);
        result.xpEarned += bonus;
        result.buffBonus = bonus;
      }

      tgState.quizResult = result;
      tgState.view = 'result';
      if (window.scrollToTop) window.scrollToTop(false);

      if (result.leveledUp) window.soundFx.playLevelUp();
      else window.soundFx.playQuestComplete();
      window.spawnConfetti();

      await window.state.refreshAll();
      renderTelanganaView();
    } catch (err) {
      alert('Error submitting quiz: ' + err.message);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '⚔️ Submit Answers & Claim Rewards';
    }
  });
}

// ─── RESULT VIEW ─────────────────────────────────────────────────────────────
function renderResultView(container) {
  const qr = tgState.quizResult;
  const td = tgState.topicData;
  if (!qr || !td) { tgState.view = 'board'; renderTelanganaView(); return; }

  const gradeColors = { S: '#f59e0b', A: '#4ade80', B: '#60a5fa', C: '#94a3b8' };
  const grade = qr.grade || 'B';
  const gColor = gradeColors[grade] || '#fff';

  container.innerHTML = `
    <div style="max-width: 720px; margin: 0 auto;">
      <div style="
        background: linear-gradient(135deg, rgba(10,5,25,0.97), rgba(20,10,40,0.97));
        border: 2px solid ${gColor}55;
        border-radius: 20px; padding: 2.5rem 2rem; text-align: center; margin-bottom: 1.5rem;
        box-shadow: 0 0 40px ${gColor}22;
        position: relative; overflow: hidden;
      ">
        <div style="font-size: 4rem; margin-bottom: 0.5rem; animation: teacherFloat 2s ease-in-out infinite;">
          ${grade === 'S' ? '🏆' : grade === 'A' ? '⭐' : grade === 'B' ? '📘' : '📖'}
        </div>
        <div style="font-family: var(--font-rpg); font-size: 3.5rem; font-weight: 900; color: ${gColor}; text-shadow: 0 0 30px ${gColor}88; margin-bottom: 0.25rem;">
          Grade ${grade}
        </div>
        <div style="font-size: 1.1rem; color: rgba(255,255,255,0.9); margin-bottom: 0.5rem; font-weight: 700;">
          ${grade === 'S' ? '🏆 Mastered this topic completely!' : '⭐ Strong Command!'}
        </div>
        <div style="font-size: 0.88rem; color: var(--text-muted);">
          ${qr.correctCount} / ${qr.total} questions answered correctly (${qr.pct}%)
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.3); border-radius: 14px; padding: 1.25rem; text-align: center;">
          <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.08em; margin-bottom: 0.35rem;">Total XP Earned</div>
          <div style="font-family: var(--font-rpg); font-size: 2.2rem; font-weight: 800; color: var(--xp-glow); line-height: 1;">
            +${qr.xpEarned}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
            ${qr.buffBonus ? `Includes +${qr.buffBonus} Grandmaster Buff XP` : 'Experience Points'}
          </div>
        </div>

        <div style="background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); border-radius: 14px; padding: 1.25rem; text-align: center;">
          <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.08em; margin-bottom: 0.35rem;">Real Gold Coins Earned</div>
          <div style="font-family: var(--font-rpg); font-size: 2.2rem; font-weight: 800; color: var(--gold-glow); line-height: 1;">
            +${qr.goldEarned}🪙
          </div>
          <div style="font-size: 0.75rem; color: var(--gold-glow); font-weight: 700; margin-top: 0.35rem;">
            ₹${(qr.goldEarned * 0.1).toFixed(2)} Real Cash Value
          </div>
        </div>
      </div>

      <!-- TEACHER'S POST-TEST REVIEW -->
      <div class="rpg-card" style="margin-bottom: 1.5rem; padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div style="font-family: var(--font-rpg); font-size: 1.1rem; color: #fff;">
            🧙‍♂️ Acharya's Detailed Post-Test Review
          </div>
          <span style="font-size: 0.75rem; color: var(--gold-glow); font-weight: 700;">Deep Explanations</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${(qr.results || []).map((r, i) => {
            const q = (td.questions || [])[i];
            if (!q) return '';
            return `
              <div style="background: rgba(0,0,0,0.35); border: 1px solid ${r.correct ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}; border-radius: 12px; padding: 1.1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <span style="font-size: 0.85rem; font-weight: 800; color: ${r.correct ? '#4ade80' : '#f87171'};">
                    ${r.correct ? '✅ Q' + (i+1) + ': Correct' : '❌ Q' + (i+1) + ': Incorrect'}
                  </span>
                </div>
                <div style="font-size: 0.88rem; color: rgba(255,255,255,0.9); margin-bottom: 0.5rem; font-weight: 600; line-height: 1.45;">
                  ${q.question}
                </div>
                ${!r.correct ? `
                  <div style="font-size: 0.82rem; color: #4ade80; margin-bottom: 0.4rem; background: rgba(34,197,94,0.1); padding: 0.35rem 0.65rem; border-radius: 6px;">
                    <strong>Correct Answer:</strong> ${q.options[r.correctIndex]}
                  </div>
                ` : ''}
                <div style="font-size: 0.82rem; color: rgba(255,255,255,0.8); line-height: 1.5; border-left: 2px solid var(--xp-purple); padding-left: 0.65rem; margin-top: 0.4rem;">
                  💡 <strong>Teacher Explanation:</strong> ${r.explanation || q.explanation}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 2rem;">
        <button id="retryQuizBtn" class="btn-secondary" style="padding: 0.95rem; font-weight: 700;">🔁 Retry Challenge</button>
        <button id="nextTopicBtn" class="btn-primary" style="padding: 0.95rem; font-weight: 700;">📚 Back to Syllabus</button>
      </div>
    </div>
  `;

  document.getElementById('retryQuizBtn').addEventListener('click', () => {
    window.soundFx.playClick();
    if (window.scrollToTop) window.scrollToTop(false);
    tgState.answers = {};
    tgState.quizResult = null;
    tgState.view = 'quiz';
    renderTelanganaView();
  });

  document.getElementById('nextTopicBtn').addEventListener('click', () => {
    window.soundFx.playClick();
    if (window.scrollToTop) window.scrollToTop(false);
    tgState.view = 'board';
    renderTelanganaView();
  });
}
