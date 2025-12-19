'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Switch from '@radix-ui/react-switch'
import ImageCropper from '@/components/ImageCropper'
import DashboardNav from '@/components/DashboardNav'
import { 
  Link2, User, Layout, BarChart2, Plus, DollarSign, GripVertical, 
  ExternalLink, Trash2, Edit2,
  Globe, MapPin, Check, Link as LinkIcon, 
  Copy, Mail, Camera, Sparkles, Loader2,
  ChevronDown, X
} from 'lucide-react'

interface SocialLink {
  id: string
  type: string
  title: string
  url: string
  visible: boolean
  icon: string
  color: string
}

interface UserData {
  email: string
  username: string
}

interface ProfileData {
  displayName: string
  bio: string
  location: string
  profileImage: string | null
}

const SOCIAL_OPTIONS = [
  { type: 'twitter', label: 'Twitter / X', icon: 'twitter', color: 'bg-black', textColor: 'text-white' },
  { type: 'instagram', label: 'Instagram', icon: 'instagram', color: 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500', textColor: 'text-white' },
  { type: 'youtube', label: 'YouTube', icon: 'youtube', color: 'bg-red-600', textColor: 'text-white' },
  { type: 'tiktok', label: 'TikTok', icon: 'tiktok', color: 'bg-black', textColor: 'text-white' },
  { type: 'snapchat', label: 'Snapchat', icon: 'snapchat', color: 'bg-yellow-400', textColor: 'text-white' },
  { type: 'linkedin', label: 'LinkedIn', icon: 'linkedin', color: 'bg-blue-600', textColor: 'text-white' },
  { type: 'github', label: 'GitHub', icon: 'github', color: 'bg-gray-900', textColor: 'text-white' },
  { type: 'twitch', label: 'Twitch', icon: 'twitch', color: 'bg-purple-600', textColor: 'text-white' },
  { type: 'facebook', label: 'Facebook', icon: 'facebook', color: 'bg-blue-500', textColor: 'text-white' },
  { type: 'website', label: 'Website', icon: 'globe', color: 'bg-green-500', textColor: 'text-black' },
  { type: 'email', label: 'Email', icon: 'mail', color: 'bg-gray-600', textColor: 'text-white' },
]

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
    globe: <Globe className={className} />,
    mail: <Mail className={className} />,
  }
  return icons[iconName] || <LinkIcon className={className} />
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [links, setLinks] = useState<SocialLink[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'icons' | 'videos'>('links')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileData>({
    displayName: '',
    bio: '',
    location: '',
    profileImage: null
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load user data and profile from database
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user'
      setUserData({
        email: user.email || '',
        username: username
      })

      // Load profile from database
      const { data: profileData } = await supabase
        .from('linkfolio_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileData) {
        setProfile({
          displayName: profileData.display_name || username,
          bio: profileData.bio || '',
          location: profileData.location || '',
          profileImage: profileData.profile_image || null
        })
        // Update userData with username from DB
        setUserData(prev => prev ? { ...prev, username: profileData.username || username } : null)
      } else {
        // Create profile if doesn't exist
        await supabase.from('linkfolio_profiles').insert({
          user_id: user.id,
          username: username,
          display_name: username
        })
        setProfile(prev => ({ ...prev, displayName: username }))
      }

      // Load links from database
      const { data: linksData } = await supabase
        .from('linkfolio_links')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true })

      if (linksData && linksData.length > 0) {
        setLinks(linksData.map(link => ({
          id: link.id,
          type: link.type,
          title: link.title,
          url: link.url || '',
          visible: link.visible,
          icon: link.icon,
          color: link.color
        })))
      }

      setLoading(false)
    }
    loadUserData()
  }, [router])

  // Save profile to database
  const saveProfile = async () => {
    if (!userData) return
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Update profile
      await supabase
        .from('linkfolio_profiles')
        .update({
          display_name: profile.displayName,
          bio: profile.bio,
          location: profile.location,
          profile_image: profile.profileImage
        })
        .eq('user_id', user.id)

      // Delete existing links and insert new ones
      await supabase
        .from('linkfolio_links')
        .delete()
        .eq('user_id', user.id)

      if (links.length > 0) {
        await supabase
          .from('linkfolio_links')
          .insert(links.map((link, index) => ({
            user_id: user.id,
            type: link.type,
            title: link.title,
            url: link.url,
            icon: link.icon,
            color: link.color,
            visible: link.visible,
            sort_order: index
          })))
      }

      setHasChanges(false)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  // Auto-save when changes are made (debounced)
  useEffect(() => {
    if (!hasChanges || loading) return
    
    const timer = setTimeout(() => {
      saveProfile()
    }, 2000) // Auto-save after 2 seconds of no changes

    return () => clearTimeout(timer)
  }, [hasChanges, profile, links])

  // Track changes
  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  const handleCopyLink = () => {
    if (userData) {
      navigator.clipboard.writeText(`https://biofolio.link/u/${userData.username}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, GIF, or WebP image')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    // Convert to base64 and show cropper
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setTempImage(result)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
    
    // Reset file input so same file can be selected again
    event.target.value = ''
  }

  const handleCroppedImage = async (croppedBlob: Blob) => {
    setShowCropper(false)
    setTempImage(null)
    setUploadingImage(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Create unique filename
      const fileName = `${user.id}-${Date.now()}.jpg`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('profile-images')
        .upload(filePath, croppedBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
          alert('Storage bucket not found. Please create a "profile-images" bucket in Supabase Storage.')
        } else if (uploadError.message.includes('policy') || uploadError.message.includes('authorized')) {
          alert('Permission denied. Please check your Supabase Storage bucket policies.')
        } else {
          alert(`Upload failed: ${uploadError.message}`)
        }
        return
      }

      console.log('Upload successful:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath)

      // Update profile state and mark as changed
      updateProfile({ profileImage: publicUrl })

    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = async () => {
    updateProfile({ profileImage: null })
  }

  const addNewLink = (socialType: typeof SOCIAL_OPTIONS[0]) => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      type: socialType.type,
      title: `Follow me on ${socialType.label}`,
      url: '',
      visible: true,
      icon: socialType.icon,
      color: socialType.color,
    }
    setLinks([...links, newLink])
    setEditingId(newLink.id)
    setHasChanges(true)
  }

  const updateLink = (id: string, field: keyof SocialLink, value: string | boolean) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ))
    setHasChanges(true)
  }

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id))
    if (editingId === id) setEditingId(null)
    setHasChanges(true)
  }

  const toggleVisibility = (id: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, visible: !link.visible } : link
    ))
    setHasChanges(true)
  }

  const openUrl = (url: string) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank')
    }
  }

  const visibleLinks = links.filter(link => link.visible)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Top Navigation */}
      <DashboardNav 
        activeTab="profile" 
        userData={userData}
        onUsernameChange={async () => {
          // Reload user data when username changes
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: profileData } = await supabase
              .from('linkfolio_profiles')
              .select('username')
              .eq('user_id', user.id)
              .single()
            if (profileData) {
              setUserData(prev => prev ? { ...prev, username: profileData.username } : null)
            }
          }
        }}
      />

      {/* Main Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Editor */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Secondary Tabs */}
            <div className="flex items-center border-b border-white/10">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-white border-b-2 border-green-500 font-semibold' : 'text-gray-500 hover:text-white'}`}
              >
                Profile
              </button>
              <button 
                onClick={() => setActiveTab('links')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'links' ? 'text-white border-b-2 border-green-500 font-semibold' : 'text-gray-500 hover:text-white'}`}
              >
                My links
              </button>
              <button 
                onClick={() => setActiveTab('icons')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'icons' ? 'text-white border-b-2 border-green-500 font-semibold' : 'text-gray-500 hover:text-white'}`}
              >
                Icons
              </button>
              <button 
                onClick={() => setActiveTab('videos')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'videos' ? 'text-white border-b-2 border-green-500 font-semibold' : 'text-gray-500 hover:text-white'}`}
              >
                Featured Videos
              </button>
            </div>

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white">Edit Profile</h1>
                  <button className="flex items-center gap-2 px-5 py-2 bg-green-500 hover:bg-green-400 text-black rounded-full text-sm font-semibold shadow-lg shadow-green-500/20 transition-all">
                    <Sparkles className="w-4 h-4" />
                    Upgrade to Pro
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Profile Picture Section */}
                  <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Profile Picture</h3>
                    <div className="flex items-center gap-6">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 p-1">
                          {profile.profileImage ? (
                            <img 
                              src={profile.profileImage} 
                              alt="Profile" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-3xl font-bold">
                              {profile.displayName?.charAt(0).toUpperCase() || userData?.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                        >
                          {uploadingImage ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          ) : (
                            <Camera className="w-6 h-6 text-white" />
                          )}
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-3">
                          Upload a profile picture to personalize your page. JPG, PNG, GIF or WebP. Max 5MB.
                        </p>
                        <div className="flex gap-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {uploadingImage && <Loader2 className="w-4 h-4 animate-spin" />}
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                          </button>
                          {profile.profileImage && (
                            <button 
                              onClick={handleRemoveImage}
                              className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Display Name */}
                  <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Display Name</h3>
                    <input 
                      type="text"
                      value={profile.displayName}
                      onChange={(e) => updateProfile({ displayName: e.target.value })}
                      placeholder="Your display name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-2">This is the name that will be displayed on your profile page.</p>
                  </div>

                  {/* Bio */}
                  <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Bio</h3>
                      <span className="text-xs text-gray-500">{profile.bio.length}/150</span>
                    </div>
                    <textarea 
                      value={profile.bio}
                      onChange={(e) => updateProfile({ bio: e.target.value.slice(0, 150) })}
                      placeholder="Tell the world about yourself..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-gray-600 resize-none"
                    />
                  </div>

                  {/* Location */}
                  <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Location</h3>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text"
                        value={profile.location}
                        onChange={(e) => updateProfile({ location: e.target.value })}
                        placeholder="City, Country"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Username / URL */}
                  <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Your Link</h3>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      <span className="text-gray-500 font-medium">biofolio.link/u/</span>
                      <input 
                        type="text"
                        value={userData?.username || ''}
                        readOnly
                        className="flex-1 bg-transparent text-white font-semibold focus:outline-none"
                      />
                      <button 
                        onClick={handleCopyLink}
                        className="text-gray-500 hover:text-green-500 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-green-500" />
                      Upgrade to Pro to customize your username
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Links Tab Content */}
            {activeTab === 'links' && (
              <>
                {/* Page Header & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white">My Links</h1>
                  <div className="flex items-center gap-3">
                    {/* Quick Add Dropdown */}
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                          <Plus className="w-4 h-4" />
                          Quick Add
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content 
                          className="min-w-[220px] bg-[#111] border border-white/10 rounded-xl p-2 shadow-xl shadow-black/50 z-50"
                          sideOffset={5}
                        >
                          {SOCIAL_OPTIONS.map((social) => (
                            <DropdownMenu.Item
                              key={social.type}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/10 outline-none transition-colors"
                              onSelect={() => addNewLink(social)}
                            >
                              <div className={`w-8 h-8 ${social.color} rounded-lg flex items-center justify-center ${social.textColor}`}>
                                {getIcon(social.icon, "w-4 h-4")}
                              </div>
                              <span className="text-sm font-medium text-white">{social.label}</span>
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>

                    <button className="flex items-center gap-2 px-5 py-2 bg-green-500 hover:bg-green-400 text-black rounded-full text-sm font-semibold shadow-lg shadow-green-500/20 transition-all">
                      <DollarSign className="w-4 h-4" />
                      Monetize
                    </button>
                  </div>
                </div>

                {/* Links Editor List */}
                <div className="space-y-4">
                  {links.length === 0 ? (
                    <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 border-dashed p-12 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No links yet</h3>
                      <p className="text-gray-500 text-sm mb-6">Click "Quick Add" to add your first social link</p>
                    </div>
                  ) : (
                    links.map((link) => (
                      <div key={link.id} className="bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden">
                        {editingId === link.id ? (
                          // Expanded Edit View
                          <div className="p-6">
                            <div className="flex gap-4">
                              <div className="pt-2 cursor-move text-gray-600 hover:text-gray-400">
                                <GripVertical className="w-5 h-5" />
                              </div>
                              
                              <div className="flex-1 space-y-5">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${link.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                      {getIcon(link.icon)}
                                    </div>
                                    <span className="font-semibold text-white capitalize">{link.type}</span>
                                  </div>
                                  <button 
                                    onClick={() => setEditingId(null)}
                                    className="text-gray-500 hover:text-white transition-colors"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>

                                {/* Inputs */}
                                <div className="space-y-4">
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
                                    <input 
                                      type="text" 
                                      value={link.title}
                                      onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                                      placeholder="Enter a title..."
                                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-gray-600"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">URL</label>
                                    <div className="relative">
                                      <input 
                                        type="text" 
                                        value={link.url}
                                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-400 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-gray-600"
                                      />
                                      <button 
                                        onClick={() => openUrl(link.url)}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-green-500 transition-colors"
                                        title="Open link in new tab"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex items-center justify-between pt-2">
                                  <div className="flex items-center gap-3">
                                    <Switch.Root
                                      checked={link.visible}
                                      onCheckedChange={() => toggleVisibility(link.id)}
                                      className="w-10 h-5 bg-gray-700 rounded-full relative data-[state=checked]:bg-green-500 transition-colors"
                                    >
                                      <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                                    </Switch.Root>
                                    <span className="text-sm font-medium text-gray-400">
                                      {link.visible ? 'Visible' : 'Hidden'}
                                    </span>
                                  </div>
                                  <button 
                                    onClick={() => deleteLink(link.id)}
                                    className="flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Collapsed View
                          <div 
                            className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => setEditingId(link.id)}
                          >
                            <div className="cursor-move text-gray-600 hover:text-gray-400">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className={`font-semibold ${link.visible ? 'text-white' : 'text-gray-500'}`}>
                                    {link.title || `Untitled ${link.type}`}
                                  </span>
                                  <Edit2 className="w-3 h-3 text-gray-500" />
                                  {!link.visible && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-700 text-gray-400 tracking-wide">
                                      Hidden
                                    </span>
                                  )}
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <Switch.Root
                                    checked={link.visible}
                                    onCheckedChange={() => toggleVisibility(link.id)}
                                    className="w-10 h-5 bg-gray-700 rounded-full relative data-[state=checked]:bg-green-500 transition-colors"
                                  >
                                    <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                                  </Switch.Root>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5">
                                <div className={`w-8 h-8 ${link.color} rounded-lg flex items-center justify-center text-white shrink-0`}>
                                  {getIcon(link.icon, "w-4 h-4")}
                                </div>
                                <span className="text-xs text-gray-500 truncate flex-1">
                                  {link.url || 'No URL set'}
                                </span>
                                {link.url && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openUrl(link.url)
                                    }}
                                    className="text-gray-500 hover:text-green-500 transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Icons Tab Content */}
            {activeTab === 'icons' && (
              <div className="mt-2">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-6">Social Icons</h1>
                <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 border-dashed p-12 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
                  <p className="text-gray-500 text-sm">Customize your social icons style and appearance</p>
                </div>
              </div>
            )}

            {/* Featured Videos Tab Content */}
            {activeTab === 'videos' && (
              <div className="mt-2">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-6">Featured Videos</h1>
                <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 border-dashed p-12 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
                  <p className="text-gray-500 text-sm">Showcase your best video content</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 flex flex-col items-center">
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-white">Preview</h2>
                <p className="text-gray-500 text-sm">Live preview of your profile</p>
              </div>

              {/* Phone Mockup */}
              <div className="relative w-[300px] h-[600px] bg-[#0a0a0a] border-[10px] border-[#222] rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-white/10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-[#222] rounded-b-2xl z-20"></div>
                
                {/* Screen Content */}
                <div className="h-full w-full bg-[#0a0a0a] overflow-y-auto pt-10 pb-8 px-5 flex flex-col items-center">
                  
                  {/* Profile Header */}
                  <div className="text-center mb-6">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-green-400 to-blue-500 p-1">
                        {profile.profileImage ? (
                          <img 
                            src={profile.profileImage} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-2xl font-bold">
                            {profile.displayName?.charAt(0).toUpperCase() || userData?.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center text-black">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-white leading-tight">
                      {profile.displayName || `@${userData?.username}`}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">0 Followers</p>
                    
                    {profile.bio ? (
                      <p className="mt-4 text-xs text-gray-400 leading-relaxed max-w-[200px] mx-auto">
                        {profile.bio}
                      </p>
                    ) : (
                      <p className="mt-4 text-xs text-gray-500 leading-relaxed max-w-[200px] mx-auto italic">
                        Add a bio to tell people about yourself
                      </p>
                    )}
                    
                    <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-gray-500 font-medium">
                      <MapPin className="w-3 h-3" />
                      {profile.location || 'Add location'}
                    </div>
                  </div>

                  {/* Links Stack - Only visible links */}
                  <div className="w-full space-y-3">
                    {visibleLinks.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-xs text-gray-600">Your links will appear here</p>
                      </div>
                    ) : (
                      visibleLinks.map((link) => (
                        <a 
                          key={link.id}
                          href={link.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block w-full ${link.color} hover:opacity-90 border border-white/10 rounded-xl p-1 pr-3 flex items-center gap-3 transition-all group`}
                        >
                          <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center text-white">
                            {getIcon(link.icon)}
                          </div>
                          <span className="text-xs font-semibold text-white flex-1 truncate">
                            {link.title || `Untitled ${link.type}`}
                          </span>
                        </a>
                      ))
                    )}
                  </div>

                  {/* Bottom Branding */}
                  <div className="mt-auto pt-8 pb-2">
                    <div className="flex items-center gap-1.5 opacity-50">
                      <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center text-black">
                        <Link2 className="w-2 h-2" />
                      </div>
                      <span className="text-[10px] font-bold tracking-tight text-white">BioFolio</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Footer */}
              <div className="w-full max-w-sm mt-8 flex gap-3">
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    readOnly 
                    value={`biofolio.link/u/${userData?.username}`}
                    className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl text-sm bg-white/5 text-gray-400 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                  />
                  <button 
                    onClick={handleCopyLink}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  onClick={saveProfile}
                  disabled={saving || !hasChanges}
                  className={`px-8 py-3 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed ${
                    saving 
                      ? 'bg-gray-600 text-gray-300' 
                      : hasChanges 
                        ? 'bg-green-500 hover:bg-green-400 text-black shadow-green-500/20' 
                        : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {saving ? 'Saving...' : copied ? 'Copied!' : hasChanges ? 'Save' : 'Saved ✓'}
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Image Cropper Modal */}
      {showCropper && tempImage && (
        <ImageCropper
          imageSrc={tempImage}
          onSave={handleCroppedImage}
          onCancel={() => {
            setShowCropper(false)
            setTempImage(null)
          }}
        />
      )}
    </div>
  )
}
