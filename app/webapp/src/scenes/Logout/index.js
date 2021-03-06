import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Progress from '../../components/generics/Progress'
import { logout as _logout } from '../../services/actions/users'


class Logout extends PureComponent {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { logout, history } = this.props
    logout().then(() => {
      history.push('/login/')
    })
  }

  render() {
    return (
      <Progress message="Logging you out..." />
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(_logout()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logout)
