import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import * as THREE from 'three'

export default function CanvasContainer({ children }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        shadows
        camera={{
          position: [16, 20, 16],
          fov: 40,
          near: 0.1,
          far: 250
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
      >
        {/* Warm Golden Hour Dhaka Atmosphere Sky */}
        <color attach="background" args={['#e8e2d5']} />

        {/* Atmospheric Distance Fog (Blends ground into horizon seamlessly) */}
        <fog attach="fog" args={['#e8e2d5', 45, 130]} />

        {/* Ambient & Warm Fill Light */}
        <ambientLight intensity={0.7} color="#fff8ed" />
        <hemisphereLight skyColor="#f8f4ec" groundColor="#c7bfae" intensity={0.55} />

        {/* Primary Sunlight with Crisp Soft Contact Shadows */}
        <directionalLight
          position={[35, 50, 25]}
          intensity={1.9}
          color="#fffaf0"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={140}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
          shadow-bias={-0.0004}
        />

        {/* Secondary Warm Sunlight Rim Fill */}
        <directionalLight
          position={[-30, 25, -20]}
          intensity={0.4}
          color="#fed7aa"
        />

        {/* Rapier Physics World */}
        <Physics gravity={[0, -9.81, 0]}>
          {children}
        </Physics>
      </Canvas>
    </div>
  )
}
