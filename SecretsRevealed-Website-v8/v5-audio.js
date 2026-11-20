/* ==========================================================================
   SECRETSREVEALED v5 — STUDIO AMBIENT WORSHIP ENGINE & NATURAL PRAYER VOICES
   Completely re-engineered: Pink-noise rain/ocean beds, warm FM Rhodes,
   lush cathedral reverb, stereo delay, humanized timing + Silent Prayer Halo.
   ========================================================================== */

const WORSHIP_TRACKS = [
  { id: 0, name: "1. Rain & Felt Piano (Sanctuary Stillness)", mood: "Warm Rain" },
  { id: 1, name: "2. Cathedral Shimmer Pad (Hillsong Ambient)", mood: "Cathedral" },
  { id: 2, name: "3. Fireside Acoustic Fingerstyle", mood: "Acoustic" },
  { id: 3, name: "4. Midnight Lo-Fi Grace (Warm Rhodes)", mood: "Chill Vibey" },
  { id: 4, name: "5. Ocean Waves & Crystal Bowls", mood: "Deep Prayer" },
  { id: 5, name: "6. Dawn Strings & Soft Harmonics", mood: "Cinematic" }
];

const WorshipAudioEngine = (() => {
  let ctx = null, master = null, reverb = null, delayL = null, delayR = null, ambNode = null, ambGain = null;
  let timer = null, playing = false, trackIdx = 0, step = 0, vol = 0.72;

  function makeCathedralIR(ac) {
    const len = Math.floor(ac.sampleRate * 3.6);
    const buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const env = Math.pow(1 - i / len, 2.8);
        d[i] = (Math.random() * 2 - 1) * env * (i < 1200 ? i / 1200 : 1);
      }
    }
    return buf;
  }

  function makePinkNoiseBuffer(ac) {
    const len = ac.sampleRate * 4;
    const buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const out = buf.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.96900 * b2 + w * 0.1538520;
        b3 = 0.86650 * b3 + w * 0.3104856;
        b4 = 0.55000 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.0168980;
        out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.035;
        b6 = w * 0.115926;
      }
    }
    return buf;
  }

  function ensure() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = vol;
      master.connect(ctx.destination);

      reverb = ctx.createConvolver();
      reverb.buffer = makeCathedralIR(ctx);
      const revGain = ctx.createGain();
      revGain.gain.value = 0.55;
      reverb.connect(revGain);
      revGain.connect(master);

      delayL = ctx.createDelay(1.0);
      delayR = ctx.createDelay(1.0);
      delayL.delayTime.value = 0.38;
      delayR.delayTime.value = 0.54;
      const fb = ctx.createGain();
      fb.gain.value = 0.28;
      delayL.connect(delayR);
      delayR.connect(fb);
      fb.connect(delayL);
      const delOut = ctx.createGain();
      delOut.gain.value = 0.22;
      delayL.connect(delOut);
      delayR.connect(delOut);
      delOut.connect(reverb);
    }
    if (ctx.state === "suspended") ctx.resume();
    return true;
  }

  function startAmbience(mode) {
    stopAmbience();
    if (!ctx || !mode) return;
    const src = ctx.createBufferSource();
    src.buffer = makePinkNoiseBuffer(ctx);
    src.loop = true;
    const flt = ctx.createBiquadFilter();
    flt.type = mode === "ocean" ? "lowpass" : "bandpass";
    flt.frequency.value = mode === "ocean" ? 360 : 950;
    flt.Q.value = mode === "ocean" ? 0.7 : 0.45;
    ambGain = ctx.createGain();
    ambGain.gain.setValueAtTime(0.001, ctx.currentTime);
    ambGain.gain.linearRampToValueAtTime(mode === "ocean" ? 0.28 : 0.14, ctx.currentTime + 1.5);
    src.connect(flt); flt.connect(ambGain); ambGain.connect(master);
    src.start();
    ambNode = src;
  }

  function stopAmbience() {
    if (ambNode) { try { ambNode.stop(); } catch {} ambNode = null; }
  }

  /* Warm FM Electric Piano / Felt Tone (zero harsh sawtooth buzz!) */
  function fmTone(freq, o = {}) {
    if (!ctx) return;
    const now = ctx.currentTime + (o.delay || 0) + (Math.random() * 0.018);
    const car = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    const flt = ctx.createBiquadFilter();
    const env = ctx.createGain();

    car.type = "sine";
    mod.type = "sine";
    car.frequency.setValueAtTime(freq, now);
    mod.frequency.setValueAtTime(freq * (o.ratio || 2), now);
    modGain.gain.setValueAtTime((o.modIndex || 18), now);
    modGain.gain.exponentialRampToValueAtTime(0.5, now + (o.modDecay || 0.7));

    flt.type = "lowpass";
    flt.frequency.setValueAtTime(o.cutoff || 1200, now);

    const g = o.gain || 0.065;
    const atk = o.atk || 0.03;
    const rel = o.rel || 2.8;
    env.gain.setValueAtTime(0.0005, now);
    env.gain.linearRampToValueAtTime(g, now + atk);
    env.gain.exponentialRampToValueAtTime(0.0005, now + atk + rel);

    mod.connect(modGain); modGain.connect(car.frequency);
    car.connect(flt); flt.connect(env);
    env.connect(master);
    if (reverb) env.connect(reverb);
    if (o.echo && delayL) env.connect(delayL);

    car.start(now); mod.start(now);
    car.stop(now + atk + rel + 0.1); mod.stop(now + atk + rel + 0.1);
  }

  /* Lush Breathing Pad Chord */
  function warmPad(freqs, rel = 4.6, gain = 0.028) {
    freqs.forEach((f, i) => {
      fmTone(f, { ratio: 1, modIndex: 4, cutoff: 620, gain, atk: 1.6, rel, delay: i * 0.04 });
      fmTone(f * 1.003, { ratio: 1, modIndex: 2, cutoff: 520, gain: gain * 0.7, atk: 1.8, rel });
    });
  }

  const tracks = [
    {
      ms: 680, amb: "rain",
      tick: () => {
        const chords = [
          [130.81, 261.63, 329.63, 392.00, 493.88],
          [110.00, 220.00, 261.63, 329.63, 392.00],
          [87.31,  174.61, 261.63, 329.63, 392.00],
          [98.00,  196.00, 293.66, 392.00, 440.00]
        ];
        const bar = chords[Math.floor(step / 6) % chords.length];
        if (step % 6 === 0) warmPad([bar[0], bar[1], bar[2]], 4.2, 0.032);
        const note = bar[1 + (step % 4)];
        fmTone(note, { ratio: 2, modIndex: 14, cutoff: 980, gain: 0.055, atk: 0.025, rel: 2.6, echo: true });
      }
    },
    {
      ms: 3600, amb: null,
      tick: () => {
        const pads = [
          [130.81, 196.00, 246.94, 329.63, 523.25],
          [110.00, 164.81, 220.00, 329.63, 493.88],
          [87.31,  174.61, 220.00, 261.63, 392.00],
          [98.00,  196.00, 246.94, 293.66, 440.00]
        ];
        warmPad(pads[step % pads.length], 5.2, 0.032);
        fmTone(pads[step % pads.length][4] * 2, { ratio: 3, modIndex: 6, cutoff: 1400, gain: 0.012, atk: 1.2, rel: 4.0, echo: true });
      }
    },
    {
      ms: 420, amb: null,
      tick: () => {
        const arps = [
          [196.00, 246.94, 293.66, 392.00, 293.66, 246.94],
          [164.81, 246.94, 329.63, 392.00, 329.63, 246.94],
          [130.81, 196.00, 261.63, 329.63, 261.63, 196.00],
          [146.83, 220.00, 293.66, 369.99, 293.66, 220.00]
        ];
        const a = arps[Math.floor(step / 6) % arps.length];
        fmTone(a[step % 6], { ratio: 3, modIndex: 28, modDecay: 0.25, cutoff: 1650, gain: 0.052, atk: 0.008, rel: 1.45, echo: true });
        if (step % 6 === 0) fmTone(a[0] * 0.5, { ratio: 1, modIndex: 5, cutoff: 420, gain: 0.075, atk: 0.02, rel: 2.2 });
      }
    },
    {
      ms: 480, amb: "rain",
      tick: () => {
        const chords = [
          [220.00, 261.63, 329.63, 392.00, 493.88],
          [174.61, 220.00, 261.63, 329.63, 392.00],
          [130.81, 196.00, 246.94, 329.63],
          [196.00, 246.94, 293.66, 392.00]
        ];
        const beat = step % 8;
        const ch = chords[Math.floor(step / 8) % chords.length];
        if (beat === 0 || beat === 5) {
          ch.forEach((f, i) => fmTone(f, { ratio: 2, modIndex: 12, cutoff: 950, gain: 0.032, atk: 0.02, rel: 2.1, delay: i * 0.025, echo: true }));
        }
        if (beat === 0 || beat === 4) {
          const now = ctx.currentTime;
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = "sine"; o.frequency.setValueAtTime(98, now); o.frequency.exponentialRampToValueAtTime(38, now + 0.16);
          g.gain.setValueAtTime(0.11, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
          o.connect(g); g.connect(master); o.start(now); o.stop(now + 0.28);
        }
      }
    },
    {
      ms: 2800, amb: "ocean",
      tick: () => {
        const bowls = [261.63, 329.63, 392.00, 523.25, 392.00, 293.66];
        const b = bowls[step % bowls.length];
        fmTone(b, { ratio: 2.756, modIndex: 8, cutoff: 1400, gain: 0.042, atk: 0.35, rel: 4.5, echo: true });
        if (step % 2 === 0) warmPad([130.81, 196.00], 5.0, 0.026);
      }
    },
    {
      ms: 2200, amb: null,
      tick: () => {
        const roots = [98.00, 110.00, 87.31, 130.81];
        const r = roots[Math.floor(step / 2) % roots.length];
        warmPad([r, r * 1.5, r * 2, r * 2.5], 4.2, 0.028);
        fmTone(r * 4, { ratio: 2, modIndex: 6, cutoff: 1300, gain: 0.022, atk: 0.8, rel: 3.0, echo: true });
      }
    }
  ];

  function start() {
    if (!ensure()) return;
    stop(true);
    playing = true;
    const tr = tracks[trackIdx] || tracks[0];
    startAmbience(tr.amb);
    tr.tick();
    timer = setInterval(() => { step++; tr.tick(); }, tr.ms);
    updateUI();
  }
  function stop(silent) {
    if (timer) clearInterval(timer);
    timer = null;
    stopAmbience();
    playing = false;
    if (!silent) updateUI();
  }
  function toggle() { playing ? stop() : start(); }
  function setTrack(i) { trackIdx = Math.max(0, Math.min(tracks.length - 1, Number(i) || 0)); step = 0; if (playing) start(); else updateUI(); }
  function setVolume(v) { vol = Math.max(0.05, Math.min(1, Number(v))); if (master && ctx) master.gain.setTargetAtTime(vol, ctx.currentTime, 0.08); }
  function updateUI() {
    document.querySelectorAll("[data-music-toggle]").forEach(b => {
      b.textContent = playing ? "⏸ Pause" : "▶ Play";
      b.classList.toggle("is-active", playing);
    });
    document.querySelectorAll(".eq-bars").forEach(eq => eq.classList.toggle("is-playing", playing));
  }
  return { start, stop, toggle, setTrack, setVolume, updateUI, isPlaying: () => playing };
})();

/* Smart Neural Voice Picker for Pause & Pray (Avoids Robotic Voices + Offers Silent Ambient Halo!) */
function pickBestNeuralVoice(gender) {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  const preferredFemale = ["google uk english female", "google us english", "samantha", "aria", "jenny", "ava", "natural", "enhanced", "karen", "moira"];
  const preferredMale = ["google uk english male", "daniel", "guy", "andrew", "alex", "natural", "enhanced", "oliver"];
  const list = gender === "male" ? preferredMale : preferredFemale;
  for (const hint of list) {
    const v = voices.find(x => x.name.toLowerCase().includes(hint));
    if (v) return v;
  }
  return voices.find(x => x.lang && x.lang.toLowerCase().startsWith("en")) || voices[0] || null;
}
