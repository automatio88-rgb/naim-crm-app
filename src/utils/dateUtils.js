import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

export function formatDate(date, fmt = 'MMM dd, yyyy') {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? format(d, fmt) : ''
}

export function formatDateTime(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? format(d, 'MMM dd, yyyy HH:mm') : ''
}

export function timeAgo(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : ''
}

export function toISOString(date) {
  if (!date) return null
  return new Date(date).toISOString()
}
