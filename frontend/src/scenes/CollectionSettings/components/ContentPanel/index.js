import React, { Component } from 'react';

import muiThemeable from 'material-ui/styles/muiThemeable';

import SummaryParameters from './components/SummaryParameters';
import Progress from 'components/generics/Progress';
//import SpoilerParameters from './components/SpoilerParameters';
import LanguageParameters from './components/LanguageParameters';
import ExportParameters from './components/ExportParameters';
import DataImporter from './components/DataImporter';
import { connect } from 'services/redux';


class MenuPanel extends Component {
  
  get panelStyle() {
    const { muiTheme: { palette }} = this.props;
    return {
      position: 'absolute',
      top: 64,
      bottom: 0,
      right: 0,
      paddingTop: 50,
      width: '60%',
      backgroundColor: palette.primary2Color
    };
  }

  render() {
    const { active, scene, collection, data } = this.props;
    if(!data) {
      return (
        <div style={this.panelStyle}>
          <Progress />
        </div>
      );
    }
    return (
      <div style={this.panelStyle}>
        <Panel active={active} scene={scene} collection={collection} data={data} />
      </div>
    );
    
  }
  
}

/**
 * Return the component of a given settings section
 * @param {string} active - name of the current settings section
 * @returns {Component} component representing this settings section
 */
const getSectionComponent = active => {
  switch(active) {
    case 'summary':
      return SummaryParameters;
    /*case 'spoilers':
      return SpoilerParameters;*/
    case 'languages':
      return LanguageParameters;
    case 'exports':
      return ExportParameters;
    case 'imports':
      return DataImporter;
    default:
      return null;
  }
};

const Panel = ({ active, scene, collection, data  }) => {
  const Section = getSectionComponent(active);
  if(!Section) {
    return null;
  }
  return <Section scene={scene} collection={collection} data={data} />;
};

const mapStateToProps = ({ settings }) => {
  return {
    active: settings.activeSection,
    data: settings.data,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(muiThemeable()(MenuPanel));