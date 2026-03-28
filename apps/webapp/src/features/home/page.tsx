import { Link } from 'react-router'
import { useActiveMission, useMissionCheckpoints } from '../bio-calc/api/use-mission'
import { useWeightEntries } from '../weight-log/api/use-weight-entries'
import { useDailyMacros } from '../fuel-intake/api/use-daily-macros'
import { useMacroTargets } from '../fuel-intake/api/use-macro-targets'
import { DailyMacroCards } from '../fuel-intake/components/daily-macro-cards'
import { MissionSummaryCard } from './components/mission-summary-card'
import { MissionTracker } from './components/mission-tracker'

export function Component() {
  const { data: mission } = useActiveMission()
  const { data: checkpoints } = useMissionCheckpoints()
  const { data: entries = [] } = useWeightEntries()
  const { data: macroTargets } = useMacroTargets()
  const todayStr = new Date().toISOString().slice(0, 10)
  const dailyMacros = useDailyMacros(todayStr)

  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-on-surface-variant tracking-widest uppercase">
              {'>'} DASHBOARD
            </span>
            <span className="cursor-blink" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-on-surface uppercase italic">
            COMMAND_CENTER
          </h1>
          <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mt-1">
            SYSTEM_READY // ALL_MODULES_ONLINE
          </p>
        </div>
      </div>

      {mission && checkpoints ? (
        <>
          <MissionSummaryCard mission={mission} checkpoints={checkpoints} />
          <MissionTracker mission={mission} checkpoints={checkpoints} />
        </>
      ) : (
        <div className="bg-surface-container p-8 text-center space-y-3">
          <span className="material-symbols-outlined text-on-surface-variant text-4xl">rocket_launch</span>
          <p className="text-sm font-black tracking-widest uppercase text-on-surface-variant">
            NO_ACTIVE_MISSION
          </p>
          <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
            INITIALIZE_MISSION_VIA_BIO_CALC_MODULE
          </p>
          <Link
            to="/bio-calc"
            className="inline-block px-6 py-2 bg-primary text-on-primary text-[10px] font-black tracking-widest uppercase hover:shadow-[0_0_20px_rgba(171,255,2,0.2)] transition-all"
          >
            {'>'} LAUNCH_BIO_CALC
          </Link>
        </div>
      )}

      <div className="bg-surface-container-low">
        <div className="bg-surface-container px-6 py-4 flex items-center justify-between">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase italic">
            {'>'} RECENT_WEIGHT_ENTRIES
          </span>
          <Link
            to="/weight-log"
            className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors"
          >
            VIEW_ALL {'>>'}
          </Link>
        </div>
        {recentEntries.length > 0 ? (
          <div className="divide-y divide-surface-container-high">
            {recentEntries.map((entry) => {
              const d = new Date(entry.timestamp)
              const ts = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
              return (
                <div key={entry.id} className="flex items-center justify-between px-6 py-3">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant">{ts}</span>
                  <span className="text-sm font-black font-mono text-primary">{entry.weightKg.toFixed(1)} KG</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
            NO_ENTRIES_LOGGED
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase italic">
            {'>'} TODAY_FUEL_STATUS
          </span>
          <Link
            to="/fuel-intake"
            className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors"
          >
            MANAGE {'>>'}
          </Link>
        </div>
        <DailyMacroCards dailyMacros={dailyMacros} macroTargets={macroTargets ?? null} />
      </div>
    </div>
  )
}
