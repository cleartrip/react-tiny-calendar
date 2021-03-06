import React from 'react'

const toPercent = num => `${num}%`

const Flex = ({
  children,
  className,
  direction,
  count,
  offset,
  style,
  wrap,
  daySize,
  ...otherProps
}) => (
  <div
    className={className}
    style={Object.assign(
      {
        display: 'flex',
        flexDirection: direction,
        flexWrap: wrap ? 'wrap' : 'no-wrap'
      },
      style
    )}
    {...otherProps}
  >
    {React.Children.map(children, (child, index) =>
      React.cloneElement(
        child,
        Object.assign({}, child.props, {
          style: Object.assign(
            {
              width: daySize,
              height: daySize,
              overflow: 'hidden'
            },
            offset &&
              index === 0 && {
                marginLeft: toPercent(100 * offset / count)
              }
          )
        })
      )
    )}
  </div>
)

Flex.displayName = "Flex"

export default Flex
