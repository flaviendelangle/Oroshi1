import React, { Component } from 'react';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';

import Line from './components/Line';
import { getCollectionSettingsState } from 'containers/reducer'

class MenuPanel extends Component {
  
  get palette() {
    return this.props.muiTheme.baseTheme.palette;
  }
  
  get panelStyle() {
    return {
      position: 'absolute',
      top: 64,
      bottom: 0,
      left: 0,
      paddingTop: 50,
      width: 'calc(40% - 20px)',
      paddingRight: 20,
    };
  }
  
  render() {
    return (
      <div style={this.panelStyle}>
        <Line active={this.props.active === 'summary'} value="summary">
          Summary
        </Line>
        <Line active={this.props.active === 'spoilers'} value="spoilers">
          Spoilers
        </Line>
        <Line active={this.props.active === 'languages'} value="languages">
          Languages
        </Line>
        <Line active={this.props.active === 'exports'} value="exports">
          Export your data
        </Line>
      </div>
    );
    
  }
  
}

const mapStateToProps = (state, ownProps) => {
  const root = getCollectionSettingsState(state, ownProps.scene).main;
  return {
    active: root.activeSection
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(muiThemeable()(MenuPanel));