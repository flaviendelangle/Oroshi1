import API  from './index'
import { MoviesClass } from './movies'

class MovieCollections extends API {
  config = {
    root: '/movie_collections',
  }

  nestedRoutes = {
    movies: MoviesClass,
  }

  settings = (pk) => {
    if (pk) {
      return super.detailRoute(pk, 'settings')
    }
    return super.listRoute('settings')
  }
}


export const MovieCollectionsAPI = new MovieCollections()
export const MovieCollectionsClass = MovieCollections
