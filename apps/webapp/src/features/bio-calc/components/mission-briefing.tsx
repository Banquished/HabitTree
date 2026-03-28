import { Link } from 'react-router'
import type { Mission } from '@HabitTree/types'

interface Props {
  mission: Mission
}

export function MissionBriefing({ mission }: Props) {
  const now = new Date()
  const start = new Date(mission.startDate)
  const elapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)))
  const currentWeek = Math.min(elapsed + 1, mission.durationWeeks)
  const progressPct = Math.round((currentWeek / mission.durationWeeks) * 100)
  const weeklyRate = Math.abs((mission.goalWeightKg - mission.startWeightKg) / mission.durationWeeks)

  return (
    <section className="bg-surface-container p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">rocket_launch</span>
          <h2 className="text-sm font-black tracking-tight uppercase text-on-surface">
            ACTIVE_MISSION
          </h2>
          <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black tracking-widest uppercase">
            {mission.goalType.toUpperCase()}
          </span>
        </div>
        <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
          WEEK_{String(currentWeek).padStart(2, '0')}/{String(mission.durationWeeks).padStart(2, '0')}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <span className="text-[8px] font-bold tracking-widest uppercase text-on-surface-variant block">START</span>
          <span className="text-sm font-black text-on-surface">{mission.startWeightKg} KG</span>
        </div>
        <div>
          <span className="text-[8px] font-bold tracking-widest uppercase text-on-surface-variant block">TARGET</span>
          <span className="text-sm font-black text-primary">{mission.goalWeightKg} KG</span>
        </div>
        <div>
          <span className="text-[8px] font-bold tracking-widest uppercase text-on-surface-variant block">RATE</span>
          <span className="text-sm font-black text-on-surface">{weeklyRate.toFixed(1)} KG/WK</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold tracking-widest uppercase text-on-surface-variant">
            MISSION_PROGRESS
          </span>
          <span className="text-[8px] font-bold tracking-widest text-primary">{progressPct}%</span>
        </div>
        <div className="h-2 bg-surface-container-high">
          <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex justify-between text-[8px] font-bold tracking-widest text-on-surface-variant">
          <span>{mission.startDate}</span>
          <span>{mission.endDate}</span>
        </div>
      </div>

      <Link
        to="/"
        className="block text-center text-[9px] font-black tracking-widest uppercase text-primary hover:underline"
      >
        {'>'} VIEW_FULL_MISSION_DASHBOARD
      </Link>
    </section>
  )
}
