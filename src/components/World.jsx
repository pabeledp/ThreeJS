import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { Html } from '@react-three/drei'
import { DHAKA_LOCATIONS } from '../data/portfolioData'
import InteractiveOffice from './InteractiveOffice'
import { Coffee, Store, MapPin, Sparkles, User, AlertTriangle } from 'lucide-react'
import * as THREE from 'three'

// --- Realistic Organic Tree (Placed strictly on green grass, never on roads) ---
function RealisticTree({ position = [0, 0, 0], scale = 1, isKrishnachura = false }) {
  const foliageColor = isKrishnachura ? '#dc2626' : '#15803d'
  const foliageColor2 = isKrishnachura ? '#ea580c' : '#16a34a'

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.45, 3.6, 10]} />
        <meshStandardMaterial color="#5c3818" roughness={0.9} />
      </mesh>
      <mesh position={[-0.4, 3.2, 0]} rotation={[0, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 1.6, 8]} />
        <meshStandardMaterial color="#5c3818" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 3.4, 0.2]} rotation={[-0.3, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.5, 8]} />
        <meshStandardMaterial color="#5c3818" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.4, 0]} castShadow>
        <dodecahedronGeometry args={[2.0, 1]} />
        <meshStandardMaterial color={foliageColor} roughness={0.8} />
      </mesh>
      <mesh position={[-1.2, 4.0, 0.4]} castShadow>
        <dodecahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color={foliageColor2} roughness={0.8} />
      </mesh>
      <mesh position={[1.1, 4.2, -0.3]} castShadow>
        <dodecahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial color={foliageColor} roughness={0.8} />
      </mesh>
    </group>
  )
}

// --- 3D Human Figure ---
function HumanFigure({ shirtColor = '#2563eb', hasCap = false, isAngry = false }) {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#d49366" roughness={0.8} />
      </mesh>
      {hasCap && (
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.3, 0.08, 0.35]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      )}
      {/* Torso */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.38, 0.48, 0.24]} />
        <meshStandardMaterial color={shirtColor} roughness={0.6} />
      </mesh>
      {/* Arms: If angry, hands raised in air gesturing! */}
      {isAngry ? (
        <>
          <mesh position={[-0.22, 0.65, 0]} rotation={[0, 0, 2.2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.38, 8]} />
            <meshStandardMaterial color={shirtColor} />
          </mesh>
          <mesh position={[0.22, 0.65, 0]} rotation={[0, 0, -2.2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.38, 8]} />
            <meshStandardMaterial color={shirtColor} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[-0.18, 0.32, -0.2]} rotation={[0.8, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.35, 8]} />
            <meshStandardMaterial color={shirtColor} />
          </mesh>
          <mesh position={[0.18, 0.32, -0.2]} rotation={[0.8, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.35, 8]} />
            <meshStandardMaterial color={shirtColor} />
          </mesh>
        </>
      )}
    </group>
  )
}

