import { MoviesAPI } from 'services/api/movies'
import { MovieCollectionsAPI } from 'services/api/movieCollections'
import MoviesTMDB from 'services/TheMovieDatabaseJS/movies'
import MovieClass from './elementClass'

import * as tmdb from 'services/actions/collections/tmdb'
import { updateElement } from 'services/actions/collections'


export const elementClass = MovieClass

export const collectionAPI = MovieCollectionsAPI

export const elementAPI = MoviesAPI

export const publicAPI = MoviesTMDB

export const {
  addElement,
  getSuggestions,
} = tmdb

export const switchSeenOnElement = (element) => {
  const data = {
    seen: !element.hasBeenSeen(),
  }
  return updateElement('movies', element, data, 'seen')
}

export const prepareElement = (element, seenList) => {
  const seen = !!(seenList.find(el => el.movie === element.getID()))
  element.setSeen(seen)
}

export const addSeenToElements = (elements, seen) => elements.map((element) => {
  const matches = seen.find(el => el.movie === element.pk)
  return {
    ...element,
    seen: !!matches,
  }
})

export const exportFields = ['tmdbId', 'title', 'release', 'note', 'seen']
