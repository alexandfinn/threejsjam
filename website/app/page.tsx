"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { Twitter } from "lucide-react"

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create stars
    const stars: { x: number; y: number; radius: number; opacity: number; speed: number }[] = []

    // Draw stars with twinkling effect
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const time = Date.now() * 0.001

      stars.forEach((star) => {
        // Create twinkling effect
        const twinkle = Math.sin(time * star.speed * 10) * 0.5 + 0.5
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(drawStars)
    }

    const createStars = () => {
      stars.length = 0 // Clear existing stars
      const starCount = Math.floor((canvas.width * canvas.height) / 2000)

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          opacity: Math.random(),
          speed: 0.001 + Math.random() * 0.003,
        })
      }
    }

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createStars() // Recreate stars after resize
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    drawStars() // Start animation after everything is set up

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
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

