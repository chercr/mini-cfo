"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"

function detectBrightness(dataUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const size = 50
      canvas.width = size; canvas.height = size
      const ctx = canvas.getContext("2d")
      if (!ctx) { resolve(false); return }
      ctx.drawImage(img, 0, 0, size, size)
      const pixels = ctx.getImageData(0, 0, size, size).data
      let totalLuminance = 0
      for (let i = 0; i < pixels.length; i += 4) {
        // 感知亮度：R*0.299 + G*0.587 + B*0.114
        totalLuminance += pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114
      }
      const avgLuminance = totalLuminance / (size * size)
      resolve(avgLuminance > 130) // >130 认为是浅色壁纸
    }
    img.src = dataUrl
  })
}

export function Wallpaper() {
  const { wallpaper } = useStore()

  const hasWallpaper = !!wallpaper.data

  useEffect(() => {
    if (hasWallpaper) {
      document.documentElement.classList.add("has-wallpaper")
      // 检测图片亮度
      if (wallpaper.type === "image") {
        detectBrightness(wallpaper.data).then((isBright) => {
          if (isBright) {
            document.documentElement.classList.add("has-wallpaper-bright")
          } else {
            document.documentElement.classList.remove("has-wallpaper-bright")
          }
        })
      } else {
        document.documentElement.classList.remove("has-wallpaper-bright")
      }
    } else {
      document.documentElement.classList.remove("has-wallpaper", "has-wallpaper-bright")
    }
    return () => {
      document.documentElement.classList.remove("has-wallpaper", "has-wallpaper-bright")
    }
  }, [hasWallpaper, wallpaper.data, wallpaper.type])

  if (!wallpaper.data) return null

  const bgImage = wallpaper.type === "image"
    ? `url(${wallpaper.data})`
    : wallpaper.data

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage: bgImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: `blur(${wallpaper.blur}px)`,
        opacity: wallpaper.opacity,
      }}
    />
  )
}
