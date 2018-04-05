import React, { PureComponent } from 'react'

import Month from './Month'

import format from 'date-fns/format'

export default class MonthView extends PureComponent {
  get calendarType() {
    const { calendarType } = this.props

    if (calendarType) {
      return calendarType
    }

    return 'ISO 8601'
  }


  renderDays() {

    const { calendarType, ...childProps } = this.props

    return <Month calendarType={this.calendarType} {...childProps} />
  }

  render() {
    const className = 'react-calendar__month-view'

    const { style, activeStartDate } = this.props

    const label = format(activeStartDate, "MMMM YYYY")

    return (
      <div style={style} className={[className].join(' ')}>
        <h3 className="react-calendar__month-name">{label}</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ flexGrow: 1 }}>
            {this.renderDays()}
          </div>
        </div>
      </div>
    )
  }
}
