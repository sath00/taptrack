'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import Button from '../ui/Button'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'taptrack-theme'

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const isTheme = (value: string | null): value is Theme => value === 'light' || value === 'dark'

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  const metaTheme = document.querySelector('meta[name="theme-color"]')
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#0B1220' : '#F59E0B')
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    const initial = isTheme(stored) ? stored : getSystemTheme()

    applyTheme(initial)
    setTheme(initial)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  return (
    <Button
      variant="text"
      size="sm"
      aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="!p-2 !min-w-0"
      onClick={toggleTheme}
      title={mounted && theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {mounted && theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  )
}