// --- ACCURATE BANGLADESHI CYCLE RICKSHAW WITH SPOKED BICYCLE WHEELS ---
function AccurateCycleRickshaw({ rickshawRef, initialPos, rotation = [0, 0, 0] }) {
  return (
    <group ref={rickshawRef} position={initialPos} rotation={rotation}>
      {/* Tubular Steel Bicycle Frame */}
      <mesh position={[0, 0.55, 0.3]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, -0.2]} rotation={[-0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>

      {/* Rear Passenger Bench & Footboard */}
      <mesh position={[0, 0.75, -0.5]} castShadow>
        <boxGeometry args={[1.3, 0.15, 0.6]} />
        <meshStandardMaterial color="#e11d48" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.15, -0.76]} castShadow>
        <boxGeometry args={[1.3, 0.55, 0.1]} />
        <meshStandardMaterial color="#e11d48" roughness={0.6} />
      </mesh>

      {/* Painted Decorative Rickshaw Art Hood */}
      <mesh position={[0, 1.55, -0.58]} rotation={[0.22, 0, 0]} castShadow>
        <boxGeometry args={[1.34, 0.12, 0.9]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} />
      </mesh>

      {/* Front Bicycle Wheel (Accurate: Thin Tire, Chrome Rim, Hub, Spokes) */}
      <group position={[0, 0.42, 1.15]}>
        {/* Rubber Tire */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.42, 0.035, 12, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        {/* Chrome Rim */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.39, 0.015, 8, 24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        {/* Center Hub */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Wire Spokes Cross */}
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.78, 4]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.78, 4]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>

      {/* Rear Left Wheel + Tin Mudguard */}
      <group position={[-0.72, 0.42, -0.5]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.42, 0.035, 12, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.39, 0.015, 8, 24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.46, 0.46, 0.1, 16, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#e11d48" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Rear Right Wheel + Tin Mudguard */}
      <group position={[0.72, 0.42, -0.5]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.42, 0.035, 12, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.39, 0.015, 8, 24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.46, 0.46, 0.1, 16, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#e11d48" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Rickshaw Puller (রিকশাওয়ালা) on Saddle */}
      <group position={[0, 0.8, 0.4]}>
        <HumanFigure shirtColor="#10b981" />
        <mesh position={[0, 0.55, 0.35]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.65, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

// --- VEHICLE: City Bus with Collision Driver Exit ---
function DetailedBus({ busRef, isCrashed }) {
  return (
    <group ref={busRef} position={[-3.6, 0, -50]}>
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.7, 2.5, 9.2]} />
        <meshStandardMaterial color="#15803d" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[2.74, 0.4, 9.25]} />
        <meshStandardMaterial color="#e11d48" roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.05, 4.62]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[2.5, 1.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>
      {[-3.0, -1.5, 0, 1.5, 3.0].map((z) => (
        <React.Fragment key={`bus-win-${z}`}>
          <mesh position={[-1.36, 2.05, z]}>
            <boxGeometry args={[0.04, 0.95, 1.2]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} />
          </mesh>
          <mesh position={[1.36, 2.05, z]}>
            <boxGeometry args={[0.04, 0.95, 1.2]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} />
          </mesh>
        </React.Fragment>
      ))}
      <mesh position={[1.36, 1.2, 3.6]}>
        <boxGeometry args={[0.05, 1.8, 1.1]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.95, 0.85, 4.62]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.95, 0.85, 4.62]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2.5} />
      </mesh>
      {/* 6 Wheels */}
      {[-1.38, 1.38].map((x) =>
        [-2.8, -1.8, 3.0].map((z) => (
          <group key={`b-wheel-${x}-${z}`} position={[x, 0.45, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.45, 0.45, 0.3, 20]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>
          </group>
        ))
      )}

      {/* Driver: Inside when normal, OR Stepped Out when collided! */}
      {isCrashed ? (
        <group position={[2.2, 0, 3.6]} rotation={[0, -Math.PI / 2, 0]}>
          <HumanFigure shirtColor="#0284c7" hasCap={true} isAngry={true} />
          <Html position={[0, 1.6, 0]} center distanceFactor={11}>
            <div className="crash-shout-bubble">
              <AlertTriangle size={14} color="#ef4444" />
              <span>এই মিয়া! দেইখা চালান না ক্যান?!</span>
            </div>
          </Html>
        </group>
      ) : (
        <group position={[0.7, 1.45, 3.6]}>
          <HumanFigure shirtColor="#0284c7" hasCap={true} />
        </group>
      )}
    </group>
  )
}

