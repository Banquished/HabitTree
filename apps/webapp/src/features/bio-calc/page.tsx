import { useState } from 'react'
import { useBioProfile, useBioResult, useUpdateBioProfile, useRunAnalysis } from './api/use-bio-profile'
import { useActiveMission } from './api/use-mission'
import { PhysicalCoordinates } from './components/physical-coordinates'
import { MissionParameters } from './components/mission-parameters'
import { ProcessedReadout } from './components/processed-readout'
import { MissionBriefing } from './components/mission-briefing'
import { Modal } from '@/shared/modal'
import type { BioProfile } from '@HabitTree/types'

export function Component() {
  const { data: profile } = useBioProfile()
  const { data: result } = useBioResult()
  const { data: activeMission } = useActiveMission()
  const updateProfile = useUpdateBioProfile()
  const runAnalysis = useRunAnalysis()
  const [showConfirm, setShowConfirm] = useState(false)

  function handleUpdate(patch: Partial<BioProfile>) {
    updateProfile.mutate(patch)
  }

  function handleDeploy() {
    if (activeMission) {
      setShowConfirm(true)
    } else {
      runAnalysis.mutate()
    }
  }

  function confirmDeploy() {
    setShowConfirm(false)
    runAnalysis.mutate()
  }

  const macroSum = profile?.customMacros
    ? profile.customMacros.proteinPct + profile.customMacros.carbsPct + profile.customMacros.fatPct
    : 100
  const canDeploy = macroSum === 100

  if (!profile) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-on-surface-variant tracking-widest uppercase">
              {'>'} BIO_CALC
            </span>
            <span className="cursor-blink" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-on-surface uppercase italic">
            INITIALIZE_USER_METRICS
          </h1>
          <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mt-1">
            CALIBRATING_BIO_RESONANCE_V04.1
          </p>
        </div>
        <div className="text-right text-[10px] font-bold text-on-surface-variant tracking-widest">
          PROTOCOL: MIFFLIN_ST_JEOR
          <br />
          ENGINE: V2.0_STABLE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <PhysicalCoordinates profile={profile} onUpdate={handleUpdate} />
          <MissionParameters profile={profile} targetCalories={result?.targetCalories ?? null} onUpdate={handleUpdate} />

          <div className="relative">
            <button
              onClick={handleDeploy}
              disabled={runAnalysis.isPending || !canDeploy}
              className="w-full bg-primary py-4 text-on-primary font-black tracking-widest uppercase text-sm hover:shadow-[0_0_20px_rgba(171,255,2,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
            >
              {runAnalysis.isPending && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
              DEPLOY_MISSION
              <span className="material-symbols-outlined text-lg">bolt</span>
            </button>

            <Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="ACTIVE_MISSION_DETECTED">
              <p className="text-[10px] font-black tracking-widest uppercase text-error text-center mb-6">
                DEPLOYING_NEW_MISSION_WILL_ABANDON_CURRENT
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmDeploy}
                  disabled={runAnalysis.isPending}
                  className="flex-1 px-4 py-2 bg-primary text-on-primary text-[10px] font-black tracking-widest uppercase hover:shadow-[0_0_20px_rgba(171,255,2,0.2)] transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {runAnalysis.isPending && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                  CONFIRM_DEPLOY
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2 bg-surface-container-high text-on-surface-variant text-[10px] font-black tracking-widest uppercase hover:text-on-surface transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </Modal>

            {!canDeploy && (
              <div className="text-[9px] font-bold text-error tracking-widest uppercase text-center mt-2">
                MACRO_DISTRIBUTION_MUST_EQUAL_100% (CURRENT: {macroSum}%)
              </div>
            )}
          </div>

          {activeMission && <MissionBriefing mission={activeMission} />}
        </div>

        <ProcessedReadout result={result ?? null} />
      </div>
    </div>
  )
}
