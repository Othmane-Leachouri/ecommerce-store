import { useTheme } from '../context/ThemeContext'
import { Moon, Sun } from 'lucide-react'
import "../DarkMode.css"

export default function DarkMode() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleDarkMode}
      aria-label="Toggle theme"
      title={darkMode ? 'Light Mode' : 'Dark Mode'}
    >
      {darkMode ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  )
}