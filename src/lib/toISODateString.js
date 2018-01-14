import format from 'date-fns/format'

export const ISO_FORMAT = 'YYYY-MM-DD'

export default function toISODateString(date) {
  if (!date) return null

  return format(date, ISO_FORMAT)
}
