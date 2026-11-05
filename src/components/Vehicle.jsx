import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier'
import * as THREE from 'three'
import { playRickshawBell, playEasybikeHorn } from '../utils/audio'

export default function Vehicle({ onSpeedChange, resetTrigger, onLocationDistance, externalControls }) {
  const bodyRef = useRef(null)
  const chassisMeshRef = useRef(null)
  const frontForkRef = useRef(null)
  const frontWheelRef = useRef(null)
  const rearLeftWheelRef = useRef(null)
  const rearRightWheelRef = useRef(null)
  const driverBodyRef = useRef(null)

  // Track inputs
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false
  })

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key ? e.key.toLowerCase() : ''
      const code = e.code || ''

      if (key === 'w' || code === 'KeyW' || key === 'arrowup' || code === 'ArrowUp') {
        keys.current.forward = true
      }
      if (key === 's' || code === 'KeyS' || key === 'arrowdown' || code === 'ArrowDown') {
        keys.current.backward = true
      }
      if (key === 'a' || code === 'KeyA' || key === 'arrowleft' || code === 'ArrowLeft') {
        keys.current.left = true
      }
      if (key === 'd' || code === 'KeyD' || key === 'arrowright' || code === 'ArrowRight') {
        keys.current.right = true
      }
      if (key === ' ' || code === 'Space') {
        keys.current.brake = true
      }
      if (key === 'h' || code === 'KeyH') {
        playEasybikeHorn()
      }
      if (key === 'b' || code === 'KeyB') {
        playRickshawBell()
      }
      if (key === 'r' || code === 'KeyR') {
        resetVehicle()
      }
    }

    const handleKeyUp = (e) => {
      const key = e.key ? e.key.toLowerCase() : ''
      const code = e.code || ''

      if (key === 'w' || code === 'KeyW' || key === 'arrowup' || code === 'ArrowUp') {
        keys.current.forward = false
      }
      if (key === 's' || code === 'KeyS' || key === 'arrowdown' || code === 'ArrowDown') {
        keys.current.backward = false
      }
      if (key === 'a' || code === 'KeyA' || key === 'arrowleft' || code === 'ArrowLeft') {
        keys.current.left = false
      }
      if (key === 'd' || code === 'KeyD' || key === 'arrowright' || code === 'ArrowRight') {
        keys.current.right = false
      }
      if (key === ' ' || code === 'Space') {
        keys.current.brake = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Sync external controls from on-screen buttons
  useEffect(() => {
    if (externalControls) {
      if (externalControls.forward !== undefined) keys.current.forward = externalControls.forward
      if (externalControls.backward !== undefined) keys.current.backward = externalControls.backward
      if (externalControls.left !== undefined) keys.current.left = externalControls.left
      if (externalControls.right !== undefined) keys.current.right = externalControls.right
      if (externalControls.brake !== undefined) keys.current.brake = externalControls.brake
    }
  }, [externalControls])

  useEffect(() => {
    if (resetTrigger > 0) {
      resetVehicle()
    }
  }, [resetTrigger])

  // Reset vehicle directly into Home Garage beside road (facing East towards road: Y rot = -Math.PI/2)
  const resetVehicle = () => {
    if (!bodyRef.current) return
    bodyRef.current.setTranslation({ x: -18, y: 0.5, z: 15 }, true)
    bodyRef.current.setRotation({ x: 0, y: -0.7071, z: 0, w: 0.7071 }, true)
    bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    speedRef.current = 0
  }

  // Pre-allocated vectors for 60 FPS performance
  const tempForward = new THREE.Vector3()
  const tempQuat = new THREE.Quaternion()
  const tempCamTarget = new THREE.Vector3()
  const targetCamPos = new THREE.Vector3()
  const speedRef = useRef(0)

  useFrame((state, delta) => {
    if (!bodyRef.current) return

    const translation = bodyRef.current.translation()
    const rotation = bodyRef.current.rotation()
    const currentLinvel = bodyRef.current.linvel()
    const currentAngvel = bodyRef.current.angvel()

    tempQuat.set(rotation.x, rotation.y, rotation.z, rotation.w)

    // Forward vector in world coordinates (Facing -Z in local coords)
    tempForward.set(0, 0, -1).applyQuaternion(tempQuat)

    // Auto-respawn if fallen off world
    if (translation.y < -10) {
      resetVehicle()
      return
    }

    // Auto-Righting stabilization: Force roll (Z) and pitch (X) to stay upright so it NEVER flips!
    if (Math.abs(rotation.x) > 0.1 || Math.abs(rotation.z) > 0.1) {
      const euler = new THREE.Euler().setFromQuaternion(tempQuat, 'YXZ')
      euler.x = THREE.MathUtils.lerp(euler.x, 0, 0.3)
      euler.z = THREE.MathUtils.lerp(euler.z, 0, 0.3)
      const uprightQuat = new THREE.Quaternion().setFromEuler(euler)
      bodyRef.current.setRotation(
        { x: uprightQuat.x, y: uprightQuat.y, z: uprightQuat.z, w: uprightQuat.w },
        true
      )
    }

    // Buttery Smooth Driving Dynamics
    const MAX_FORWARD_SPEED = 24
    const MAX_REVERSE_SPEED = 10
    const ACCEL = 40 * delta
    const DECEL = 22 * delta

    if (keys.current.forward) {
      speedRef.current = Math.min(speedRef.current + ACCEL, MAX_FORWARD_SPEED)
    } else if (keys.current.backward) {
      speedRef.current = Math.max(speedRef.current - ACCEL * 0.85, -MAX_REVERSE_SPEED)
    } else {
      if (speedRef.current > 0) {
        speedRef.current = Math.max(speedRef.current - DECEL, 0)
      } else if (speedRef.current < 0) {
        speedRef.current = Math.min(speedRef.current + DECEL, 0)
      }
    }

    if (keys.current.brake) {
      speedRef.current *= 0.8
    }

    // Agile & Smooth Steering
    const STEER_SPEED = 3.8
    if (keys.current.left) {
      bodyRef.current.setAngvel({ x: 0, y: STEER_SPEED, z: 0 }, true)
    } else if (keys.current.right) {
      bodyRef.current.setAngvel({ x: 0, y: -STEER_SPEED, z: 0 }, true)
    } else {
      bodyRef.current.setAngvel({ x: 0, y: currentAngvel.y * 0.5, z: 0 }, true)
    }

    // Direct linear velocity for ultra-smooth gliding movement
    bodyRef.current.setLinvel(
      {
        x: tempForward.x * speedRef.current,
        y: Math.min(currentLinvel.y, 2),
        z: tempForward.z * speedRef.current
      },
      true
    )

    // Speedometer report
    if (onSpeedChange) {
      onSpeedChange(Math.round(Math.abs(speedRef.current) * 3.6))
    }

    // GPS location tracker
    if (onLocationDistance) {
      onLocationDistance({ x: translation.x, z: translation.z })
    }

    // Wheel visual rotations
    const wheelSpinSpeed = speedRef.current * delta * 7.0
    if (frontWheelRef.current) {
      frontWheelRef.current.rotation.x += wheelSpinSpeed
    }
    if (rearLeftWheelRef.current && rearRightWheelRef.current) {
      rearLeftWheelRef.current.rotation.x += wheelSpinSpeed
      rearRightWheelRef.current.rotation.x += wheelSpinSpeed
    }

    // Handlebar steering rotation visual
    const targetSteerAngle = keys.current.left ? 0.5 : keys.current.right ? -0.5 : 0
    if (frontForkRef.current) {
      frontForkRef.current.rotation.y = THREE.MathUtils.lerp(
        frontForkRef.current.rotation.y,
        targetSteerAngle,
        0.3
      )
    }

    // Driver leaning body into turns!
    if (driverBodyRef.current) {
      const targetLean = keys.current.left ? -0.15 : keys.current.right ? 0.15 : 0
      driverBodyRef.current.rotation.z = THREE.MathUtils.lerp(
        driverBodyRef.current.rotation.z,
        targetLean,
        0.2
      )
    }

    // Smooth Follow Camera
    targetCamPos.set(translation.x + 16, translation.y + 20, translation.z + 16)
    tempCamTarget.set(translation.x, translation.y + 1.2, translation.z)

    state.camera.position.lerp(targetCamPos, 0.08)
    state.camera.lookAt(tempCamTarget)
  })

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      mass={1.8}
      linearDamping={0.1}
      angularDamping={3.0}
      enabledRotations={[false, true, false]}
      position={[-18, 0.5, 15]}
      rotation={[0, -Math.PI / 2, 0]}
    >
      {/* Lower Chassis Box Collider */}
      <CuboidCollider args={[0.85, 0.35, 1.3]} position={[0, 0.5, 0]} friction={0.02} />

      {/* 3 Wheel Sphere Colliders */}
      <BallCollider args={[0.3]} position={[0, 0.3, -1.2]} friction={0.05} />
      <BallCollider args={[0.32]} position={[-0.85, 0.32, 0.95]} friction={0.05} />
      <BallCollider args={[0.32]} position={[0.85, 0.32, 0.95]} friction={0.05} />

      {/* --- Procedural Bangladeshi Electric Easybike Mesh --- */}
      <group ref={chassisMeshRef}>
        {/* Main Lower White Body / Floor Plate */}
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.22, 2.7]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.15} />
        </mesh>

        {/* Battery Box Compartment */}
        <mesh position={[0, 0.5, 0.5]} castShadow>
          <boxGeometry args={[1.5, 0.35, 1.4]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* --- Seating --- */}
        <mesh position={[0, 0.68, -0.25]} castShadow>
          <boxGeometry args={[0.75, 0.15, 0.55]} />
          <meshStandardMaterial color="#fef08a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.95, 0.04]} castShadow>
          <boxGeometry args={[0.7, 0.35, 0.1]} />
          <meshStandardMaterial color="#fef08a" roughness={0.8} />
        </mesh>

        {/* --- 3D DRIVER CHARACTER SEATED IN THE EASYBIKE (The Player Driver!) --- */}
        <group ref={driverBodyRef} position={[0, 0.75, -0.2]}>
          {/* Head with Black Cap */}
          <mesh position={[0, 0.88, 0]} castShadow>
            <sphereGeometry args={[0.16, 14, 14]} />
            <meshStandardMaterial color="#d49366" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.98, -0.02]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.28, 0.08, 0.36]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>

          {/* Torso / Polo Shirt (Vibrant Bengali Orange-Red) */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.44, 0.52, 0.26]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} />
          </mesh>

          {/* Seated Thighs (Navy Blue Trousers) */}
          <mesh position={[0, 0.18, -0.2]} castShadow>
            <boxGeometry args={[0.42, 0.18, 0.44]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Lower Legs going down to footboard */}
          <mesh position={[-0.14, -0.15, -0.42]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.45, 8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.14, -0.15, -0.42]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.45, 8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* Left & Right Arms stretching forward gripping the Handlebars */}
          <mesh position={[-0.24, 0.48, -0.32]} rotation={[0.65, -0.2, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.48, 8]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
          <mesh position={[0.24, 0.48, -0.32]} rotation={[0.65, 0.2, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.48, 8]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
        </group>

        {/* Rear Passenger Bench */}
        <mesh position={[0, 0.72, 0.85]} castShadow receiveShadow>
          <boxGeometry args={[1.55, 0.16, 0.75]} />
          <meshStandardMaterial color="#fef08a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.15, 1.25]} castShadow>
          <boxGeometry args={[1.55, 0.55, 0.12]} />
          <meshStandardMaterial color="#fef08a" roughness={0.8} />
        </mesh>

        {/* Chrome Handrails */}
        <mesh position={[-0.8, 1.05, 0.85]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.8, 1.05, 0.85]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* --- Overhead Canopy Roof --- */}
        <mesh position={[-0.8, 1.35, -0.6]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.9, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.8, 1.35, -0.6]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.9, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[-0.8, 1.35, 1.28]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.9, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.8, 1.35, 1.28]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.9, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        <mesh position={[0, 2.3, 0.35]} castShadow receiveShadow>
          <boxGeometry args={[1.82, 0.14, 2.65]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.05} />
        </mesh>

        {/* Hanging Passenger Straps */}
        {[-0.4, 0.4].map((x) =>
          [-0.1, 0.5].map((z) => (
            <group key={`grip-${x}-${z}`} position={[x, 2.05, z]}>
              <mesh>
                <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
                <meshStandardMaterial color="#ef4444" roughness={0.4} />
              </mesh>
              <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.06, 0.015, 8, 16]} />
                <meshStandardMaterial color="#ef4444" roughness={0.4} />
              </mesh>
            </group>
          ))
        )}

        {/* Front Crash Guard */}
        <mesh position={[0, 0.45, -1.25]} castShadow>
          <boxGeometry args={[1.4, 0.06, 0.06]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* --- Front Fork Assembly --- */}
        <group ref={frontForkRef} position={[0, 0.45, -1.2]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Red Coiled Springs */}
          <mesh position={[-0.18, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.5, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0.18, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.5, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.2} />
          </mesh>

          {/* Headlight */}
          <mesh position={[0, 0.72, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 20]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2.5} />
          </mesh>

          {/* Handlebars */}
          <mesh position={[0, 0.88, 0.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[-0.42, 0.88, 0.15]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.15, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          <mesh position={[0.42, 0.88, 0.15]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.15, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>

          {/* Front Wheel */}
          <group ref={frontWheelRef} position={[0, -0.16, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.18, 20]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.2, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* --- 2 Rear Wheels --- */}
        <group position={[-0.88, 0.28, 0.95]}>
          <group ref={rearLeftWheelRef}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.22, 20]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.17, 0.17, 0.24, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        </group>

        <group position={[0.88, 0.28, 0.95]}>
          <group ref={rearRightWheelRef}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.22, 20]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.17, 0.17, 0.24, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </group>
    </RigidBody>
  )
}
