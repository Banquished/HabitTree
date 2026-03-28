/** Format a Date as YYYY-MM-DD in local timezone (avoids UTC shift from toISOString) */
export function formatLocalDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Get today's date as YYYY-MM-DD in local timezone */
export function todayLocal(): string {
  return formatLocalDate(new Date())
}
