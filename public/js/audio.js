// Synthesized RPG Sound Effects using Web Audio API
// 100% reliable, zero external MP3 dependencies, instant playback

class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15, delay = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // audio context handling
      }
    }, delay * 1000);
  }

  // Tactical sword slash / click
  playClick() {
    if (!this.enabled) return;
    this.init();
    this.playTone(320, 'triangle', 0.06, 0.08);
  }

  // Quest Started / Sword Draw
  playQuestStart() {
    if (!this.enabled) return;
    this.init();
    this.playTone(220, 'sawtooth', 0.08, 0.08);
    this.playTone(440, 'sine', 0.15, 0.1, 0.05);
    this.playTone(660, 'sine', 0.25, 0.12, 0.12);
  }

  // Quest Complete Loot Chime
  playQuestComplete() {
    if (!this.enabled) return;
    this.init();
    // Arpeggio C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.2, 0.15, idx * 0.08);
    });
    // Gold shimmer
    this.playTone(1318.51, 'triangle', 0.35, 0.1, 0.35);
  }

  // Triumphant Level Up Fanfare
  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    const fanfare = [
      { f: 440, t: 0.1, d: 0 },
      { f: 554.37, t: 0.1, d: 0.1 },
      { f: 659.25, t: 0.1, d: 0.2 },
      { f: 880, t: 0.35, d: 0.32 },
      { f: 659.25, t: 0.12, d: 0.65 },
      { f: 880, t: 0.5, d: 0.78 }
    ];
    fanfare.forEach(note => {
      this.playTone(note.f, 'triangle', note.t, 0.18, note.d);
    });
  }

  // Boss Strike Impact
  playBossHit() {
    if (!this.enabled) return;
    this.init();
    this.playTone(120, 'sawtooth', 0.25, 0.25);
    this.playTone(75, 'square', 0.3, 0.2, 0.04);
  }

  // Boss Defeated Victory Anthem
  playBossDefeat() {
    if (!this.enabled) return;
    this.init();
    const anthem = [392, 523.25, 659.25, 783.99, 1046.5];
    anthem.forEach((f, i) => {
      this.playTone(f, 'sawtooth', 0.25, 0.18, i * 0.1);
    });
  }

  // Coin Purchase / Clink
  playCoin() {
    if (!this.enabled) return;
    this.init();
    this.playTone(987.77, 'sine', 0.1, 0.15);
    this.playTone(1318.51, 'sine', 0.2, 0.15, 0.08);
  }

  // Study Spark / Focus XP chime
  playStudySpark() {
    if (!this.enabled) return;
    this.init();
    this.playTone(587.33, 'triangle', 0.08, 0.12);
    this.playTone(880, 'sine', 0.15, 0.14, 0.06);
    this.playTone(1174.66, 'sine', 0.25, 0.1, 0.12);
  }

  // Interactive Drill Correct (Sparkly chime)
  playDrillCorrect() {
    if (!this.enabled) return;
    this.init();
    const notes = [659.25, 830.61, 987.77, 1318.51];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.18, 0.12, idx * 0.06);
    });
  }

  // Interactive Drill Mistake / Try Again
  playDrillWrong() {
    if (!this.enabled) return;
    this.init();
    this.playTone(280, 'sawtooth', 0.15, 0.1);
    this.playTone(220, 'sawtooth', 0.25, 0.12, 0.08);
  }

  // Power-up Buff unlocked
  playPowerUp() {
    if (!this.enabled) return;
    this.init();
    const chord = [440, 554.37, 659.25, 880];
    chord.forEach((f, i) => {
      this.playTone(f, 'sine', 0.35, 0.12, i * 0.04);
    });
  }
}

window.soundFx = new SoundFX();

