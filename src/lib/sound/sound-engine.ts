/**
 * Aura Million-Dollar Polish — Web Audio API Synthesizer & Sound Effects Infrastructure
 * Zero external audio assets required — pure Web Audio API synthesis for pristine 120 FPS performance.
 */

class AuraSoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false; // Disabled by default
  private volume: number = 0.3;
  private ambientGainNode: GainNode | null = null;
  private ambientOscillator: OscillatorNode | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && this.ambientOscillator) {
      this.stopAmbientSound();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Crisp, subtle mechanical click feedback
   */
  public playClick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Harmonious completion chime (e.g. task completed, streak streak updated)
   */
  public playCompletionChime() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.06);

        gain.gain.setValueAtTime(0.01, now + index * 0.06);
        gain.gain.linearRampToValueAtTime(0.12 * this.volume, now + index * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.06);
        osc.stop(now + index * 0.06 + 0.35);
      });
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Soft ambient notification sound
   */
  public playNotification() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.1 * this.volume, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Ambient Focus Generator (Deep Calming White/Pink Noise synth)
   */
  public startAmbientFocusSound() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    if (this.ambientOscillator) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.015 * this.volume;
        b6 = white * 0.115926;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05 * this.volume, this.ctx.currentTime + 2);

      noise.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      this.ambientGainNode = gain;
      this.ambientOscillator = noise as unknown as OscillatorNode;
    } catch {
      // AudioContext fallback
    }
  }

  public stopAmbientSound() {
    if (this.ambientGainNode && this.ctx) {
      try {
        this.ambientGainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1);
        setTimeout(() => {
          if (this.ambientOscillator) {
            (this.ambientOscillator as unknown as AudioBufferSourceNode).stop();
            this.ambientOscillator = null;
            this.ambientGainNode = null;
          }
        }, 1000);
      } catch {
        this.ambientOscillator = null;
        this.ambientGainNode = null;
      }
    }
  }
}

export const soundEngine = new AuraSoundEngine();
