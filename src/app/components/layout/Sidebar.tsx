'use client'

import { FileUser, LayoutDashboard, LogOut, User, Users, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import Button from '../ui/Button'
import { useState } from 'react'

interface SidebarProps {
  isLoggingOut: boolean
  onLogout: () => void
  mobile?: boolean
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({
  isLoggingOut,
  onLogout,
  mobile = false,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const isDashboardActive = pathname === '/dashboard'
  const isPersonalActive =
    pathname.startsWith('/personal') || pathname.startsWith('/sheet') || pathname.startsWith('/input')
  const isSharedActive = pathname.startsWith('/shared')
  
  const navItemBaseClass = `group !justify-start !px-3 !py-3 font-medium
    hover:shadow-sm hover:translate-x-1 active:translate-x-0 transition-all duration-200`
  const showLabels = isExpanded || mobile

  const handleNavigate = (path: string) => {
    router.push(path)
    if (mobile) onMobileClose?.()
  }

  return (
    <aside 
      className={
        mobile
          ? `md:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-tertiary border-r border-secondary transition-transform duration-300 ease-in-out ${
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : `hidden md:flex flex-col bg-tertiary border-r border-secondary transition-all duration-300 ease-in-out ${
              isExpanded ? 'md:w-64 lg:w-72' : 'md:w-20'
            }`
      }
    >
      {/* Header */}
      <div className={`h-[82px] border-b border-secondary flex items-center ${
        isExpanded || mobile ? 'px-4' : 'justify-center'
      }`}>
        {isExpanded || mobile ? (
          <>
            <Image
              src="/logo_540x148.svg"
              alt="TapTrack"
              width={220}
              height={48}
              className="mr-auto"
            />
            {mobile ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileClose}
                className="!p-2 !min-w-0 hover:!bg-brand-light"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="!p-2 !min-w-0 hover:!bg-brand-light hover:scale-105 active:scale-95"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={20} />
              </Button>
            )}
          </>
        ) : (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group h-full w-full flex items-center justify-center hover:bg-brand-light transition-all duration-200"
            aria-label="Expand sidebar"
          >
            <span className="relative h-12 w-12 flex items-center justify-center">
              <Image
                src="/compressed_frog_120x120.svg"
                alt="TapTrack"
                width={48}
                height={48}
                className="h-12 w-auto transition-all duration-200 group-hover:opacity-0 group-hover:scale-110"
              />
              <ChevronRight
                size={20}
                className="absolute text-primary cursor-pointer opacity-0 scale-75 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100"
              />
            </span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant={isDashboardActive ? 'secondary' : 'ghost'}
          fullWidth
          onClick={() => handleNavigate('/dashboard')}
          className={`${navItemBaseClass} ${
            !isExpanded && !mobile && '!justify-center hover:!translate-x-0'
          }`}
          title={!isExpanded && !mobile ? 'Dashboard' : undefined}
        >
          <LayoutDashboard
            size={16}
            className="transition-transform group-hover:scale-110 group-hover:rotate-6"
          />
          <span 
            className={`transition-all duration-300 ${
              showLabels ? 'opacity-100 ml-3' : 'opacity-0 w-0 overflow-hidden ml-0'
            }`}
          >
            Dashboard
          </span>
        </Button>

        <Button
          variant={isPersonalActive ? 'secondary' : 'ghost'}
          fullWidth
          onClick={() => handleNavigate('/personal')}
          className={`${navItemBaseClass} ${
            !isExpanded && !mobile && '!justify-center hover:!translate-x-0'
          }`}
          title={!isExpanded && !mobile ? 'Personal' : undefined}
        >
          <FileUser
            size={16}
            className="transition-transform group-hover:scale-110 group-hover:rotate-6"
          />
          <span 
            className={`transition-all duration-300 ${
              showLabels ? 'opacity-100 ml-3' : 'opacity-0 w-0 overflow-hidden ml-0'
            }`}
          >
            Personal
          </span>
        </Button>
        
        <Button
          variant={isSharedActive ? 'secondary' : 'ghost'}
          fullWidth
          onClick={() => handleNavigate('/shared')}
          className={`${navItemBaseClass} ${
            !isExpanded && !mobile && '!justify-center hover:!translate-x-0'
          }`}
          title={!isExpanded && !mobile ? 'Shared' : undefined}
        >
          <Users
            size={16}
            className="transition-transform group-hover:scale-110 group-hover:rotate-6"
          />
          <span 
            className={`transition-all duration-300 ${
              showLabels ? 'opacity-100 ml-3' : 'opacity-0 w-0 overflow-hidden ml-0'
            }`}
          >
            Shared
          </span>
        </Button>
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-secondary space-y-2">
        <Button
          variant="text"
          fullWidth
          className={`group !justify-start !px-3 !py-3 !text-text-primary
            hover:!bg-brand-light hover:!text-link hover:translate-x-1
            active:translate-x-0 transition-all duration-200 ${
            !isExpanded && !mobile && '!justify-center hover:!translate-x-0'
          }`}
          title={!isExpanded && !mobile ? 'Profile' : undefined}
        >
          <User size={16} className="transition-transform group-hover:scale-110 group-hover:rotate-6" />
          <span 
            className={`transition-all duration-300 ${
              showLabels ? 'opacity-100 ml-3' : 'opacity-0 w-0 overflow-hidden ml-0'
            }`}
          >
            Profile
          </span>
        </Button>
        
        <Button
          onClick={() => {
            onLogout()
            if (mobile) onMobileClose?.()
          }}
          loading={isLoggingOut}
          variant="textDanger"
          fullWidth
          className={`group !justify-start !px-3 !py-3
            hover:!bg-error/10 hover:shadow-sm hover:translate-x-1
            active:translate-x-0 transition-all duration-200 ${
            !isExpanded && !mobile && '!justify-center hover:!translate-x-0'
          }`}
          title={!isExpanded && !mobile ? 'Logout' : undefined}
        >
          <LogOut size={16} className="transition-transform group-hover:scale-110 group-hover:rotate-6" />
          <span 
            className={`transition-all duration-300 ${
              showLabels ? 'opacity-100 ml-3' : 'opacity-0 w-0 overflow-hidden ml-0'
            }`}
          >
            Logout
          </span>
        </Button>
      </div>
    </aside>
  )
}
