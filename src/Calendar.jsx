import React, { Component } from 'react'
import mergeClassNames from 'merge-class-names'

import VirtualList from 'react-tiny-virtual-list'

import getDaysInMonth from 'date-fns/get_days_in_month'

import MonthView from './MonthView'


import { getBegin, getEnd, getValueRange, getDifferentMonth, getISOLocalDate, getDayOfWeek } from './lib/dates'
import { between, callIfDefined, mergeFunctions } from './lib/utils'

export default class Calendar extends Component {
  getValueFrom = value => {
    if (!value) {
      return null
    }

    const { maxDate, minDate } = this.props
    const rawValueFrom =
      value instanceof Array && value.length === 2 ? value[0] : value
    const valueFromDate = new Date(rawValueFrom)

    if (Number.isNaN(valueFromDate.getTime())) {
      throw new Error(`Invalid date: ${value}`)
    }

    const valueFrom = getBegin('day', valueFromDate)

    return between(valueFrom, minDate, maxDate)
  }

  state = {
    value: this.props.value,
    activeStartDate: this.getActiveStartDate()
  }

  getActiveStartDate(props = this.props) {
    const rangeType = 'month'
    const valueFrom =
      props.activeStartDate || this.getValueFrom(props.value) || new Date()
    return getBegin(rangeType, valueFrom)
  }

  onChange = value => {
    const { selectRange, selectionState } = this.props

    let nextValue
    if (selectRange) {
      const { value: previousValue } = this.state
      // Range selection turned on
      if (selectionState === 'start') {
        nextValue = [value, value]
        callIfDefined(this.props.onChange, nextValue)
      } else if (selectionState === 'end') {
        nextValue = [previousValue[0], value]
        callIfDefined(this.props.onChange, nextValue)
      }
    } else {
      // Range selection turned off
      nextValue = this.getValueFrom(value)
      callIfDefined(this.props.onChange, nextValue)
    }

    this.setState({ value: nextValue })
  }

  renderMonthView = ({ index, style }) => {
    const {
      calendarType,
      maxDate,
      minDate,
      renderChildren,
      tileClassName,
      tileContent,
      selectRange,
      selectionState
    } = this.props
    const { activeStartDate, value } = this.state
    const { onMouseOver } = this

    const clickAction = this.onChange

    return (
      <MonthView
        onClick={mergeFunctions(clickAction, this.props.onClickDay)}
        activeStartDate={getDifferentMonth(activeStartDate, index)}
        maxDate={maxDate}
        minDate={minDate}
        tileClassName={tileClassName}
        tileContent={tileContent || renderChildren}
        value={value}
        valueType="day"
        style={style}
        selectRange={selectRange}
        selectionState={selectionState}
        daySize={ this.dayDimension }
      />
    )
  }

  render() {
    const height = window.innerHeight - (26 + 39)

    const { className, selectRange, numberOfMonths } = this.props
    const { value, activeStartDate } = this.state
    const { onMouseOut } = this
    const valueArray = [].concat(value)

    let scrollToIndex
    if (value) {
      const displayFrom = activeStartDate
      const displayTo = this.getValueFrom(value)
      scrollToIndex =
        displayTo.getMonth() -
        displayFrom.getMonth() +
        12 * (displayTo.getFullYear() - displayFrom.getFullYear())
    } else {
      scrollToIndex = 0
    }

    this.dayDimension = window.innerWidth * 0.1428;

    return (
      <div
        className={mergeClassNames(
          'react-calendar',
          selectRange &&
          valueArray.length === 1 &&
          'react-calendar--selectRange',
          className
        )}
        onMouseOut={selectRange ? onMouseOut : null}
        onBlur={selectRange ? onMouseOut : null}
      >
        <div className="react-calendar__weeks">
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
          <span>Su</span>
        </div>
        <VirtualList
          value={value}
          width="auto"
          height={height}
          itemCount={numberOfMonths}
          itemSize={index => {
            const start = getDifferentMonth(activeStartDate, index)
            const daysInMonth = getDaysInMonth(start)
            const offset = getDayOfWeek(start)

            const asliHeight = (Math.ceil((daysInMonth + offset) / 7) * this.dayDimension) + 79;
            // this.dayDimension = window.innerWidth/7 - Make the date a square first so that it becomes a proper circle.
            //Magic number 79: Height of month label
            return asliHeight;
          }}
          overscanCount={3}
          renderItem={this.renderMonthView}
          scrollToAlignment={'auto'}
          scrollToIndex={scrollToIndex}
        />
      </div>
    )
  }
}

Calendar.defaultProps = {
  maxDetail: 'month',
  numberOfMonths: 13
}
