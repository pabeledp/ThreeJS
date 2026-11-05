// Web Audio API Synthesizer for Rickshaw Bell and Easybike Horn
let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// Authentic Bangladeshi Rickshaw Bell ("টুং টুং")
export function playRickshawBell() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // First "Tung"
    createBellStroke(ctx, now, 2100)
    // Second "Tung" with harmonic overlay after 120ms
    createBellStroke(ctx, now + 0.12, 2450)
  } catch (err) {
    console.warn('Audio play error:', err)
  }
}

function createBellStroke(ctx, startTime, freq) {
  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()

  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(freq, startTime)

  osc2.type = 'triangle'
  osc2.frequency.setValueAtTime(freq * 1.5, startTime)

  gain.gain.setValueAtTime(0.3, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45)

  osc1.connect(gain)
  osc2.connect(gain)
  gain.connect(ctx.destination)

  osc1.start(startTime)
  osc2.start(startTime)
  osc1.stop(startTime + 0.5)
  osc2.stop(startTime + 0.5)
}

// Easybike Electronic Horn ("Pip Pip")
export function playEasybikeHorn() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    createHornBeep(ctx, now, 480)
    createHornBeep(ctx, now + 0.14, 480)
  } catch (err) {
    console.warn('Audio play error:', err)
  }
}

function createHornBeep(ctx, startTime, freq) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(freq, startTime)
  osc.frequency.setValueAtTime(freq * 1.25, startTime + 0.05)

  gain.gain.setValueAtTime(0.18, startTime)
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(startTime)
  osc.stop(startTime + 0.12)
}
