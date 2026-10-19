// Native Web Audio API cyber synth for subtle sci-fi / luxury interaction feedback
// Lightweight, zero external assets, strictly client-side

class CyberAudioController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playBlip(freq = 640, type: OscillatorType = 'sine', duration = 0.04, gainLevel = 0.03) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext may be restricted by autoplay policy
    }
  }

  public playSuccess() {
    if (!this.enabled) return;
    this.playBlip(520, 'sine', 0.06, 0.04);
    setTimeout(() => this.playBlip(780, 'sine', 0.08, 0.05), 50);
  }

  public playHover() {
    if (!this.enabled) return;
    this.playBlip(380, 'triangle', 0.025, 0.015);
  }
}

export const cyberAudio = new CyberAudioController();
