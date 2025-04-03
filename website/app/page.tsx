"use client"

import Image from "next/image"
import Link from "next/link"
import { Twitter } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import { OrbitControls, Stars, Box, Float, MeshDistortMaterial } from "@react-three/drei"

function Cube({ position, size, speed, rotationAxis }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Float
      speed={1} // Animation speed
      rotationIntensity={0.2} // XYZ rotation intensity
      floatIntensity={0.2} // Up/down float intensity
      position={position}
    >
      <Box
        args={[1, 1, 1]}
        scale={hovered ? size * 1.1 : size}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        rotation-x={rotationAxis === "x" ? speed : 0}
        rotation-y={rotationAxis === "y" ? speed : 0}
        rotation-z={rotationAxis === "z" ? speed : 0}
      >
        <MeshDistortMaterial
          color="white"
          wireframe={hovered}
          transparent
          opacity={0.7}
          emissive="white"
          emissiveIntensity={0.3}
          distort={hovered ? 0.4 : 0.1} // Distortion amount
          speed={2} // Distortion speed
        />
      </Box>
    </Float>
  )
}

function CubeField() {
  const cubes = []
  const cubeCount = 50 // Number of cubes

  for (let i = 0; i < cubeCount; i++) {
    // Create a random position within a sphere
    const radius = 15 + Math.random() * 10
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    const size = 0.2 + Math.random() * 0.8 // Random size
    const speed = 0.2 + Math.random() * 0.8 // Random rotation speed

    // Random rotation axis
    const axes = ["x", "y", "z"]
    const rotationAxis = axes[Math.floor(Math.random() * axes.length)]

    cubes.push(<Cube key={i} position={[x, y, z]} size={size} speed={speed} rotationAxis={rotationAxis} />)
  }

  return <>{cubes}</>
}

function Scene() {
  const controlsRef = useRef(null)

  useFrame(({ clock }) => {
    if (controlsRef.current) {
      // Very slow auto-rotation of the camera
      controlsRef.current.autoRotate = true
      controlsRef.current.autoRotateSpeed = 0.2
      controlsRef.current.update()
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffffff" />

      <CubeField />
      <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        minPolarAngle={Math.PI / 2 - 0.5}
        maxPolarAngle={Math.PI / 2 + 0.5}
      />
    </>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
          <Scene />
        </Canvas>
      </div>

      <div className="z-10 flex flex-col items-center justify-center gap-8">
        <div className="w-48 h-48 md:w-64 md:h-64 relative">
          <Image src="/logo.png" alt="Three.js Game Jam Logo" fill className="object-contain" priority />
        </div>
        <h1 className="text-white text-3xl md:text-4xl font-bold tracking-wider">COMING SOON</h1>
        <Link
          href="https://twitter.com/threejsgamejam"
          target="_blank"
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
        >
          <Twitter className="w-5 h-5" />
          <span>@threejsgamejam</span>
        </Link>
      </div>
    </main>
  )
}

