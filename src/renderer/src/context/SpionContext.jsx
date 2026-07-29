import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const SpionContext = createContext(null)

const initialTimeline = [
  {
    id: 't1',
    time: '09:15 AM',
    date: 'Today',
    title: 'Monitoring started',
    detail: 'SPION protection is now active',
    tag: 'System'
  },
  {
    id: 't2',
    time: '09:15 AM',
    date: 'Today',
    title: 'Password system armed',
    detail: 'Intruder detection enabled',
    tag: 'Security'
  },
  {
    id: 't3',
    time: '09:16 AM',
    date: 'Today',
    title: 'System secure',
    detail: 'No threats detected',
    tag: 'System'
  },
  {
    id: 't4',
    time: '09:16 AM',
    date: 'Today',
    title: 'Ready to capture',
    detail: 'Photos will be taken on failed attempts',
    tag: 'Camera'
  }
]

const initialPeripherals = [
  { id: 'p1', name: 'Logitech MX Master 3S', type: 'mouse', status: 'authorized', connected: true },
  { id: 'p2', name: 'Keychron K8', type: 'keyboard', status: 'authorized', connected: true },
  { id: 'p3', name: 'Built-in FaceTime HD Camera', type: 'camera', status: 'authorized', connected: true },
  { id: 'p4', name: 'SanDisk Extreme 1TB', type: 'storage', status: 'authorized', connected: false }
]

const initialVaultItems = [
  { id: 'v1', name: 'Tax Documents 2026', type: 'folder', items: 12, updated: '2 days ago' },
  { id: 'v2', name: 'Passport Scans', type: 'folder', items: 3, updated: '1 week ago' },
  { id: 'v3', name: 'client_contract_final.pdf', type: 'file', size: '2.4 MB', updated: '3 hours ago' },
  { id: 'v4', name: 'Recovery Codes', type: 'folder', items: 1, updated: '1 month ago' }
]

const initialLocationHistory = [
  { id: 'l1', address: 'Adum, Kumasi, Ashanti Region', time: 'Today, 09:16 AM', accuracy: '12m', current: true },
  { id: 'l2', address: 'KNUST Campus, Kumasi', time: 'Yesterday, 06:40 PM', accuracy: '18m' },
  { id: 'l3', address: 'Adum, Kumasi, Ashanti Region', time: 'Yesterday, 08:05 AM', accuracy: '9m' }
]

// Demo account so Sign In works immediately without signing up first.
// Replace/remove once the real backend + credential storage exists.
const DEMO_ACCOUNT = {
  username: 'princessbrew',
  password: 'Spion@2026',
  fullName: 'Princess Brew',
  email: 'princessbrew@icloud.com',
  phone: '+233 24 000 0000',
  country: 'Ghana',
  region: 'Ashanti Region',
  deviceName: "Princess's MacBook Air",
  plan: 'SPION Personal',
  memberSince: 'July 2026'
}

