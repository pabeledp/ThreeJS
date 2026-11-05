import React from 'react'
import { RotateCcw, Volume2, Bell, MapPin, Gauge, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { DHAKA_LOCATIONS } from '../data/portfolioData'
import { playRickshawBell, playEasybikeHorn } from '../utils/audio'

export default function ControlsOverlay({ speed = 0, onReset, carCoords = { x: 0, z: 0 }, setExternalControls }) {
  const getDistance = (targetPos) => {
    const dx = carCoords.x - targetPos[0]
    const dz = carCoords.z - targetPos[2]
    return Math.round(Math.sqrt(dx * dx + dz * dz))
  }

  const handleControlPress = (action, state) => {
    if (setExternalControls) {
      setExternalControls((prev) => ({
        ...prev,
        [action]: state
      }))
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '18px',
        boxSizing: 'border-box',
        fontFamily: "'Hind Siliguri', 'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Top Header & GPS Navigator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          pointerEvents: 'auto',
          flexWrap: 'wrap'
        }}
      >
        {/* Title Badge */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(12px)',
            padding: '10px 16px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255, 255, 255, 0.8)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px' }}>🛺</span>
            <div>
              <h1
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: 0
                }}
              >
                ঢাকা রাইড: ভিডিও এডিটর পোর্টফোলিও
              </h1>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0, fontWeight: 500 }}>
                ইজিবাইক চালিয়ে অফিসে যান ও টিভি স্ক্রিনে ভিডিও এডিট দেখুন
              </p>
            </div>
          </div>
        </div>

        {/* GPS Destination Landmarks Bar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(12px)',
            padding: '8px 12px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}
        >
          {DHAKA_LOCATIONS.map((loc) => {
            const dist = getDistance(loc.position)
            const isNear = dist < 9
            return (
              <div
                key={loc.id}
                style={{
                  background: isNear ? loc.color : '#f1f5f9',
                  color: isNear ? '#ffffff' : '#334155',
                  padding: '5px 9px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                <MapPin size={12} />
                <span>{loc.name.split('-')[0].trim()}</span>
                <span
                  style={{
                    opacity: 0.85,
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                >
                  {dist}m
                </span>
              </div>
            )
          })}
        </div>

        {/* Speedometer Badge */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(12px)',
            padding: '8px 14px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Gauge size={18} color="#e11d48" />
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 800,
                fontFamily: 'Space Grotesk, monospace',
                color: '#0f172a'
              }}
            >
              {speed}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '3px', fontWeight: 600 }}>
              km/h
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar (HUD + On-screen Driving Buttons) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          pointerEvents: 'auto',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Driving Keys HUD & Clickable Buttons */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(12px)',
            padding: '12px 16px',
            borderRadius: '18px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}
        >
          {/* On-screen Drive D-Pad (Mouse / Touch Enabled) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button
              className="keycap d-pad-btn"
              onMouseDown={() => handleControlPress('forward', true)}
              onMouseUp={() => handleControlPress('forward', false)}
              onTouchStart={() => handleControlPress('forward', true)}
              onTouchEnd={() => handleControlPress('forward', false)}
              title="Forward (W / Up)"
            >
              <ArrowUp size={16} />
            </button>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className="keycap d-pad-btn"
                onMouseDown={() => handleControlPress('left', true)}
                onMouseUp={() => handleControlPress('left', false)}
                onTouchStart={() => handleControlPress('left', true)}
                onTouchEnd={() => handleControlPress('left', false)}
                title="Left (A / Left)"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                className="keycap d-pad-btn"
                onMouseDown={() => handleControlPress('backward', true)}
                onMouseUp={() => handleControlPress('backward', false)}
                onTouchStart={() => handleControlPress('backward', true)}
                onTouchEnd={() => handleControlPress('backward', false)}
                title="Reverse (S / Down)"
              >
                <ArrowDown size={16} />
              </button>
              <button
                className="keycap d-pad-btn"
                onMouseDown={() => handleControlPress('right', true)}
                onMouseUp={() => handleControlPress('right', false)}
                onTouchStart={() => handleControlPress('right', true)}
                onTouchEnd={() => handleControlPress('right', false)}
                title="Right (D / Right)"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Action Keys Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="keycap-pill">SPACE</span>
              <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>ব্রেক (Brake)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="keycap-sm">H</span>
              <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>ইজিবাইক হর্ন</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="keycap-sm">B</span>
              <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>রিকশার বেল</span>
            </div>
          </div>
        </div>

        {/* Audio & Reset Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Rickshaw Bell Button */}
          <button
            onClick={playRickshawBell}
            className="hud-action-btn"
            style={{ background: '#10b981' }}
            title="টুং-টাং বেল বাজান (Key: B)"
          >
            <Bell size={16} />
            <span>বেল বাজান</span>
          </button>

          {/* Easybike Horn Button */}
          <button
            onClick={playEasybikeHorn}
            className="hud-action-btn"
            style={{ background: '#f59e0b' }}
            title="পিপ-পিপ হর্ন বাজান (Key: H)"
          >
            <Volume2 size={16} />
            <span>হর্ন বাজান</span>
          </button>

          {/* Reset Vehicle */}
          <button
            onClick={onReset}
            className="hud-action-btn"
            style={{ background: '#0f172a' }}
            title="বাসায় ফিরে যান (Key: R)"
          >
            <RotateCcw size={16} />
            <span>রিসেট (বাসা)</span>
          </button>
        </div>
      </div>
    </div>
  )
}
