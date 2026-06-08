import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../store/AppContext'
import StepProgress from '../components/ui/StepProgress'
import Step1Event    from '../components/steps/Step1Event'
import Step2Trigger  from '../components/steps/Step2Trigger'
import Step3Charge   from '../components/steps/Step3Charge'
import Step4Reaction from '../components/steps/Step4Reaction'
import Step5Pause    from '../components/steps/Step5Pause'
import Step6Toolkit  from '../components/steps/Step6Toolkit'
import Step7Action   from '../components/steps/Step7Action'

const TOTAL_STEPS = 7

const variants = {
  enterForward:  { x: 40,  opacity: 0 },
  enterBackward: { x: -40, opacity: 0 },
  center:        { x: 0,   opacity: 1 },
  exitForward:   { x: -40, opacity: 0 },
  exitBackward:  { x: 40,  opacity: 0 },
}

export default function LogEncounter() {
  const { navigate, triggersHook, chargesHook, reactionsHook, toolkitHook, encountersHook } = useApp()

  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection]  = useState('forward')
  const [draft, setDraft]          = useState({
    event_description: '',
    trigger_id:        null,
    charge_ids:          [],
    charge_intensities:  {},
    reaction_ids:      [],
    pause_completed:   false,
    pause_duration_s:  0,
    toolkit_item_ids:  [],
    next_action:       '',
  })

  function goNext() {
    setDirection('forward')
    if (stepIndex < TOTAL_STEPS - 1) {
      setStepIndex(i => i + 1)
    }
  }

  function goBack() {
    setDirection('back')
    if (stepIndex > 0) setStepIndex(i => i - 1)
  }

  async function handleComplete() {
    try {
      await encountersHook.add(draft)
    } catch (err) {
      console.error('Failed to save encounter:', err)
    }
    navigate('dashboard')
  }

  // Step 7 passes next_action value directly to avoid React batching issue
  async function handleStep7Next(nextAction) {
    try {
      await encountersHook.add({ ...draft, next_action: nextAction })
    } catch (err) {
      console.error('Failed to save encounter:', err)
    }
    navigate('dashboard')
  }

  const stepProps = { draft, setDraft, onNext: goNext, onBack: goBack }

  // Step 5 (Pause) renders full-screen — handle outside AnimatePresence
  if (stepIndex === 4) {
    return (
      <Step5Pause
        draft={draft}
        setDraft={setDraft}
        onNext={goNext}
        onBack={goBack}
      />
    )
  }

  const stepComponents = [
    <Step1Event   key="s1" {...stepProps} />,
    <Step2Trigger key="s2" {...stepProps} triggersHook={triggersHook} />,
    <Step3Charge  key="s3" {...stepProps} chargesHook={chargesHook} />,
    <Step4Reaction key="s4" {...stepProps} reactionsHook={reactionsHook} />,
    null, // Step5Pause handled above
    <Step6Toolkit key="s6" {...stepProps} toolkitHook={toolkitHook} />,
    <Step7Action  key="s7" {...stepProps} onNext={handleStep7Next} />,
  ]

  const isForward = direction === 'forward'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 150,
      background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      maxWidth: '420px', margin: '0 auto',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px 8px',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        {/* Back arrow */}
        <button
          onClick={goBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 8px', color: 'var(--text-soft)',
            fontFamily: '"DM Sans", sans-serif', fontSize: '20px',
            opacity: stepIndex === 0 ? 0 : 1,
            pointerEvents: stepIndex === 0 ? 'none' : 'auto',
            transition: 'opacity 0.2s',
          }}
          aria-label="Go back"
        >
          ←
        </button>

        {/* Brand */}
        <span style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '16px', fontStyle: 'italic',
          color: 'var(--text-soft)',
        }}>
          inner map
        </span>

        {/* Close */}
        <button
          onClick={() => navigate('dashboard')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 8px', color: 'var(--text-soft)',
            fontSize: '20px', lineHeight: 1,
            fontFamily: '"DM Sans", sans-serif',
          }}
          aria-label="Cancel encounter"
        >
          ×
        </button>
      </div>

      {/* Step progress */}
      <div style={{ padding: '12px 24px 4px', flexShrink: 0 }}>
        <StepProgress current={stepIndex} total={TOTAL_STEPS} />
      </div>

      {/* Animated step content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepIndex}
            initial={isForward ? variants.enterForward : variants.enterBackward}
            animate={variants.center}
            exit={isForward ? variants.exitForward : variants.exitBackward}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}
          >
            {stepComponents[stepIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
