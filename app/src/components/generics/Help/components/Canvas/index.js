import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Stage, Layer, Arrow, Text } from 'react-konva'
import PropTypes from 'prop-types'

import muiThemeable from 'material-ui/styles/muiThemeable'

import * as _style from './style'


class Canvas extends Component {
  static propTypes = {
    muiTheme: PropTypes.object.isRequired,
    component: PropTypes.func.isRequired,
  }

  state = {
    layout: [],
  }

  onElementRender = ({ layout }) => {
    if (!this.canvas) {
      this.setState({ layout: [] })
    } else {
      const newLayout = Object
        .keys(layout)
        .map(el => ({
          ...layout[el],
          name: el,
        }))
        .filter(el => (!Object.prototype.hasOwnProperty.call(el, 'show') || el.show) && el.element)
        .map((config) => {
          const domElement = ReactDOM.findDOMNode(config.element)
          const coordinates = domElement.getBoundingClientRect()
          const canvasCoordinates = this.translateCoordinates(coordinates)
          const props = this.buildArrow(canvasCoordinates, config.label)
          return {
            ...config,
            domElement,
            coordinates,
            canvasCoordinates,
            props,
            name: config.name,
          }
        })
      this.setState({ layout: newLayout })
    }
  }

  get arrows() {
    return this.state.layout.map(el => (
      <Fragment>
        <Arrow {...el.props.arrow} />
        <Text {...el.props.text} />
      </Fragment>
    ))
  }

  get arrow_config() {
    const { muiTheme: { palette }} = this.props
    return {
      pointerWidth: 8,
      pointerLength: 8,
      fill: palette.titleColor,
      stroke: palette.titleColor,
      strokeWidth: 2,
    }
  }

  canvas = null

  translateCoordinates = (coordinates) => {
    const canvas = ReactDOM.findDOMNode(this.canvas)
    const canvasCoordinates = canvas.getBoundingClientRect()

    return {
      top: coordinates.top - canvasCoordinates.top,
      bottom: coordinates.bottom - canvasCoordinates.top,
      left: coordinates.left - canvasCoordinates.left,
      right: coordinates.right - canvasCoordinates.left
    }
  }

  buildArrow = (canvasCoordinates, label) => {
    const { muiTheme: { palette } } = this.props
    const verticalMiddle = (canvasCoordinates.top + canvasCoordinates.bottom) / 2
    const arrow = {
      ...this.arrow_config,
      points: [
        150,
        verticalMiddle,
        canvasCoordinates.left - 10,
        verticalMiddle,
      ],
    }
    const text = {
      text: label,
      x: 0,
      y: (verticalMiddle - 8),
      fontSize: 16,
      fill: palette.titleColor,
    }

    return { arrow, text }
  }

  render() {
    const { component, elementProps: { element, collection } } = this.props
    const Element = component
    return (
      <div style={_style.container} >
        <Element
          data={element}
          collection={collection}
          key={element.getPublicId()}
          creationMode={false}
          style={_style.element}
          mode="test"
          onRender={this.onElementRender}
        />
        <Stage
          width={_style.canvas.width}
          height={_style.canvas.height}
          style={_style.canvas}
          ref={el => this.canvas = el}
        >
          <Layer>
            {this.arrows}
          </Layer>
        </Stage>
      </div>
    )
  }

}
export default muiThemeable()(Canvas)
