import React from 'react'
import classNames from 'classnames'

import {
  getBeginOfDay,
  getDay,
  getEndOfDay,
  getISOLocalDate,
  isWeekend
} from './lib/dates'

const Day = ({
  classes,
  currentMonthIndex,
  date,
  maxDate,
  minDate,
  onClick,
  onMouseOver,
  style,
  tileClassName,
  tileContent,
  modifiers
}) => (
  <button
    disabled={modifiers.has('disabled')}
    className={classNames({
      'react-calendar__month-view__days__day': true,
      'react-calendar__tile': true,
      'react-calendar__tile--active': modifiers.has('selected'),
      'react-calendar__month-view__days__day--weekend': modifiers.has('weekend')
    })}
    style={style}
    type="button"
    //   className={mergeClassNames(
    //     className,
    //     ...classes,
    //     isWeekend(date) && `${className}--weekend`,
    //     date.getMonth() !== currentMonthIndex && `${className}--neighboringMonth`,
    //     tileClassName instanceof Function
    //       ? tileClassName({ date, view: 'month' })
    //       : tileClassName
    //   )}
    //   disabled={
    //     (minDate && getBeginOfDay(minDate) > date) ||
    //     (maxDate && getEndOfDay(maxDate) < date)
    //   }
    //   key={date}
    onClick={onClick}
    //   onMouseOver={onMouseOver && (() => onMouseOver(date))}
    //   onFocus={onMouseOver && (() => onMouseOver(date))}
  >
    {date}
    {/* <time dateTime={`${getISOLocalDate(date)}T00:00:00.000`}>
      {getDay(date)}
    </time>
    {typeof tileContent === 'function'
      ? tileContent({ date, view: 'month' })
      : tileContent} */}
  </button>
)

export default Day
