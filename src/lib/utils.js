import { getRange } from './dates'

import isSameDay from 'date-fns/is_same_day'

/**
 * Returns a function that, when called, calls all the functions
 * passed to it, applying its arguments to them.
 *
 * @param {Function[]} functions
 */
export const mergeFunctions = (...functions) => (...args) =>
  functions.filter(Boolean).forEach(f => f(...args))

/**
 * Calls a function, if it's defined, with specified arguments
 * @param {Function} fn
 * @param {Object} args
 */
export const callIfDefined = (fn, ...args) => {
  if (fn && typeof fn === 'function') {
    fn(...args)
  }
}

export const isValueWithinRange = (value, range) =>
  range[0] <= value && range[1] >= value

export const isRangeWithinRange = (greaterRange, smallerRange) =>
  greaterRange[0] <= smallerRange[0] && greaterRange[1] >= smallerRange[1]

export const doRangesOverlap = (range1, range2) =>
  isValueWithinRange(range1[0], range2) || isValueWithinRange(range1[1], range2)

/**
 * Returns a value no smaller than min and no larger than max.
 *
 * @param {*} value Value to return.
 * @param {*} min Minimum return value.
 * @param {*} max Maximum return value.
 */
export const between = (value, min, max) => {
  if (min && min > value) {
    return min
  }
  if (max && max < value) {
    return max
  }
  return value
}

export const getTileClasses = ({
  value,
  valueType,
  date,
  dateType,
  hover
} = {}) => {
  const classes = ['react-calendar__tile']
  if (!value) {
    return classes
  }

  if (
    !date ||
    (!(value instanceof Array) && !valueType) ||
    (!(date instanceof Array) && !dateType)
  ) {
    throw new Error(
      'getTileClasses(): Unable to get tile activity classes because one or more required arguments were not passed.'
    )
  }

  const valueRange = value instanceof Array ? value : getRange(valueType, value)
  const dateRange = date instanceof Array ? date : getRange(dateType, date)

  if (isValueWithinRange(date, valueRange)) {
    classes.push('react-calendar__tile--active')

    if (value instanceof Date) {
      classes.push(
        'react-calendar__tile--papayawhip'
      )
    }
  }

  if (value instanceof Array) {
    if (isSameDay(date, value[0])) {
      classes.push('react-calendar__tile--start')
    }
    if (isSameDay(date, value[1])) {
      classes.push('react-calendar__tile--end')
    }
  }

  return classes
}
