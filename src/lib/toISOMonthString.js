import format from 'date-fns/format'

export const ISO_MONTH_FORMAT = 'YYYY-MM'

export default function toISOMonthString(date) {
  if (!date) return null

  return format(date, ISO_MONTH_FORMAT)
}
