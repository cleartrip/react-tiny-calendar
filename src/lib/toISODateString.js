import format from 'date-fns/format'

export const ISO_FORMAT = 'D'

export default function toISODateString(date) {
  if (!date) return null

  return format(date, ISO_FORMAT)
}