// --- VEHICLE: CNG with Collision Driver Exit ---
function DetailedCNG({ cngRef, initialPos, rotation = [0, 0, 0], isCrashed }) {
  return (
    <group ref={cngRef} position={initialPos} rotation={rotation}>
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[1.5, 0.7, 2.6]} />
        <meshStandardMaterial color="#15803d" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.45, 0.1]} castShadow>
        <boxGeometry args={[1.52, 0.9, 2.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.35, 1.15]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[1.35, 0.65, 0.05]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} />
      </mesh>
      <mesh position={[-0.77, 1.25, 0.1]}>
        <boxGeometry args={[0.04, 0.7, 1.8]} />
        <meshStandardMaterial color="#475569" wireframe={true} />
      </mesh>
      <mesh position={[0.77, 1.25, 0.1]}>
        <boxGeometry args={[0.04, 0.7, 1.8]} />
        <meshStandardMaterial color="#475569" wireframe={true} />
      </mesh>
      <mesh position={[0, 0.7, 1.32]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2.5} />
      </mesh>
      {/* 3 Wheels */}
      <mesh position={[0, 0.32, 1.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.75, 0.32, -0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.75, 0.32, -0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Driver Exit on Crash */}
      {isCrashed ? (
        <group position={[1.4, 0, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
          <HumanFigure shirtColor="#ea580c" isAngry={true} />
          <Html position={[0, 1.5, 0]} center distanceFactor={11}>
            <div className="crash-shout-bubble">
              <AlertTriangle size={14} color="#ef4444" />
              <span>ভাই গাড়ি কেমনে চালান?! ব্রেক নাই?!</span>
            </div>
          </Html>
        </group>
      ) : (
        <group position={[0, 0.85, 0.5]}>
          <HumanFigure shirtColor="#ea580c" />
        </group>
      )}
    </group>
  )
}

// --- VEHICLE: White Microbus ---
function WhiteMicrobus({ microbusRef, initialPos, rotation = [0, 0, 0] }) {
  return (
    <group ref={microbusRef} position={initialPos} rotation={rotation}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[2.0, 1.6, 4.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.25, 2.42]}>
        <planeGeometry args={[1.8, 0.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>
      {[-1.04, 1.04].map((x) =>
        [-1.6, 1.6].map((z) => (
          <mesh key={`m-wheel-${x}-${z}`} position={[x, 0.38, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.36, 0.36, 0.22, 16]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))
      )}
      <group position={[0.5, 0.95, 1.4]}>
        <HumanFigure shirtColor="#334155" />
      </group>
    </group>
  )
}

// --- ILLUMINATED TONG DOKAN (মায়ের দোয়া চা স্টল) ---
function IlluminatedTongDokan({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 1.6, 2.4]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.6, 0.2]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[4.4, 0.12, 3.2]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.4, 2.0]} castShadow>
        <boxGeometry args={[3.4, 0.15, 0.6]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
      {/* Kettle */}
      <mesh position={[-0.8, 1.75, 0.4]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.35, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} />
      </mesh>
      {/* Warm Illumination Bulb */}
      <pointLight position={[0, 2.3, 0.4]} intensity={3.5} distance={12} color="#fef08a" />
      <mesh position={[0, 2.4, 0.4]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={3} />
      </mesh>
      {/* Shopkeeper */}
      <group position={[0, 0.8, -0.4]}>
        <HumanFigure shirtColor="#ffffff" />
      </group>
      {/* 2 Customers */}
      <group position={[-0.9, 0.4, 2.0]}>
        <HumanFigure shirtColor="#3b82f6" />
      </group>
      <group position={[0.9, 0.4, 2.0]}>
        <HumanFigure shirtColor="#f97316" />
      </group>
      <Html position={[0, 3.0, 0.6]} transform center distanceFactor={12}>
        <div
          style={{
            background: '#b91c1c',
            color: '#fff',
            border: '2px solid #fef08a',
            padding: '5px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: "'Hind Siliguri', sans-serif",
            whiteSpace: 'nowrap'
          }}
        >
          ☕ মায়ের দোয়া চা স্টল (গরম চা ও স্ন্যাক্স)
        </div>
      </Html>
    </group>
  )
}

// --- CITY APARTMENT BUILDINGS (Hollow colliders, placed off-road) ---
function CityBuilding({ position, size = [10, 12, 10], color = '#f1f5f9' }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} position={[0, size[1] / 2, 0]} />
        <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        <mesh position={[0, size[1] / 2, size[2] / 2 + 0.05]}>
          <planeGeometry args={[size[0] * 0.8, size[1] * 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.2} />
        </mesh>
      </RigidBody>
    </group>
  )
}

