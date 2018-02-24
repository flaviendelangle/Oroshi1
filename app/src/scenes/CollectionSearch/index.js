import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Progress from '../../components/generics/Progress'
import { get as getCollection } from '../../services/actions/collections'
import { connect } from '../../services/redux'

import * as _style from './style'


class CollectionSearch extends Component {
  static propTypes = {
    synchronize: PropTypes.func.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    isContentLoaded: PropTypes.bool,
  }
  componentDidMount() {
    const { synchronize, isLoaded, isContentLoaded } = this.props
    if (!isLoaded || !isContentLoaded) {
      synchronize()
    }
  }

  render() {
    const {
      isLoaded,
      isContentLoaded,
    } = this.props
    if (!isLoaded || !isContentLoaded) {
      return (
        <Progress />
      )
    }
    return (
      <section style={_style.page} >
        <div style={_style.container} />
      </section>
    )
  }
}

const mapStateToProps = ({ content, main }, state) => ({
  collection: main.collection,
  found: main.found,
  isLoaded: main.isLoaded,

  isContentLoaded: content.isContentLoaded,

  lineDimensions: state.app.lineDimensions,
})


const mapDispatchToProps = (dispatch, { type, collection }) => ({
  synchronize: () => dispatch(getCollection(type, collection)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CollectionSearch)
