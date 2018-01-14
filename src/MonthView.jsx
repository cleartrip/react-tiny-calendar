import React, { PureComponent } from 'react'

import Flex from './Flex'
import Day from './Day'
import Weekdays from './Weekdays'

import { formatMonthYear } from './lib/dateFormatter'
import { getTileClasses } from './lib/utils'
import { getDayOfWeek } from './lib/dates'

export default class MonthView extends PureComponent {
  renderWeekdays() {
    const { calendarType } = this
    const { activeStartDate } = this.props

    return <Weekdays calendarType={'ISO 8601'} month={activeStartDate} />
  }

  renderDays() {
    const { modifiers, activeStartDate, onClick, index } = this.props

    return (
      <Flex
        className="react-calendar__month-view__days"
        count={7}
        offset={getDayOfWeek(activeStartDate, 'ISO 8601')}
        wrap
      >
        {Object.keys(modifiers).map(modifier => {
          return (
            <Day
              onClick={onClick.bind(null, modifier, index)}
              date={modifier}
              modifiers={modifiers[modifier]}
              currentMonthIndex={index}
            />
          )
        })}
      </Flex>
    )
  }

  render() {
    const { style } = this.props
    return (
      <div style={style} className="react-calendar__month-view">
        <h3 className="react-calendar__month-name">{'label'}</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ flexGrow: 1 }}>
            {this.renderWeekdays()}
            {this.renderDays()}
          </div>
        </div>
      </div>
    )
  }
}
