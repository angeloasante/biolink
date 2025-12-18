'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Link2, User, Layout, BarChart2, LogOut, Key, AtSign, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Image from 'next/image'

interface DashboardNavProps {
  activeTab?: 'profile' | 'design' | 'analytics'
  userData?: { email: string; username: string } | null
  onUsernameChange?: () => void
}

export default function DashboardNav({ activeTab, userData: externalUserData, onUsernameChange }: DashboardNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState<{ email: string; username: string } | null>(externalUserData || null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Determine active tab from pathname if not provided
  const currentTab = activeTab || (
    pathname === '/design' ? 'design' :
    pathname === '/analytics' ? 'analytics' :
    'profile'
  )

  useEffect(() => {
    if (externalUserData) {
      setUserData(externalUserData)
      setNewUsername(externalUserData.username || '')
      return
    }
    
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Get username from profile
        const { data: profile } = await supabase
          .from('linkfolio_profiles')
          .select('username')
          .eq('user_id', user.id)
          .single()
        
        const username = profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'user'
        setUserData({
          email: user.email || '',
          username: username
        })
        setNewUsername(username)
      }
    }
    loadUser()
  }, [externalUserData])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handlePasswordChange = async () => {
    setError('')
    setSuccess('')
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      
      setSuccess('Password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowPasswordModal(false)
        setSuccess('')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameChange = async () => {
    setError('')
    setSuccess('')
    
    if (!newUsername.trim()) {
      setError('Username cannot be empty')
      return
    }
    
    if (newUsername.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setError('Username can only contain letters, numbers, and underscores')
      return
    }
    
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      // Check if username is taken
      const { data: existing } = await supabase
        .from('linkfolio_profiles')
        .select('id')
        .ilike('username', newUsername)
        .neq('user_id', user.id)
        .single()
      
      if (existing) {
        setError('Username is already taken')
        setLoading(false)
        return
      }
      
      // Update username in profile
      const { error } = await supabase
        .from('linkfolio_profiles')
        .update({ username: newUsername.toLowerCase() })
        .eq('user_id', user.id)
      
      if (error) throw error
      
      setUserData(prev => prev ? { ...prev, username: newUsername.toLowerCase() } : null)
      setSuccess('Username updated successfully!')
      
      if (onUsernameChange) {
        onUsernameChange()
      }
      
      setTimeout(() => {
        setShowUsernameModal(false)
        setSuccess('')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to update username')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="BioFolio" 
                width={36} 
                height={36} 
                className="w-9 h-9"
              />
              <span className="font-bold text-xl tracking-tight text-white">BioFolio</span>
            </a>
            <div className="hidden md:flex items-center text-sm text-gray-500 pl-6 border-l border-white/10 h-8">
              <span className="hover:text-white cursor-pointer transition-colors">/ {userData?.email}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            <a 
              href="/dashboard" 
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-full ${
                currentTab === 'profile' 
                  ? 'bg-white/10 text-white font-semibold border border-white/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              My Profile
            </a>
            <a 
              href="/design" 
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-full ${
                currentTab === 'design' 
                  ? 'bg-white/10 text-white font-semibold border border-white/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layout className="w-4 h-4" />
              Design
            </a>
            <a 
              href="/analytics" 
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-full ${
                currentTab === 'analytics' 
                  ? 'bg-white/10 text-white font-semibold border border-white/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Analytics
            </a>
          </div>

          <div className="flex items-center">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="relative group flex items-center gap-2 outline-none">
                  <div className="absolute inset-0 bg-green-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" style={{ width: '36px', height: '36px' }} />
                  <div className="w-9 h-9 rounded-full border-2 border-green-500 relative z-10 bg-green-500/20 flex items-center justify-center text-green-500 font-semibold">
                    {userData?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content 
                  className="min-w-[200px] bg-[#111] border border-white/10 rounded-xl p-2 shadow-xl shadow-black/50 z-[100]"
                  sideOffset={8}
                  align="end"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-2">
                    <p className="text-sm font-medium text-white">{userData?.username}</p>
                    <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                  </div>

                  <DropdownMenu.Item
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/10 outline-none transition-colors text-gray-300 hover:text-white"
                    onSelect={() => setShowUsernameModal(true)}
                  >
                    <AtSign className="w-4 h-4" />
                    <span className="text-sm">Change Username</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/10 outline-none transition-colors text-gray-300 hover:text-white"
                    onSelect={() => setShowPasswordModal(true)}
                  >
                    <Key className="w-4 h-4" />
                    <span className="text-sm">Change Password</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-white/10 my-2" />

                  <DropdownMenu.Item
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-500/10 outline-none transition-colors text-red-400 hover:text-red-300"
                    onSelect={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </nav>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                {success}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setError('')
                  setNewPassword('')
                  setConfirmPassword('')
                }}
                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-400 rounded-xl text-black font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Change Username</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                {success}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">New Username</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-green-500 transition-colors">
                <span className="px-4 text-gray-500">biofolio.link/u/</span>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="flex-1 bg-transparent py-3 pr-4 text-white focus:outline-none"
                  placeholder="username"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Only letters, numbers, and underscores allowed</p>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUsernameModal(false)
                  setError('')
                  setNewUsername(userData?.username || '')
                }}
                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUsernameChange}
                disabled={loading || newUsername === userData?.username}
                className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-400 rounded-xl text-black font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Username'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
