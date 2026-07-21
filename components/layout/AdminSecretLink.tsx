'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AdminSecretLink({ children, className }: { children: React.ReactNode, className?: string }) {
  const [clicks, setClicks] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (clicks > 0) {
      const timer = setTimeout(() => setClicks(0), 1000) // Reset after 1s of inactivity
      return () => clearTimeout(timer)
    }
  }, [clicks])

  const handleClick = () => {
    const newClicks = clicks + 1
    setClicks(newClicks)
    if (newClicks >= 3) {
      router.push('/admin')
      setClicks(0)
    }
  }

  return (
    <span 
      onClick={handleClick} 
      className={`cursor-default select-none ${className || ''}`}
    >
      {children}
    </span>
  )
}
