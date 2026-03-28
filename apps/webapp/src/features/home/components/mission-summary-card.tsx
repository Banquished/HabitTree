import type { Mission, MissionCheckpoint } from '@HabitTree/types'

interface Props {
  mission: Mission
  checkpoints: MissionCheckpoint[]
}

type TrackingStatus = 'ON_TRACK' | 'BEHIND' | 'AHEAD'

function computeCurrentWeek(startDate: string, durationWeeks: number): number {
  const now = Date.now()
  const start = new Date(startDate).getTime()
  const raw = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.max(1, Math.min(raw, durationWeeks))
}

function getTrackingStatus(
  checkpoint: MissionCheckpoint,
  goalType: Mission['goalType'],
): TrackingStatus {
  if (checkpoint.deltaKg === null) return 'ON_TRACK'
  const delta = checkpoint.deltaKg
  if (Math.abs(delta) < 0.1) return 'ON_TRACK'
  if (goalType === 'cut') return delta < 0 ? 'AHEAD' : 'BEHIND'
  if (goalType === 'bulk') return delta > 0 ? 'AHEAD' : 'BEHIND'
  return Math.abs(delta) < 0.5 ? 'ON_TRACK' : 'BEHIND'
}

const STATUS_STYLES: Record<TrackingStatus, string> = {
  ON_TRACK: 'text-primary',
  AHEAD: 'text-primary',
  BEHIND: 'text-error',
}

export function MissionSummaryCard({ mission, checkpoints }: Props) {
  const currentWeek = computeCurrentWeek(mission.startDate, mission.durationWeeks)

  const dataWeek =
    checkpoints.find((cp) => cp.actualKg === null)?.week ?? mission.durationWeeks

  const latestWithData = [...checkpoints]
    .reverse()
    .find((cp) => cp.actualKg !== null)

  const currentTarget = checkpoints.find((cp) => cp.week === currentWeek)

  const status = latestWithData
    ? getTrackingStatus(latestWithData, mission.goalType)
    : 'ON_TRACK'

  const weeksElapsed = Math.min(currentWeek, mission.durationWeeks)
  const progressPct = Math.round((weeksElapsed / mission.durationWeeks) * 100)

  const deltaDisplay = latestWithData?.deltaKg != null
    ? `${latestWithData.deltaKg > 0 ? '+' : ''}${latestWithData.deltaKg.toFixed(1)}`
    : null

  const { proteinPct, carbsPct, fatPct } = mission.macros

  return (
    <div className="bg-surface-container p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black tracking-widest uppercase">
            {mission.goalType}
          </span>
          <span className="text-[8px] font-bold tracking-widest uppercase text-on-surface-variant">
            {mission.startDate} — {mission.endDate}
          </span>
        </div>
        <span className={`text-[8px] font-black tracking-widest uppercase ${STATUS_STYLES[status]}`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[8px] font-bold tracking-widest uppercase text-on-surface-variant">
            WEEK
          </p>
          <p className="text-lg font-black tracking-tighter text-on-surface">
            {dataWeek} <span className="text-on-surface-variant">/ {mission.durationWeeks}</span>
          </p>
        </div>

        <div>
          <p className="text-[8px] font-bold tracking-widest uppercase text-on-surface-variant">
            ACTUAL VS TARGET
          </p>
          <p className="text-lg font-black tracking-tighter text-on-surface">
            {latestWithData?.actualKg != null ? (
              <>
                {latestWithData.actualKg.toFixed(1)}
                <span className="text-on-surface-variant">
                  {' '}/ {currentTarget?.targetKg.toFixed(1) ?? '--'}
                </span>
                {deltaDisplay && (
                  <span className={`text-sm ml-1 ${status === 'BEHIND' ? 'text-error' : 'text-primary'}`}>
                    {deltaDisplay}
                  </span>
                )}
              </>
            ) : (
              '--'
            )}
          </p>
        </div>

        <div>
          <p className="text-[8px] font-bold tracking-widest uppercase text-on-surface-variant">
            PROGRESS
          </p>
          <p className="text-lg font-black tracking-tighter text-on-surface">
            {progressPct}%
          </p>
          <div className="h-1.5 bg-surface-container-high mt-1">
            <div
              className="h-full bg-primary"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div>
          <p className="text-[8px] font-bold tracking-widest uppercase text-on-surface-variant">
            STATUS
          </p>
          <p className={`text-lg font-black tracking-tighter ${STATUS_STYLES[status]}`}>
            {status.replace('_', ' ')}
          </p>
        </div>
      </div>

      <p className="text-[8px] font-bold tracking-widest uppercase text-on-surface-variant">
        TARGET: {mission.targetCalories} KCAL // P{proteinPct}/C{carbsPct}/F{fatPct}
      </p>
    </div>
  )
}
