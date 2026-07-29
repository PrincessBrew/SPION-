import React from 'react'
import { motion } from 'framer-motion'
import { Camera, HardDrive, Keyboard, Mouse, Plus, ShieldCheck, ShieldX } from 'lucide-react'
import { useSpion } from '../context/SpionContext.jsx'
import Panel from '../components/Panel.jsx'
import StatusPill from '../components/StatusPill.jsx'

const TYPE_ICON = {
  mouse: Mouse,
  keyboard: Keyboard,
  camera: Camera,
  storage: HardDrive
}

export default function Peripherals() {
  const { peripherals } = useSpion()
  const authorizedCount = peripherals.filter((p) => p.status === 'authorized').length

  return (
    <div style={{ padding: '28px 40px 56px', maxWidth: 1360, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>Peripherals</h1>
          <p style={{ color: 'var(--ink-mid)', fontSize: 14.5, marginTop: 6 }}>
            Devices connected to this laptop. Unregistered devices are rejected automatically.
          </p>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--signal)',
            color: 'var(--ink-on-signal)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 700
          }}
        >
          <Plus size={15} />
          Register Device
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        <SummaryTile label="Registered Devices" value={peripherals.length} />
        <SummaryTile label="Authorized" value={authorizedCount} tone="signal" />
        <SummaryTile label="Blocked Attempts" value={0} />
      </div>

      <Panel style={{ padding: 0, overflow: 'hidden' }}>
        <div
          className="mono"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 140px 140px 120px',
            padding: '14px 20px',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--ink-low)',
            borderBottom: '1px solid var(--hairline)'
          }}
        >
          <span>Device</span>
          <span>Type</span>
          <span>Status</span>
          <span>Connection</span>
        </div>

        {peripherals.map((device, i) => {
          const Icon = TYPE_ICON[device.type] || HardDrive
          return (
            <motion.div
              key={device.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 140px 140px 120px',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: i === peripherals.length - 1 ? 'none' : '1px solid var(--hairline)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-inset)',
                    border: '1px solid var(--hairline)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--ink-mid)',
                    flexShrink: 0
                  }}
                >
                  <Icon size={15} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{device.name}</span>
              </div>
              <span style={{ fontSize: 12.5, color: 'var(--ink-mid)', textTransform: 'capitalize' }}>{device.type}</span>
              <StatusPill tone={device.status === 'authorized' ? 'signal' : 'danger'} dot>
                {device.status === 'authorized' ? (
                  <>
                    <ShieldCheck size={11} style={{ marginRight: -2 }} /> Authorized
                  </>
                ) : (
                  <>
                    <ShieldX size={11} style={{ marginRight: -2 }} /> Blocked
                  </>
                )}
              </StatusPill>
              <span style={{ fontSize: 12.5, color: device.connected ? 'var(--ink-high)' : 'var(--ink-low)' }}>
                {device.connected ? 'Connected' : 'Disconnected'}
              </span>
            </motion.div>
          )
        })}
      </Panel>
    </div>
  )
}

function SummaryTile({ label, value, tone }) {
  return (
    <Panel style={{ padding: '18px 20px' }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-low)', marginBottom: 10 }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 700,
          color: tone === 'signal' ? 'var(--signal)' : 'var(--ink-high)'
        }}
      >
        {value}
      </div>
    </Panel>
  )
}
