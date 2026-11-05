import React, { useState } from 'react'
import { X, Play, Film, ExternalLink, Sparkles, CheckCircle2, Clapperboard, MonitorPlay } from 'lucide-react'

export default function VideoPlayerModal({ location, onClose }) {
  if (!location || !location.videos || location.videos.length === 0) return null

  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const currentVideo = location.videos[activeVideoIndex] || location.videos[0]

  return (
    <div className="cinema-overlay" onClick={onClose}>
      <div className="cinema-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cinema-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: location.color || '#e11d48',
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clapperboard size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  {location.name}
                </h2>
                <span
                  style={{
                    background: '#f1f5f9',
                    color: location.color || '#e11d48',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {location.role}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                {location.subtitle}
              </p>
            </div>
          </div>

          <button className="cinema-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Video Screen (Main TV Display) */}
        <div className="cinema-screen-container">
          <video
            key={currentVideo.url}
            src={currentVideo.url}
            controls
            autoPlay
            playsInline
            className="cinema-video"
            poster={currentVideo.poster}
          />
        </div>

        {/* Video Selector Tabs & Details */}
        <div className="cinema-body">
          {/* Multiple Videos Navigation Tabs */}
          {location.videos.length > 1 && (
            <div className="cinema-tabs">
              {location.videos.map((vid, idx) => (
                <button
                  key={vid.id || idx}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`cinema-tab ${activeVideoIndex === idx ? 'active' : ''}`}
                  style={{
                    borderColor: activeVideoIndex === idx ? location.color : 'transparent'
                  }}
                >
                  <Film size={14} />
                  <span>{vid.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Video Metadata & Editor Breakdown */}
          <div className="cinema-meta">
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                {currentVideo.title}
              </h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#64748b' }}>
                {currentVideo.subtitle || location.description}
              </p>
            </div>

            {/* Editing Tools Badge */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {currentVideo.tools?.map((tool) => (
                <span key={tool} className="tool-tag">
                  {tool}
                </span>
              ))}
            </div>

            {currentVideo.highlights && (
              <div className="highlights-box">
                <Sparkles size={16} color={location.color || '#e11d48'} />
                <span style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                  {currentVideo.highlights}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
