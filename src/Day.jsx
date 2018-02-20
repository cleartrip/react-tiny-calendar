import React from 'react'
import mergeClassNames from 'merge-class-names'

import {
  getBeginOfDay,
  getDay,
  getEndOfDay,
  getISOLocalDate,
  isWeekend
} from './lib/dates'

const className = 'react-calendar__month-view__days__day'

const Day = ({
  classes,
  currentMonthIndex,
  date,
  maxDate,
  minDate,
  onClick,
  style,
  tileClassName,
  tileContent
}) => {
  const isDisabled = (minDate && getBeginOfDay(minDate) > date) ||
    (maxDate && getEndOfDay(maxDate) < date);
  return (
    <div
      className={mergeClassNames(
        className,
        ...classes,
        isDisabled && "day-disabled",
        isWeekend(date) && `${className}--weekend`,
        date.getMonth() !== currentMonthIndex && `${className}--neighboringMonth`,
        tileClassName instanceof Function
          ? tileClassName({ date, view: 'month' })
          : tileClassName
      )}
      key={date}
      onClick={!isDisabled && onClick && (() => onClick(date))}
      style={style}
    >
      <time dateTime={`${getISOLocalDate(date)}T00:00:00.000`}>
        {getDay(date)}
      </time>
      {typeof tileContent === 'function'
        ? tileContent({ date, view: 'month' })
        : tileContent}
    </div>
  )
}

Day.displayName="Day"

export default Day
