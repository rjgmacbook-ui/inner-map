import { useState } from 'react'
import SearchableMultiSelect from '../ui/SearchableMultiSelect'

export default function Step4Reaction({ draft, setDraft, onNext, reactionsHook }) {
  const [selectedIds, setSelectedIds] = useState(draft.reaction_ids || [])
  const { reactions, add } = reactionsHook

  function handleNext() {
    setDraft(d => ({ ...d, reaction_ids: selectedIds }))
    onNext()
  }

  return (
    <div style={shell}>
      <div style={questionBlock}>
        <h2 style={question}>What was your default reaction?</h2>
        <p style={support}>The automatic, habitual response that showed up.</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <SearchableMultiSelect
          items={reactions}
          selectedIds={selectedIds}
          onChange={setSelectedIds}
          onCreateItem={name => add({ name })}
          placeholder="search or add a reaction…"
          accentColor="var(--accent-clay)"
        />

        {reactions.length === 0 && selectedIds.length === 0 && (
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', fontStyle: 'italic', color: 'var(--text-soft)', padding: '16px 0' }}>
            Type a reaction name to create your first one.
          </p>
        )}
      </div>

      <div style={footer}>
        <button onClick={handleNext} className="btn btn-primary btn-full">
          continue →
        </button>
        <button onClick={() => { setDraft(d => ({ ...d, reaction_ids: [] })); onNext() }} style={skipLink}>
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
