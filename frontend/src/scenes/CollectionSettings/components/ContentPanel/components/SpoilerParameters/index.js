import React, { Component } from 'react';
import { connect } from 'react-redux';
import Toggle from 'material-ui/Toggle';

import ParametersSection, { Line } from '../ParametersSection';
import { update } from 'scenes/CollectionSettings/actions';

class SpoilerParameters extends Component {
  
  render() {
    return (
      <ParametersSection>
        <div className="title">Spoilers</div>
        <div className="content">
          <Line
            primaryText="Hide the titles of the unseen episodes"
            rightToggle={
              <Toggle
                toggled={this.props.data.hide_unseen_titles}
                onToggle={(proxy, active) => {
                  this.props.update(this.props.data.pk, 'hide_unseen_titles', active)
                }}
              />
            }
          />
        </div>
      </ParametersSection>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, { type }) => {
  return {
    update: (pk, field, value) => dispatch(update(type, pk, field, value))
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpoilerParameters);