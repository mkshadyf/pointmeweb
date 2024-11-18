'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, Search, MapPin, User, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { usePointMe } from '../../lib/hooks'

const sidebarItems = {
  admin: ['Dashboard', 'Users', 'Businesses', 'Reports', 'Settings'],
  business: ['Dashboard', 'Bookings', 'Services', 'Analytics', 'Profile'],
  customer: ['My Bookings', 'Favorites', 'Notifications', 'Profile'],
}

export default function PointMeLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user } = usePointMe()

  useEffect(() => setMounted(true), [])

  const userRole = (user?.user_metadata?.role || 'customer') as keyof typeof sidebarItems

  const SidebarContent = () => (
    <nav className="space-y-2">
      {sidebarItems[userRole].map((item) => (
        <Button
          key={item}
          variant="ghost"
          className="w-full justify-start text-left font-normal"
        >
          {item}
        </Button>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <SidebarContent />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="mr-4 hidden lg:flex">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <MapPin className="h-6 w-6" />
              <span className="font-bold">PointMe</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a href="/about">About</a>
              <a href="/pricing">Pricing</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full flex-1 lg:w-auto lg:flex-none">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search locations..."
                  className="w-full bg-background pl-8 lg:w-[300px]"
                />
              </div>
            </div>
            <nav className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Signed in as {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                className="h-8 w-8 px-0"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {mounted && (
                  <>
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </>
                )}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex">
        {/* Sidebar for larger screens */}
        <aside className="hidden w-64 flex-col lg:flex">
          <nav className="flex-1 space-y-2 p-4">
            <SidebarContent />
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 