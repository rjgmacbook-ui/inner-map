import { useState, useRef } from 'react'

/**
 * Searchable multi-select (or single-select) with checkboxes.
 *
 * Props:
 *   items        – array of { id, name, description?, category? }
 *   selectedIds  – array of selected ids
 *   onChange     – (newIds) => void
 *   onCreateItem – async (name) => item  (if provided, shows "+ add …" option)
 *   placeholder  – string
 *   accentColor  – CSS color string for checkboxes + border
 *   single       – boolean, if true behaves as single-select (radio style)
 *   renderMeta   – optional (item) => ReactNode shown after item name in list
 *   showPills    – boolean (default true), set false to suppress selected pills
 *   showDesc     – boolean (default false), set true to show description under item name in dropdown
 */
export default function SearchableMultiSelect({
  items = [],
  selectedIds = [],
  onChange,
  onCreateItem,
  placeholder = 'search…',
  accentColor = 'var(--accent-amber)',
  single = false,
  renderMeta,
  showPills = true,
  showDesc = false,
}) {
  const [search, setSearch]     = useState('')
  const [creating, setCreating] = useState(false)
  const [open, setOpen]         = useState(false)
  const inputRef = useRef(null)

  const q = search.trim().toLowerCase()
  const filtered = q
    ? items.filter(i => i.name.toLowerCase().includes(q))
    : items

  const exactMatch = items.some(i => i.name.toLowerCase() === q)
  const showCreate = onCreateItem && q.length > 0 && !exactMatch

  function toggle(id) {
    if (single) {
      onChange(selectedIds.includes(id) ? [] : [id])
    } else {
      onChange(
        selectedIds.includes(id)
          ? selectedIds.filter(s => s !== id)
          : [...selectedIds, id]
      )
    }
  }

  async function handleCreate() {
    if (!search.trim() || creating) return
    setCreating(true)
    try {
      const newItem = await onCreateItem(search.trim())
      onChange(single ? [newItem.id] : [...selectedIds, newItem.id])
      setSearch('')
    } catch (e) {
      console.error(e)
    } finally {
      setCreating(false)
    }
  }

  const selectedCount = selectedIds.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Search input + absolutely-positioned dropdown */}
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'var(--bg-surface)',
          border: `1.5px solid ${open ? accentColor : 'var(--border-subtle)'}`,
          borderRadius: '12px',
          padding: '0 14px',
          transition: 'border-color 0.15s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 160)}
            placeholder={selectedCount > 0 ? `${selectedCount} selected · search to add more…` : placeholder}
            style={{
              flex: 1, background: 'none', border: 'none',
              outline: '0', WebkitAppearance: 'none',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px', color: 'var(--text-primary)',
              padding: '12px 0',
            }}
          />
          {search && (
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => { setSearch(''); inputRef.current?.focus() }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)', fontSize: '16px', padding: 0, lineHeight: 1 }}
            >×</button>
          )}
        </div>

        {/* Dropdown — absolutely positioned so it overlays content, no layout shift */}
        {open && (filtered.length > 0 || showCreate) && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0, right: 0,
            zIndex: 50,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(44,36,32,0.12)',
            animation: 'fadeIn 0.15s ease-out both',
            maxHeight: '240px',
            overflowY: 'auto',
          }}>
            {filtered.map((item, idx) => {
              const isOn = selectedIds.includes(item.id)
              return (
                <button
                  key={item.id}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => toggle(item.id)}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: isOn ? `${accentColor}10` : 'none',
                    border: 'none',
                    borderBottom: idx < filtered.length - 1 || showCreate ? '1px solid var(--border-subtle)' : 'none',
                    padding: '11px 16px',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (!isOn) e.currentTarget.style.background = 'var(--bg-base)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = isOn ? `${accentColor}10` : 'none' }}
                >
                  {/* Checkbox / radio indicator */}
                  <span style={{
                    width: '18px', height: '18px', borderRadius: single ? '50%' : '5px',
                    border: `2px solid ${isOn ? accentColor : 'var(--border-subtle)'}`,
                    background: isOn ? accentColor : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.15s',
                  }}>
                    {isOn && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>

                  {/* Label */}
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '14px', fontWeight: isOn ? '500' : '400',
                      color: 'var(--text-primary)',
                    }}>
                      {item.name}
                    </span>
                    {showDesc && item.description && (
                      <span style={{
                        display: 'block',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '12px', color: 'var(--text-soft)',
                        marginTop: '1px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {item.description}
                      </span>
                    )}
                  </span>

                  {renderMeta && renderMeta(item)}
                </button>
              )
            })}

            {showCreate && (
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={handleCreate}
                disabled={creating}
                style={{
                  width: '100%', textAlign: 'left',
                  background: 'none', border: 'none',
                  padding: '11px 16px',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '14px', color: accentColor,
                  cursor: creating ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontWeight: '500',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-base)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
                {creating ? 'adding…' : `add "${search.trim()}"`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selected pills summary (when dropdown closed) */}
      {showPills && !open && selectedIds.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {selectedIds.map(id => {
            const item = items.find(i => i.id === id)
            if (!item) return null
            return (
              <span
                key={id}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: `${accentColor}15`,
                  border: `1px solid ${accentColor}40`,
                  borderRadius: '100px',
                  padding: '4px 10px 4px 12px',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px', fontWeight: '500',
                  color: 'var(--text-primary)',
                }}
              >
                {item.name}
                <button
                  onClick={() => toggle(id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-soft)', fontSize: '14px',
                    padding: 0, lineHeight: 1, opacity: 0.6,
                  }}
                >×</button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
