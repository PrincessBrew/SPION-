import React from 'react'
import { motion } from 'framer-motion'
import { BatteryMedium, Crosshair, MapPin, Navigation, Smartphone, Wifi } from 'lucide-react'
import { useSpion } from '../context/SpionContext.jsx'
import Panel from '../components/Panel.jsx'
import StatusPill from '../components/StatusPill.jsx'

export default function Map() {
  const { deviceLocation, locationHistory, locating, locateDevice, locationEnabled, user } = useSpion()

  return (
    <div style={{ padding: '18px 32px 24px', maxWidth: 1360, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 21, fontWeight: 700 }}>Map</h1>
          <p style={{ color: 'var(--ink-mid)', fontSize: 13, marginTop: 3 }}>
            {user.deviceName} · this view will also be available on the SPION mobile app.
          </p>
        </div>
        <motion.button
          onClick={locateDevice}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          disabled={!locationEnabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: locationEnabled ? 'var(--signal)' : 'var(--bg-inset)',
            color: locationEnabled ? 'var(--ink-on-signal)' : 'var(--ink-low)',
            border: locationEnabled ? 'none' : '1px solid var(--hairline-strong)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 700,
            cursor: locationEnabled ? 'pointer' : 'not-allowed'
          }}
        >
          <Crosshair size={15} className={locating ? 'spin' : ''} />
          {locating ? 'Locating…' : 'Locate Now'}
        </motion.button>
      </div>

      {!locationEnabled && (
        <Panel style={{ padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <StatusPill tone="warn">Location Tracking Off</StatusPill>
          <span style={{ fontSize: 12.5, color: 'var(--ink-mid)' }}>Turn it on in Settings → Protection to see live location.</span>
        </Panel>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Stylized map */}
        <Panel style={{ padding: 0, position: 'relative', overflow: 'hidden', height: 560 }}>
          <TacticalMap locating={locating} muted={!locationEnabled} />

          <div
            style={{
              position: 'absolute',
              left: 16,
              bottom: 16,
              background: 'rgba(6,10,8,0.75)',
              backdropFilter: 'blur(6px)',
              border: '1px solid var(--hairline-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px'
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700 }}>{deviceLocation.address}</div>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-low)', marginTop: 3 }}>
              {deviceLocation.lat.toFixed(4)}° N, {Math.abs(deviceLocation.lng).toFixed(4)}° W · last seen {deviceLocation.lastSeen}
            </div>
          </div>
        </Panel>

        {/* Side info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel style={{ padding: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Device Status</div>
            <StatRow icon={Wifi} label="Connection" value={deviceLocation.online ? 'Online' : 'Offline'} tone={deviceLocation.online ? 'signal' : 'neutral'} />
            <StatRow icon={BatteryMedium} label="Battery" value={`${deviceLocation.battery}%`} tone="neutral" />
            <StatRow icon={Smartphone} label="Paired Mobile App" value="Not linked yet" tone="neutral" last />
          </Panel>

          <Panel style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Location History</div>
            <div className="scroll-region" style={{ overflowY: 'auto' }}>
              {locationHistory.map((entry, i) => (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: '10px 0',
                    borderBottom: i === locationHistory.length - 1 ? 'none' : '1px solid var(--hairline)'
                  }}
                >
                  <div style={{ marginTop: 2 }}>
                    <MapPin size={14} color={entry.current ? 'var(--signal)' : 'var(--ink-low)'} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.address}
                    </div>
                    <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-low)', marginTop: 2 }}>
                      {entry.time} · ±{entry.accuracy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-low)', marginTop: 14, textAlign: 'center' }}>
        Showing simulated location data. Live GPS/IP-based tracking connects once the SPION agent and mobile app are wired in.
      </div>
    </div>
  )
}

function TacticalMap({ locating, muted }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 50% 45%, var(--bg-panel-raised) 0%, var(--bg-inset) 55%, var(--bg-void) 100%)',
        opacity: muted ? 0.5 : 1
      }}
    >
      <div className="hex-field" style={{ opacity: 0.7 }} />

      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="var(--hairline)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 24,
              height: 24,
              marginLeft: -12,
              marginTop: -12,
              borderRadius: '50%',
              border: '1px solid var(--signal)'
            }}
            animate={{ scale: [1, 5.5], opacity: [0.5, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
          />
        ))}
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'var(--signal)',
            boxShadow: '0 0 0 4px var(--signal-wash), 0 0 20px var(--signal-glow)',
            position: 'relative',
            zIndex: 1
          }}
        />
      </div>

      {locating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--signal-wash)',
            border: '1px solid rgba(51,226,143,0.3)',
            color: 'var(--signal)',
            fontSize: 11.5,
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: 999
          }}
        >
          <Navigation size={12} />
          Refreshing location…
        </motion.div>
      )}
    </div>
  )
}

function StatRow({ icon: Icon, label, value, tone, last }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '9px 0',
        borderBottom: last ? 'none' : '1px solid var(--hairline)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--ink-mid)' }}>
        <Icon size={14} />
        {label}
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600 }}>
        {value}
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: tone === 'signal' ? 'var(--signal)' : 'var(--ink-low)',
            boxShadow: tone === 'signal' ? '0 0 6px var(--signal)' : 'none'
          }}
        />
      </span>
    </div>
  )
}