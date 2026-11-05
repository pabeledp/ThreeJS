import React, { useState } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { Html } from '@react-three/drei'
import { Tv, Play, Building2, Sparkles } from 'lucide-react'

export default function InteractiveOffice({ location, onOpenCinema, position, rotation = [0, 0, 0] }) {
  const [hovered, setHovered] = useState(false)
  const officePos = position || location.position
  const { name, englishName, subtitle, color, role, badge } = location

  return (
    <group position={officePos} rotation={rotation}>
      {/* --- Main Architectural Office Complex (Explicit wall colliders only) --- */}
      <RigidBody type="fixed" colliders={false}>
        {/* Main Commercial Glass Tower Collider (Set back 5 meters so entrance is completely open) */}
        <CuboidCollider args={[5.5, 6, 3]} position={[0, 6, -5]} />
        <mesh position={[0, 6, -5]} castShadow receiveShadow>
          <boxGeometry args={[11, 12, 6]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Tinted Curtain Glass Facade */}
        <mesh position={[0, 6.2, -1.95]}>
          <planeGeometry args={[9.5, 9.8]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.85}
            roughness={0.1}
          />
        </mesh>

        {/* Window Mullions Grid */}
        {[-3.6, -1.8, 0, 1.8, 3.6].map((x) => (
          <mesh key={`mullion-${x}`} position={[x, 6.2, -1.92]}>
            <boxGeometry args={[0.08, 9.8, 0.05]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} />
          </mesh>
        ))}

        {/* Rooftop Sindex Water Tank */}
        <mesh position={[-3, 13.1, -5]} castShadow>
          <cylinderGeometry args={[0.9, 0.9, 1.4, 20]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>

        {/* Entrance Canopy */}
        <mesh position={[0, 3.8, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[8.5, 0.4, 4.5]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.2} />
        </mesh>

        {/* Entrance Pillars */}
        <mesh position={[-3.8, 1.8, 2.2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 3.6, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[3.8, 1.8, 2.2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 3.6, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Ground Entrance Plaza Deck */}
        <mesh position={[0, 0.05, 1.5]} receiveShadow>
          <boxGeometry args={[11, 0.1, 6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
      </RigidBody>

      {/* --- Illuminated Company Billboard / Rooftop Header --- */}
      <Html position={[0, 4.8, 0.5]} transform center distanceFactor={14}>
        <div
          style={{
            background: color,
            color: '#ffffff',
            padding: '8px 22px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255, 255, 255, 0.85)',
            textAlign: 'center',
            minWidth: '240px',
            pointerEvents: 'none',
            fontFamily: "'Hind Siliguri', sans-serif"
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.02em' }}>
            {name}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 500, opacity: 0.95 }}>
            {subtitle} • <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{role}</span>
          </div>
        </div>
      </Html>

      {/* --- 3D TV Screen at the Entrance (Easy to drive right up to it!) --- */}
      <group position={[0, 1.8, 1.2]}>
        {/* TV Pedestal Kiosk */}
        <mesh position={[0, -0.9, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.9, 0.2, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.9, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* TV Outer Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.4, 2.05, 0.18]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* TV Screen with video preview glow */}
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[3.2, 1.85]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive={hovered ? '#0284c7' : '#0369a1'}
            emissiveIntensity={hovered ? 1.2 : 0.75}
            roughness={0.15}
          />
        </mesh>

        {/* TV Floating Interactive Button */}
        <Html position={[0, 1.55, 0]} center distanceFactor={11}>
          <button
            onClick={() => onOpenCinema(location)}
            className="tv-trigger-badge"
            style={{
              background: hovered ? color : '#0f172a',
              color: '#ffffff',
              border: `2px solid ${color}`,
              padding: '10px 20px',
              borderRadius: '26px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              fontFamily: "'Hind Siliguri', sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              whiteSpace: 'nowrap'
            }}
          >
            <Tv size={16} />
            <span>টিভি দেখুন (ভিডিও শো-রিল)</span>
            <Play size={14} fill="#fff" />
          </button>
        </Html>
      </group>

      {/* Proximity Sensor Trigger */}
      <RigidBody
        type="fixed"
        sensor
        onIntersectionEnter={() => {
          setHovered(true)
          onOpenCinema(location)
        }}
        onIntersectionExit={() => {
          setHovered(false)
        }}
      >
        <CuboidCollider args={[4.5, 2.5, 4.5]} position={[0, 1.8, 2.0]} />
      </RigidBody>
    </group>
  )
}