export function SpionProvider({ children }) {
  const [protectionActive, setProtectionActive] = useState(true)
  const [cameraReady] = useState(true)
  const [intruderPhotos] = useState([])
  const [timeline] = useState(initialTimeline)
  const [peripherals] = useState(initialPeripherals)

  const [vaultLocked, setVaultLocked] = useState(true)
  const [vaultItems] = useState(initialVaultItems)

  const [deviceLocked, setDeviceLocked] = useState(false)

  // --- Auth ---
  const [account, setAccount] = useState(DEMO_ACCOUNT)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const user = useMemo(
    () => ({
      name: account.fullName?.split(' ')[0] || account.username,
      fullName: account.fullName,
      email: account.email,
      phone: account.phone || 'Not provided',
      country: account.country,
      region: account.region,
      deviceName: account.deviceName || 'This laptop',
      plan: account.plan || 'SPION Personal',
      memberSince: account.memberSince || 'Just now'
    }),
    [account]
  )
  const userName = user.name

  const signIn = useCallback(
    (username, password) => {
      if (account.username.toLowerCase() === username.toLowerCase() && account.password === password) {
        setIsAuthenticated(true)
        return true
      }
      return false
    },
    [account]
  )

  const signUp = useCallback((fields) => {
    setAccount((prev) => ({
      ...prev,
      ...fields,
      password: fields.password || prev.password,
      deviceName: prev.deviceName,
      plan: prev.plan,
      memberSince: 'July 2026'
    }))
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    setLoggingOut(true)
    setTimeout(() => {
      setLoggingOut(false)
      setIsAuthenticated(false)
    }, 700)
  }, [])

  // --- Settings ---
  const [theme, setTheme] = useState('dark')
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [terminalLockEnabled, setTerminalLockEnabled] = useState(true)
  const [captureEnabled, setCaptureEnabled] = useState(true)

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  // --- Overlay panels ---
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const openSettings = useCallback(() => setSettingsOpen(true), [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])
  const openProfile = useCallback(() => setProfileOpen(true), [])
  const closeProfile = useCallback(() => setProfileOpen(false), [])

  // --- Location / Map ---
  const [deviceLocation] = useState({
    address: 'Adum, Kumasi, Ashanti Region',
    lat: 6.6885,
    lng: -1.6244,
    lastSeen: 'Today, 09:16 AM',
    battery: 82,
    online: true
  })
  const [locationHistory] = useState(initialLocationHistory)
  const [locating, setLocating] = useState(false)

  const locateDevice = useCallback(() => {
    setLocating(true)
    setTimeout(() => setLocating(false), 1400)
  }, [])

  const lockDevice = useCallback(async () => {
    setDeviceLocked(true)
    if (window.spion?.lockDevice) {
      try {
        await window.spion.lockDevice()
      } catch (e) {
        // no-op: main-process bridge not required for the frontend milestone
      }
    }
    setTimeout(() => setDeviceLocked(false), 1600)
  }, [])

  const unlockVault = useCallback((passcode) => {
    if (passcode && passcode.length >= 4) {
      setVaultLocked(false)
      return true
    }
    return false
  }, [])

  const lockVault = useCallback(() => setVaultLocked(true), [])

  const intrudersDetected = intruderPhotos.length

  const value = useMemo(
    () => ({
      userName,
      user,
      isAuthenticated,
      signIn,
      signUp,
      logout,
      loggingOut,
      protectionActive,
      setProtectionActive,
      cameraReady,
      intruderPhotos,
      intrudersDetected,
      timeline,
      peripherals,
      vaultLocked,
      vaultItems,
      unlockVault,
      lockVault,
      deviceLocked,
      lockDevice,
      theme,
      toggleTheme,
      locationEnabled,
      setLocationEnabled,
      terminalLockEnabled,
      setTerminalLockEnabled,
      captureEnabled,
      setCaptureEnabled,
      settingsOpen,
      openSettings,
      closeSettings,
      profileOpen,
      openProfile,
      closeProfile,
      deviceLocation,
      locationHistory,
      locating,
      locateDevice
    }),
    [
      userName,
      user,
      isAuthenticated,
      signIn,
      signUp,
      logout,
      loggingOut,
      protectionActive,
      cameraReady,
      intruderPhotos,
      intrudersDetected,
      timeline,
      peripherals,
      vaultLocked,
      vaultItems,
      unlockVault,
      lockVault,
      deviceLocked,
      lockDevice,
      theme,
      toggleTheme,
      locationEnabled,
      terminalLockEnabled,
      captureEnabled,
      settingsOpen,
      openSettings,
      closeSettings,
      profileOpen,
      openProfile,
      closeProfile,
      deviceLocation,
      locationHistory,
      locating,
      locateDevice
    ]
  )

  return <SpionContext.Provider value={value}>{children}</SpionContext.Provider>
}

export function useSpion() {
  const ctx = useContext(SpionContext)
  if (!ctx) throw new Error('useSpion must be used within a SpionProvider')
  return ctx
}