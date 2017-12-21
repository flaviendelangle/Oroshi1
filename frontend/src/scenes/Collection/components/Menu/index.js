import React, { Component } from 'react';
import { connect } from 'react-redux';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all';
import ActionViewModule from 'material-ui/svg-icons/action/view-module';
import ActionViewStream from 'material-ui/svg-icons/action/view-stream';
import muiThemeable from 'material-ui/styles/muiThemeable';

import { switchAddingMode } from '../../actions';
import { switchLayout } from '../CollectionContent/actions';
import { getRecommendations } from 'services/actions/publicAPI';
import SnackbarList from 'components/generics/SnackbarList';

import * as _style from './style';


class Menu extends Component {
  
  render() {
    if (!this.props.found || !this.props.loaded) {
      return null;
    }
    const theme = this.props.muiTheme.palette;
    return (
      <span>
        <AddingIcon
          collection={this.props.collection}
          switchAddingMode={this.props.switchAddingMode}
          isAdding={this.props.isAdding}
        />
        <LayoutButtons
          isAdding={this.props.isAdding}
          switchLayout={this.props.switchLayout}
          theme={theme}
        />
        <SnackbarList scene={this.props.scene} />
      </span>
    )
  }
  
}

const LayoutButtons = ({ isAdding, switchLayout, theme }) => {
  if (isAdding) {
    return null;
  }
  return (
    <div style={_style.layout}>
      <LayoutIcon
        Component={ActionViewModule}
        theme={theme}
        onClick={_ => switchLayout('grid')}
      />
      <LayoutIcon
        Component={ActionViewStream}
        theme={theme}
        onClick={_ => switchLayout('stream')}
      />
    </div>
  );
};

const LayoutIcon = ({ Component, theme, onClick }) => (
  <div style={_style.layoutIcon(theme)}>
    <Component onClick={onClick} style={{ color: theme.alternateTextColor }}/>
  </div>
);

const AddingIcon = ({ isAdding, collection, switchAddingMode }) => {
  let Icon;
  if (isAdding) {
    Icon = ActionDoneAll;
  } else {
    Icon = ContentAdd;
  }
  
  return (
    <FloatingActionButton
      style={_style.add}
      onClick={_ => switchAddingMode(collection)}
    >
      <Icon/>
    </FloatingActionButton>
  );
};


const mapStateToProps = (state, ownProps) => {
  const root = state.collections.main[ownProps.scene];
  const contentRoot = state.collections.content[ownProps.scene];
  if (!root || !contentRoot) {
    return {
      loaded: false
    };
  }
  return {
    loaded: contentRoot.loaded,
    found: contentRoot.found,
    isAdding: root.isAdding,
    collection: contentRoot.collection
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    switchAddingMode: collection => {
      dispatch(switchAddingMode(ownProps.scene));
      dispatch(getRecommendations(ownProps.scene, collection));
    },
    switchLayout: layout => dispatch(switchLayout(ownProps.scene, layout))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(muiThemeable()(Menu));
