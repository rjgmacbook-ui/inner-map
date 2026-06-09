import { useState } from 'react'
import SearchableMultiSelect from '../ui/SearchableMultiSelect'

export default function Step2Trigger({ draft, setDraft, onNext, triggersHook }) {
  const [selectedIds, setSelectedIds] = useState(draft.trigger_id ? [draft.trigger_id] : [])
  const { triggers, add } = triggersHook

  function handleNext() {
    setDraft(d => ({ ...d, trigger_id: selectedIds[0] || null }))
    onNext()
  }

  return (
    <div style={shell}>
      <div style={questionBlock}>
        <h2 style={question}>Name the trigger</h2>
        <p style={support}>A recurring situation, relationship, or pattern.</p>
      </div>

      <div style={{ flex: 1 }}>
        <SearchableMultiSelect
          items={triggers}
          selectedIds={selectedIds}
          onChange={setSelectedIds}
          onCreateItem={name => add({ name })}
          placeholder="search or add a trigger…"
          accentColor="var(--accent-amber)"
          single
        />

        {triggers.length === 0 && selectedIds.length === 0 && (
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', fontStyle: 'italic', color: 'var(--text-soft)', padding: '16px 0' }}>
            Type a trigger name to create your first one.
          </p>
        )}
      </div>

      <div style={footer}>
        <button onClick={handleNext} className="btn btn-primary btn-full">
          continue →
        </button>
        <button onClick={() => { setDraft(d => ({ ...d, trigger_id: null })); onNext() }} style={skipLink}>
          skip for now
        </button>
      </div>
    </div>
  )
}

const shell = { display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 24px 24px', height: '100%' }
const questionBlock = { display: 'flex', flexDirection: 'column', gap: '10px' }
const question = { fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '30px', fontWeight: '400', fontStyle: 'italic', color: 'var(--text-primary)', margin: 0, lineHeight: '1.2' }
const support = { fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'var(--text-soft)', lineHeight: '1.6', margin: 0 }
const footer = { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }
const skipLink = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'var(--text-soft)', padding: '4px' }
