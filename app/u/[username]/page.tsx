'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { trackProfileView, trackLinkClick } from '@/lib/analytics'
import { Link2, Check, MapPin } from 'lucide-react'

interface ProfileData {
  user_id: string
  display_name: string
  bio: string
  location: string
  profile_image: string | null
  username: string
}

interface LinkData {
  id: string
  type: string
  title: string
  url: string
  icon: string
  color: string
  visible: boolean
}

// Custom SVG Icons for proper social media branding
const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
)

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const TwitchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="0.5">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
  </svg>
)

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const LinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

const getIcon = (iconName: string, className: string = "w-5 h-5") => {
  const icons: { [key: string]: React.ReactNode } = {
    twitter: <TwitterXIcon className={className} />,
    instagram: <InstagramIcon className={className} />,
    youtube: <YouTubeIcon className={className} />,
    tiktok: <TikTokIcon className={className} />,
    snapchat: <SnapchatIcon className={className} />,
    linkedin: <LinkedInIcon className={className} />,
    github: <GitHubIcon className={className} />,
    twitch: <TwitchIcon className={className} />,
    facebook: <FacebookIcon className={className} />,
    globe: <GlobeIcon className={className} />,
    mail: <MailIcon className={className} />,
  }
  return icons[iconName] || <LinkIcon className={className} />
}

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [links, setLinks] = useState<LinkData[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const hasTrackedView = useRef(false)

  useEffect(() => {
    const loadProfile = async () => {
      // Get profile by username (case-insensitive)
      const { data: profileData, error: profileError } = await supabase
        .from('linkfolio_profiles')
        .select('*')
        .ilike('username', username)
        .single()

      if (profileError || !profileData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setProfile(profileData)

      // Track profile view (only once per page load)
      if (!hasTrackedView.current && profileData.user_id) {
        hasTrackedView.current = true
        trackProfileView(profileData.user_id)
      }

      // Get visible links
      const { data: linksData } = await supabase
        .from('linkfolio_links')
        .select('*')
        .eq('user_id', profileData.user_id)
        .eq('visible', true)
        .order('sort_order', { ascending: true })

      if (linksData) {
        setLinks(linksData)
      }

      setLoading(false)
    }

    if (username) {
      loadProfile()
    }
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-green-500 text-black rounded-2xl flex items-center justify-center mb-6">
          <Link2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
        <p className="text-gray-500 text-center mb-6">
          The profile @{username} doesn't exist or has been removed.
        </p>
        <a 
          href="/"
          className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black rounded-full font-semibold transition-colors"
        >
          Create Your Own
        </a>
      </div>
    )
  }

  const displayName = profile?.display_name || `@${username}`

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center px-4 py-12">
      {/* Profile Content */}
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-green-400 to-blue-500 p-1">
              {profile?.profile_image ? (
                <img 
                  src={profile.profile_image} 
                  alt={displayName} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-3xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-green-500 rounded-full border-3 border-[#0a0a0a] flex items-center justify-center text-black">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
          
          <h1 className="font-bold text-2xl text-white leading-tight">
            {displayName}
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">@{username}</p>
          
          {profile?.bio && (
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
              {profile.bio}
            </p>
          )}
          
          {profile?.location && (
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-500 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {profile.location}
            </div>
          )}
        </div>

        {/* Links Stack */}
        <div className="w-full space-y-3">
          {links.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-sm">No links yet</p>
            </div>
          ) : (
            links.map((link, index) => (
              <a 
                key={link.id}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Track link click
                  if (profile?.user_id) {
                    trackLinkClick(link.id, profile.user_id, index + 1)
                  }
                }}
                className={`block w-full ${link.color} hover:scale-[1.02] hover:opacity-95 border border-white/10 rounded-2xl p-1.5 pr-4 flex items-center gap-4 transition-all duration-200 shadow-lg`}
              >
                <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center text-white">
                  {getIcon(link.icon, "w-5 h-5")}
                </div>
                <span className="text-sm font-semibold text-white flex-1 truncate">
                  {link.title}
                </span>
              </a>
            ))
          )}
        </div>

        {/* Get Your Own Button */}
        <div className="mt-12">
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-black rounded-full font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/25"
          >
            <Link2 className="w-4 h-4" />
            Get Your Own BioFolio
          </a>
        </div>

        {/* Bottom Branding */}
        <div className="mt-12 mb-4 flex flex-col items-center gap-4">
          <a 
            href="/"
            className="opacity-80 hover:opacity-100 transition-opacity"
          >
            <img 
              src="/logo-full.png" 
              alt="BioFolio" 
              className="h-40 w-auto"
            />
          </a>
          <p className="text-xs text-gray-600">
            Developed by{' '}
            <a 
              href="https://angeloasante.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              Travis Moore (Angelo Asante)
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
