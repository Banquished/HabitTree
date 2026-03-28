export type OperationFrequency = 'daily' | 'weekly' | 'specific_days'
export type OperationPriority = 'low' | 'medium' | 'high'

export interface OperationTemplate {
  id: string
  name: string
  description?: string
  icon: string
  category?: string
  frequency: OperationFrequency
  specificDays?: number[]
  priority: OperationPriority
  targetCount: number
  sortOrder: number
  isActive: boolean
  createdAt: string
}

export interface OperationLog {
  id: string
  templateId: string
  date: string
  completedAt: string | null
  note?: string
}

export interface HeatmapDay {
  date: string
  total: number
  completed: number
  rate: number
}

export interface DailySummaryItem {
  template: OperationTemplate
  log: OperationLog | null
}

export interface DailySummary {
  date: string
  completedCount: number
  totalCount: number
  items: DailySummaryItem[]
}
