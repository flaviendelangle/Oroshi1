import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import muiThemeable from 'material-ui/styles/muiThemeable';
import ImageEye from 'material-ui/svg-icons/image/remove-red-eye';

import Poster from 'components/generics/Poster/index';
import ElementOverlay from 'components/generics/ElementOverlay/index';
import { addElement, removeElement } from 'services/actions/collections/index';
import { switchSeenOnElement } from 'services/actions/collections/movies';
import { publicRoot } from 'services/TheMovieDatabaseJS/movies';
import date from 'services/content/date';

import './style.css'


/** Class representing a movie frame, used mainly in the layouts (Grid + Stream) */
class Movie extends Component {
  
  state = {
    isMouseOver: false,
    isAdding: false,
    isReady: false
  };
  
  layout = {
    title: {
      element: null,
      label: 'Title'
    },
    year: {
      element: null,
      label: 'Year of release'
    },
    grade: {
      element: null,
      label: 'Public grade'
    },
    seen: {
      element: null,
      label: 'Have you seen it ?'
    },
    add: {
      element: null,
      label: 'Add to collection'
    }
  };
  
  get release_date() {
    return date(this.props.data.getReleaseDate(), date.TMDB_FORMAT, date.YEAR_FORMAT);
  }
  
  get title() {
    return this.props.data.getTitle();
  }
  
  get posterPath() {
    return this.props.data.getPosterPath();
  }
  
  get note() {
    return this.props.data.getNote();
  }
  
  get parentClassName() {
    let className = '';
    if (this.props.data.isInCollection()) {
      className = ' already-in-collection';
    } else if (this.props.creationMode) {
      className = ' not-in-collection';
    }
    if (this.state.isReady) {
      className += ' ready';
    }
    return className
  };
  
  /**
   * Update state.mouseOver to decide if we want to generate the Overlay
   * @param {boolean} isMouseOver
   */
  handleMouseHover = isMouseOver => {
    this.setState({ isMouseOver })
  };
  
  handlePosterLoad = _ => {
    this.setState({ isReady: true });
  };
  
  /**
   * Check if we are in test mode
   */
  isTesting = _ => {
    return this.props.mode === 'test';
  };
  
  addToLayout = (key, element) => {
    this.layout[key].element = element
  };
  
  /**
   * Add the movie into the collection
   */
  save = _ => {
    if (!this.state.isAdding) {
      this.props.create(this.props.collection, this.props.data);
      this.setState({ isAdding: true });
    }
  };
  
  /**
   * Remove the movie from the collection
   */
  destroy = _ => {
    this.props.destroy(this.props.collection, this.props.data);
  };
  
  /**
   * Switch the seen paramter of the movie
   */
  switchSeen = _ => {
    if(this.isTesting()) {
      return null;
    }
    this.props.switchSeen(this.props.data);
  };
  
  componentWillReceiveProps(newProps) {
    if (this.props.data.isInCollection() !== newProps.data.isInCollection()) {
      this.setState({ isAdding: false });
    }
  }
  
  componentDidUpdate() {
    if(this.props.onRender) {
      this.props.onRender({
        layout: this.layout
      });
    }
  }

  render() {
    return (
      <div className={'movie-parent ' + this.parentClassName} style={this.props.style}>
        <div className="movie-container">
          <Paper
            zDepth={3}
            className="movie"
            onMouseEnter={_ => this.handleMouseHover(true)}
            onMouseLeave={_ => this.handleMouseHover(false)}
          >
            <Poster
              path={this.posterPath}
              title={this.title}
              onLoad={this.handlePosterLoad}
            />
            <ElementOverlay
              mode={this.props.mode}
              addToLayout={this.addToLayout}
              note={this.note}
              mouseOver={this.state.isMouseOver}
              creation_mode={this.props.creationMode}
              already_in_collection={this.props.data.isInCollection()}
              handleSave={this.save}
              handleDestroy={this.destroy}
              topRightAction={
                <Seen
                  creation_mode={this.props.creationMode}
                  seen={this.props.data.hasBeenSeen()}
                  handleClick={_ => this.switchSeen()}
                  addToLayout={this.addToLayout}
                />
              }
            />
          </Paper>
        </div>
        <Footer
          title={this.title}
          tmdbId={this.props.data.getPublicId()}
          muiTheme={this.props.muiTheme}
          release_date={this.release_date}
          addToLayout={this.addToLayout}
        />
      </div>
    );
  }
  
}

const Footer = ({ title, tmdbId, muiTheme, release_date, addToLayout }) => (
  <div
    className="title"
    style={{color: muiTheme.palette.textColor}}
  >
    <div ref={el => addToLayout('year', el)}>{release_date}</div>
    <Link
      to={publicRoot + tmdbId}
      target="_blank"
      ref={el => addToLayout('title', el)}
    >
      {title}
      </Link>
  </div>
);

const Seen = ({ seen, handleClick, creation_mode, addToLayout }) => {
  if (creation_mode) {
    return null;
  }
  const color = seen ? 'green' : 'red';
  return (
    <ImageEye
      style={{color}}
      onClick={handleClick}
      ref={el => addToLayout('seen', el)}
    />
  );
};

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
    create: (collection, element) => {
      dispatch(addElement('movies', collection, element));
    },
    destroy: (collection, element) => {
      dispatch(removeElement('movies', collection, element));
    },
    switchSeen: data => dispatch(switchSeenOnElement(data))
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(muiThemeable()(Movie));