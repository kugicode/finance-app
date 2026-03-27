"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export default function ThemeToggle(){
const {theme, setTheme} = useTheme();
const [mounted, setMounted] = useState(false);

//Only show the button after the page loads
useEffect(()=> {
    setMounted(true)
}, []);

if (!mounted) return null;

 return (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:ring-2
      ring-green-500 transition-all cursor-pointer"
        >
          {/* Show the Sun icon in Dark Mode, and Moon in Light Mode!*/}
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button> ) 
          }