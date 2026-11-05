import React, { useState } from 'react'
import CanvasContainer from './components/CanvasContainer'
import World from './components/World'
import Vehicle from './components/Vehicle'
import ControlsOverlay from './components/ControlsOverlay'
import VideoPlayerModal from './components/VideoPlayerModal'

export default function App() {
  const [speed, setSpeed] = useState(0)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [carCoords, setCarCoords] = useState({ x: -18, z: 15 })
  const [activeCinemaLocation, setActiveCinemaLocation] = useState(null)
  const [externalControls, setExternalControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false
  })

  const handleReset = () => {
    setResetTrigger((prev) => prev + 1)
  }

  const handleOpenCinema = (location) => {
    setActiveCinemaLocation(location)
  }

  const handleCloseCinema = () => {
    setActiveCinemaLocation(null)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D R3F Canvas and Physics World */}
      <CanvasContainer>
        <World onOpenCinema={handleOpenCinema} playerCoords={carCoords} />
        <Vehicle
          onSpeedChange={setSpeed}
          resetTrigger={resetTrigger}
          onLocationDistance={setCarCoords}
          externalControls={externalControls}
        />
      </CanvasContainer>

      {/* Dhaka GPS & Driving Controls HUD */}
      <ControlsOverlay
        speed={speed}
        onReset={handleReset}
        carCoords={carCoords}
        setExternalControls={setExternalControls}
      />

      {/* Interactive Video Cinema Modal */}
      {activeCinemaLocation && (
        <VideoPlayerModal
          location={activeCinemaLocation}
          onClose={handleCloseCinema}
        />
      )}
    </div>
  )
}
