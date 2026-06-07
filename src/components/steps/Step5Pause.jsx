import PauseScreen from '../../views/PauseScreen'

export default function Step5Pause({ draft, setDraft, onNext, onBack }) {
  return (
    <PauseScreen
      onComplete={(secs) => {
        setDraft(d => ({ ...d, pause_completed: true, pause_duration_s: secs }))
        onNext()
      }}
      onSkip={() => {
        setDraft(d => ({ ...d, pause_completed: false, pause_duration_s: 0 }))
        onNext()
      }}
      onBack={onBack}
    />
  )
}
