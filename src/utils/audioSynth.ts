/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class AmbientSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private nodes: {
    gain: GainNode;
    filter: BiquadFilterNode;
  } | null = null;
  private scheduleTimeout: any = null;
  private activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

  // Romantic chord progression in C major / A minor
  // Fmaj7 (F, A, C, E) -> Cmaj7 (C, E, G, B) -> Am9 (A, C, E, G, B) -> G6 (G, B, D, E)
  private chords = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [130.81, 164.81, 196.00, 246.94], // Cmaj7
    [110.00, 130.81, 164.81, 196.00, 246.94], // Am9
    [98.00, 123.47, 146.83, 164.81] // G6
  ];

  private currentChordIndex = 0;
  private tempo = 120; // BPM

  constructor() {}

  public start() {
    if (this.isPlaying) return;

    // Initialize AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    const ctx = this.ctx;

    // Master Volume Control
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1.5); // Smooth fade in

    // Low-pass filter for a warm, soft tone
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    // Connect nodes
    filter.connect(ctx.destination);
    masterGain.connect(filter);

    this.nodes = { gain: masterGain, filter };
    this.isPlaying = true;

    // Start chord loops and note arpeggios
    this.playLoop();
  }

  public stop() {
    this.isPlaying = false;
    if (this.scheduleTimeout) {
      clearTimeout(this.scheduleTimeout);
      this.scheduleTimeout = null;
    }

    if (this.nodes && this.ctx) {
      const now = this.ctx.currentTime;
      this.nodes.gain.gain.cancelScheduledValues(now);
      this.nodes.gain.gain.linearRampToValueAtTime(0, now + 1.0); // Smooth fade out
      
      setTimeout(() => {
        this.activeOscillators.forEach(item => {
          try { item.osc.stop(); } catch(e) {}
        });
        this.activeOscillators = [];
        if (this.ctx && this.ctx.state !== 'closed') {
          this.ctx.close();
        }
        this.ctx = null;
        this.nodes = null;
      }, 1100);
    }
  }

  private playLoop() {
    if (!this.isPlaying || !this.ctx || !this.nodes) return;

    const ctx = this.ctx;
    const masterGain = this.nodes.gain;
    const now = ctx.currentTime;

    const chord = this.chords[this.currentChordIndex];
    
    // Play warm background pad notes for this chord
    chord.forEach((freq, idx) => {
      // Pad Oscillator
      const osc = ctx.createOscillator();
      const padGain = ctx.createGain();

      osc.type = 'triangle'; // Warm waveform
      osc.frequency.setValueAtTime(freq / 2, now); // Octave lower for rich backing

      // Extremely slow and soft envelope
      padGain.gain.setValueAtTime(0, now);
      padGain.gain.linearRampToValueAtTime(0.04, now + 1.5); // Soft fade-in
      padGain.gain.setValueAtTime(0.04, now + 3.5);
      padGain.gain.linearRampToValueAtTime(0, now + 5.0); // Soft fade-out

      osc.connect(padGain);
      padGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 5.0);

      this.activeOscillators.push({ osc, gain: padGain });
    });

    // Play gentle, twinkling arpeggio pattern in the higher registers
    const steps = 8;
    const stepDuration = 5.0 / steps;

    for (let i = 0; i < steps; i++) {
      const stepTime = now + (i * stepDuration);
      
      // Select notes from current chord
      const noteFreq = chord[i % chord.length] * (i % 2 === 0 ? 2 : 1);
      
      // Sparkle chime generator
      const osc = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      // Soft sine waves with a hint of triangle
      osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(noteFreq, stepTime);
      
      // Slight pitch vibrato
      osc.frequency.setValueAtTime(noteFreq, stepTime);
      
      chimeGain.gain.setValueAtTime(0, stepTime);
      // Soft touch curve
      chimeGain.gain.linearRampToValueAtTime(0.02, stepTime + 0.1);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, stepTime + stepDuration - 0.05);

      osc.connect(chimeGain);
      chimeGain.connect(masterGain);

      osc.start(stepTime);
      osc.stop(stepTime + stepDuration);

      this.activeOscillators.push({ osc, gain: chimeGain });
    }

    // Advance to next chord
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

    // Clean up stale oscillators periodically
    this.activeOscillators = this.activeOscillators.filter(item => {
      try {
        // Just keeping oscillators that haven't stopped
        return true;
      } catch (e) {
        return false;
      }
    });

    // Schedule next chord block (5 seconds interval)
    this.scheduleTimeout = setTimeout(() => {
      this.playLoop();
    }, 4800);
  }
}
