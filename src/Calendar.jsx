import React, { Component } from 'react'
import VirtualList from 'react-tiny-virtual-list'
import isSameDay from 'date-fns/is_same_day'
import isWeekend from 'date-fns/is_weekend'
import isBefore from 'date-fns/is_before'
import parse from 'date-fns/parse'
import getMonth from 'date-fns/get_month'

import MonthView from './MonthView'

import toISODateString from './lib/toISODateString'
import toISOMonthString from './lib/toISOMonthString'

import {
  getBegin,
  getEnd,
  getValueRange,
  getDifferentMonth,
  getVisibleDays
} from './lib/dates'
import { between, callIfDefined, mergeFunctions } from './lib/utils'

export default class Calendar extends Component {
  constructor(props) {
    super(props)
    this.today = new Date()
    this.modifiers = {
      disabled: day => this.isDisabled(day),
      selected: day => this.isSelected(day),
      weekend: day => this.isWeekend(day)
    }
    const { currentMonth, visibleDays } = this.getStateForNewMonth(props)
    this.state = { currentMonth, visibleDays }
  }

  addModifier = (updatedDays, day, modifier) => {
    const { visibleDays } = this.state

    const iso = toISODateString(day)

    let updatedDaysAfterAddition = { ...updatedDays }
    const monthIso = getMonth(day)
    const month = updatedDays[monthIso] || visibleDays[monthIso]

    const modifiers = new Set(month[iso])
    modifiers.add(modifier)
    updatedDaysAfterAddition = {
      ...updatedDaysAfterAddition,
      [monthIso]: { ...month, [iso]: modifiers }
    }

    return updatedDaysAfterAddition
  }

  deleteModifier = (updatedDays, day, modifier) => {
    const { visibleDays } = this.state

    const iso = toISODateString(day)

    let updatedDaysAfterDeletion = { ...updatedDays }
    const monthIso = getMonth(day)
    const month = updatedDays[monthIso] || visibleDays[monthIso]

    const modifiers = new Set(month[iso])
    modifiers.delete(modifier)
    updatedDaysAfterDeletion = {
      ...updatedDaysAfterDeletion,
      [monthIso]: { ...month, [iso]: modifiers }
    }

    return updatedDaysAfterDeletion
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps
    let { visibleDays } = this.state
    const didDateChange = value !== this.props.value
    let modifiers = {}
    if (didDateChange) {
      modifiers = this.deleteModifier(modifiers, this.props.value, 'selected')
      modifiers = this.addModifier(modifiers, value, 'selected')
    }
    this.setState({
      visibleDays: {
        ...visibleDays,
        ...modifiers
      }
    })
  }

  isDisabled = day => {
    return isBefore(day, this.props.minDate)
  }

  isSelected = day => {
    return isSameDay(day, this.props.date)
  }

  isWeekend = day => {
    return isWeekend(day)
  }

  getModifiersForDay(day) {
    return new Set(
      Object.keys(this.modifiers).filter(modifier =>
        this.modifiers[modifier](day)
      )
    )
  }

  getStateForNewMonth(nextProps) {
    const { initialVisibleMonth, date, numberOfMonths } = nextProps
    const initialVisibleMonthThunk =
      initialVisibleMonth || (date ? () => date : () => this.today)
    const currentMonth = initialVisibleMonthThunk()
    const visibleDays = this.getModifiers(
      getVisibleDays(currentMonth, numberOfMonths)
    )
    return { currentMonth, visibleDays }
  }

  getModifiers(visibleDays) {
    const modifiers = {}
    Object.keys(visibleDays).forEach(month => {
      modifiers[month] = {}
      visibleDays[month].forEach(day => {
        modifiers[month][toISODateString(day)] = this.getModifiersForDay(day)
      })
    })

    return modifiers
  }

  // onChange = value => {
  //   const { selectRange } = this.props

  //   let nextValue
  //   if (selectRange) {
  //     const { value: previousValue } = this.state
  //     // Range selection turned on
  //     if (!previousValue || [].concat(previousValue).length !== 1) {
  //       // 0 or 2 - either way we're starting a new array
  //       // First value
  //       nextValue = getBegin('day', value)
  //     } else {
  //       // Second value
  //       nextValue = getValueRange('day', previousValue, value)
  //       callIfDefined(this.props.onChange, nextValue)
  //     }
  //   } else {
  //     // Range selection turned off
  //     nextValue = this.getValueFrom(value)
  //     callIfDefined(this.props.onChange, nextValue)
  //   }

  //   this.setState({ value: nextValue })
  // }

  renderMonthView = ({ index, style }) => {
    const { currentMonth, visibleDays } = this.state
    return (
      <MonthView
        activeStartDate={getDifferentMonth(currentMonth, index)}
        modifiers={visibleDays[index]}
        index={index}
        onClick={this.onClickDay}
        style={style}
      />
    )
  }

  onClickDay = (ISODateString, currentMonthIndex) => {
    const { onChange } = this.props
    onChange(parse(ISODateString))
  }

  render() {
    const { value } = this.props
    return (
      <div className="react-calendar">
        <VirtualList
          value={value}
          width="auto"
          height={640}
          itemCount={13}
          itemSize={296.5}
          overscanCount={3}
          renderItem={this.renderMonthView}
        />
      </div>
    )
  }
}