export default function World({ onOpenCinema, playerCoords = { x: 0, z: 0 } }) {
  const homeLoc = DHAKA_LOCATIONS.find((l) => l.id === 'home')
  const workLocations = DHAKA_LOCATIONS.filter((l) => l.type === 'work')

  // Traffic Refs
  const busRef = useRef(null)
  const cng1Ref = useRef(null)
  const cng2Ref = useRef(null)
  const microbusRef = useRef(null)
  const rickshaw1Ref = useRef(null)
  const rickshaw2Ref = useRef(null)

  // Crash States for driver stepping out
  const [busCrashed, setBusCrashed] = useState(false)
  const [cngCrashed, setCngCrashed] = useState(false)

  useFrame((_, delta) => {
    // 1. Bus Movement on Southbound Lane (x = -3.8)
    if (busRef.current && !busCrashed) {
      busRef.current.position.z += 9.5 * delta
      if (busRef.current.position.z > 85) busRef.current.position.z = -85

      // Check collision with player car
      const dx = playerCoords.x - (-3.6)
      const dz = playerCoords.z - busRef.current.position.z
      if (Math.sqrt(dx * dx + dz * dz) < 4.2) {
        setBusCrashed(true)
        setTimeout(() => setBusCrashed(false), 7000)
      }
    }

    // 2. CNG 1 Movement on Northbound Lane (x = 3.8)
    if (cng1Ref.current && !cngCrashed) {
      cng1Ref.current.position.z -= 11.0 * delta
      if (cng1Ref.current.position.z < -85) cng1Ref.current.position.z = 85

      // Check collision with player car
      const dx = playerCoords.x - 3.8
      const dz = playerCoords.z - cng1Ref.current.position.z
      if (Math.sqrt(dx * dx + dz * dz) < 3.2) {
        setCngCrashed(true)
        setTimeout(() => setCngCrashed(false), 7000)
      }
    }

    // 3. CNG 2 Movement on West-East Outer Road (z = -65, Lane y=0)
    if (cng2Ref.current) {
      cng2Ref.current.position.x += 10.5 * delta
      if (cng2Ref.current.position.x > 85) cng2Ref.current.position.x = -85
    }

    // 4. White Microbus on East-West Central Road (z = 0, Lane x from 85 to -85)
    if (microbusRef.current) {
      microbusRef.current.position.x -= 12.0 * delta
      if (microbusRef.current.position.x < -85) microbusRef.current.position.x = 85
    }

    // 5. Traditional Cycle Rickshaws on slow roadside lane
    if (rickshaw1Ref.current) {
      rickshaw1Ref.current.position.z += 4.5 * delta
      if (rickshaw1Ref.current.position.z > 70) rickshaw1Ref.current.position.z = -70
    }
    if (rickshaw2Ref.current) {
      rickshaw2Ref.current.position.x -= 4.2 * delta
      if (rickshaw2Ref.current.position.x < -70) rickshaw2Ref.current.position.x = 70
    }
  })

  return (
    <group>
      {/* --- LUSH GREEN GRASS GROUND TERRAIN --- */}
      <RigidBody type="fixed" friction={0.05} restitution={0.05}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[280, 280]} />
          <meshStandardMaterial color="#3b7d34" roughness={0.9} />
        </mesh>
        <CuboidCollider args={[140, 0.1, 140]} position={[0, -0.1, 0]} friction={0.05} />
      </RigidBody>

      {/* --- SEAMLESS CLOSED-LOOP INTERCONNECTED ROAD NETWORK --- */}
      {/* 1. Central North-South Avenue (x = 0, z from -70 to 70) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[14, 150]} />
        <meshStandardMaterial color="#1e293b" roughness={0.65} />
      </mesh>
      {/* 2. Central East-West Avenue (z = 0, x from -70 to 70) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.022, 0]} receiveShadow>
        <planeGeometry args={[150, 14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.65} />
      </mesh>
      {/* 3. North Ring Road (z = -65) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.021, -65]} receiveShadow>
        <planeGeometry args={[150, 14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.65} />
      </mesh>
      {/* 4. South Ring Road (z = 65) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.021, 65]} receiveShadow>
        <planeGeometry args={[150, 14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.65} />
      </mesh>
      {/* 5. West Outer Avenue (x = -65) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-65, 0.021, 0]} receiveShadow>
        <planeGeometry args={[14, 150]} />
        <meshStandardMaterial color="#1e293b" roughness={0.65} />
      </mesh>
      {/* 6. East Outer Avenue (x = 65) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[65, 0.021, 0]} receiveShadow>
        <planeGeometry args={[14, 150]} />
        <meshStandardMaterial color="#1e293b" roughness={0.65} />
      </mesh>

      {/* Central Yellow Road Dividers */}
      {Array.from({ length: 28 }).map((_, i) => (
        <mesh key={`dash-v-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -65 + i * 5]}>
          <planeGeometry args={[0.35, 3]} />
          <meshStandardMaterial color="#facc15" roughness={0.4} />
        </mesh>
      ))}

      {/* --- ROADSIDE RESIDENTIAL HOME & GARAGE (x = -24, z = 15 - BESIDE ROAD) --- */}
      <group position={[-24, 0, 15]}>
        <RigidBody type="fixed" colliders={false}>
          {/* Main 2-Storey House Collider */}
          <CuboidCollider args={[3.5, 4.5, 6]} position={[-4.5, 4.5, 0]} />
          <mesh position={[-4.5, 4.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[7, 9, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>

          {/* Garage Left Wall Collider */}
          <CuboidCollider args={[3, 1.8, 0.2]} position={[0, 1.8, -2.6]} />
          <mesh position={[0, 1.8, -2.6]} castShadow receiveShadow>
            <boxGeometry args={[6, 3.6, 0.4]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>

          {/* Garage Right Wall Collider */}
          <CuboidCollider args={[3, 1.8, 0.2]} position={[0, 1.8, 2.6]} />
          <mesh position={[0, 1.8, 2.6]} castShadow receiveShadow>
            <boxGeometry args={[6, 3.6, 0.4]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>

          {/* Garage Back Wall Collider */}
          <CuboidCollider args={[0.2, 1.8, 2.6]} position={[-2.8, 1.8, 0]} />
          <mesh position={[-2.8, 1.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.4, 3.6, 5.2]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>

          {/* Garage Roof Mesh */}
          <mesh position={[0, 3.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.2, 0.4, 5.8]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
          </mesh>

          {/* Smooth Paved Driveway connecting garage out to the road */}
          <mesh position={[8.5, 0.04, 0]} receiveShadow>
            <boxGeometry args={[11, 0.08, 5.2]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </mesh>
        </RigidBody>

        <pointLight position={[0, 3.2, 0]} intensity={2.5} distance={10} color="#fef08a" />

        <Html position={[3.2, 3.8, 0]} transform center distanceFactor={14} rotation={[0, Math.PI / 2, 0]}>
          <div
            style={{
              background: '#10b981',
              color: '#fff',
              border: '2px solid #fff',
              padding: '6px 18px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
              fontFamily: "'Hind Siliguri', sans-serif",
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 700 }}>{homeLoc?.name} (গ্যারেজ)</div>
            <div style={{ fontSize: '10px', opacity: 0.9 }}>গ্যারেজ থেকে গাড়ি নিয়ে বের হোন</div>
          </div>
        </Html>
      </group>

      {/* --- TRAFFIC FLEET ON SEPARATED LANES (NO OVERLAPPING!) --- */}
      <DetailedBus busRef={busRef} isCrashed={busCrashed} />
      <DetailedCNG cngRef={cng1Ref} initialPos={[3.8, 0, 45]} rotation={[0, Math.PI, 0]} isCrashed={cngCrashed} />
      <DetailedCNG cngRef={cng2Ref} initialPos={[-30, 0, -65]} rotation={[0, Math.PI / 2, 0]} isCrashed={false} />
      <WhiteMicrobus microbusRef={microbusRef} initialPos={[45, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <AccurateCycleRickshaw rickshawRef={rickshaw1Ref} initialPos={[-5.8, 0, -25]} />
      <AccurateCycleRickshaw rickshawRef={rickshaw2Ref} initialPos={[25, 0, -5.8]} rotation={[0, -Math.PI / 2, 0]} />

      {/* --- ILLUMINATED TONG DOKAN (BESIDE ROAD) --- */}
      <IlluminatedTongDokan position={[-18, 0, -14]} rotation={[0, 0.6, 0]} />
      <IlluminatedTongDokan position={[18, 0, 32]} rotation={[0, -Math.PI / 2, 0]} />

      {/* --- ROADSIDE CITY BUILDINGS (Placed strictly on the plots, OFF the roads) --- */}
      <CityBuilding position={[-32, 0, 38]} size={[11, 15, 9]} color="#f1f5f9" />
      <CityBuilding position={[26, 0, 14]} size={[11, 16, 9]} color="#cbd5e1" />
      <CityBuilding position={[26, 0, -14]} size={[10, 14, 8]} color="#f8fafc" />
      <CityBuilding position={[-30, 0, -32]} size={[10, 14, 8]} color="#e2e8f0" />

      {/* Outer Skyline Towers */}
      <CityBuilding position={[-50, 0, 20]} size={[13, 20, 12]} color="#64748b" />
      <CityBuilding position={[50, 0, 20]} size={[13, 22, 12]} color="#475569" />
      <CityBuilding position={[-50, 0, -25]} size={[12, 18, 10]} color="#94a3b8" />
      <CityBuilding position={[50, 0, -25]} size={[12, 19, 10]} color="#94a3b8" />

      {/* --- REALISTIC TREES (STRICTLY ON GREEN GRASS, ZERO ON ROAD!) --- */}
      <RealisticTree position={[-16, 0, 0]} scale={1.2} isKrishnachura={true} />
      <RealisticTree position={[16, 0, 10]} scale={1.1} isKrishnachura={false} />
      <RealisticTree position={[-16, 0, 32]} scale={1.0} isKrishnachura={false} />
      <RealisticTree position={[16, 0, 26]} scale={1.2} isKrishnachura={true} />
      <RealisticTree position={[-16, 0, -26]} scale={1.1} isKrishnachura={true} />
      <RealisticTree position={[16, 0, -26]} scale={1.0} isKrishnachura={false} />

      {/* --- 3 MILESTONE OFFICES (BESIDE ROADS ONLY) --- */}
      {/* 1. Banglay IELTS: Beside North road at [-24, 0, -35] */}
      <group position={[-24, 0, -35]} rotation={[0, Math.PI / 2, 0]}>
        <InteractiveOffice location={workLocations.find((l) => l.id === 'banglay-ielts')} onOpenCinema={onOpenCinema} />
      </group>

      {/* 2. Pi-Infotech: Beside North road at [24, 0, -35] */}
      <group position={[24, 0, -35]} rotation={[0, -Math.PI / 2, 0]}>
        <InteractiveOffice location={workLocations.find((l) => l.id === 'pi-infotech')} onOpenCinema={onOpenCinema} />
      </group>

      {/* 3. Education BD: Beside South road at [24, 0, 35] */}
      <group position={[24, 0, 35]} rotation={[0, -Math.PI / 2, 0]}>
        <InteractiveOffice location={workLocations.find((l) => l.id === 'education-bd')} onOpenCinema={onOpenCinema} />
      </group>
    </group>
  )
}
