import React, { Component } from 'react'
import { connect } from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionDoneAll from 'material-ui/svg-icons/action/done-all'
import ActionViewList from 'material-ui/svg-icons/action/view-list'
import ActionViewModule from 'material-ui/svg-icons/action/view-module'
import ActionViewStream from 'material-ui/svg-icons/action/view-stream'

import { switchAddingMode } from '../../actions'
import { switchLayout } from '../CollectionContent/actions'
import { getRecommendations } from 'services/actions/publicAPI'

const addStyle = {
  position: 'fixed',
  bottom: 20,
  right: 20
};

const layoutStyle = {
  position: 'fixed',
  top: 84,
  right: 20
};

class Menu extends Component {
  
  render() {
    if(!this.props.found || !this.props.loaded) {
      return null;
    }
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
        />
      </span>
    )
  }
  
}

const LayoutButtons = ({ isAdding, switchLayout }) => {
  if (isAdding) {
    return null;
  }
  return (
    <div style={layoutStyle}>
      <ActionViewList
        style={{marginRight: 10, cursor: 'pointer'}}
        onClick={() => switchLayout('list')}
      />
      <ActionViewModule
        style={{marginRight: 10, cursor: 'pointer'}}
        onClick={() => switchLayout('grid')}
      />
      <ActionViewStream
        style={{cursor: 'pointer'}}
        onClick={() => switchLayout('stream')}
      />
    </div>
  );
};

const AddingIcon = ({ isAdding, collection, switchAddingMode }) => {
  let Icon;
  if (isAdding) {
    Icon = ActionDoneAll;
  } else {
    Icon = ContentAdd;
  }
  
  return (
    <FloatingActionButton
      style={addStyle}
      onClick={() => switchAddingMode(collection)}
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
)(Menu);

