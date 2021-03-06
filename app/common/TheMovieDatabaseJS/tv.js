import API from './base'


class TV extends API {
  CONFIG = {
    root: '/tv',
    routes: {
      account_states: 'account_states',
      alternative_titles: 'alternative_titles',
      changes: 'changes',
      content_ratings: 'content_ratings',
      credits: 'credits',
      external_ids: 'external_ids',
      images: 'images',
      keywords: 'keywords',
      recommendations: 'recommendations',
      screened_theatrically: 'screened_theatrically',
      similar: 'similar',
      translations: 'translations',
      videos: 'videos',

      rating: 'rating',

      latest: 'latest',
      airing_today: 'airing_today',
      on_the_air: 'on_the_air',
      popular: 'popular',
      top_rated: 'top_rated',
    },
  }

  details = (pk, options = {}) => (
    super.retrieve(pk, options)
  )

  accountStates = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.account_states, options)
  )

  alternativeTitles = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.alternative_titles, options)
  )

  changes = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.changes, options)
  )

  contentRatings = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.content_ratings, options)
  )

  credits = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.credits, options)
  )

  externalIDs = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.external_ids, options)
  )

  images = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.images, options)
  )

  keywords = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.keywords, options)
  )

  recommendations = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.recommendations, options)
  )

  screenedTheatrically = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.screened_theatrically, options)
  )

  similarTVShows = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.similar, options)
  )

  translations = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.translations, options)
  )

  videos = (pk, options = {}) => (
    super.detailRoute(pk, this.CONFIG.routes.videos, options)
  )

  latest = (options = {}) => (
    super.listRoute(this.CONFIG.routes.latest, options)
  )

  airingToday = (options = {}) => (
    super.listRoute(this.CONFIG.routes.airing_today, options)
  )

  onTheAir = (options = {}) => (
    super.listRoute(this.CONFIG.routes.on_the_air, options)
  )

  popular = (options = {}) => (
    super.listRoute(this.CONFIG.routes.popular, options)
  )

  topRated = (options = {}) => (
    super.listRoute(this.CONFIG.routes.top_rated, options)
  )

  GET = {

    details: this.details,
    accountStates: this.accountStates,
    alternativeTitles: this.alternativeTitles,
    changes: this.changes,
    contentRatings: this.contentRatings,
    credits: this.credits,
    externalIds: this.externalIDs,
    images: this.images,
    keywords: this.keywords,
    recommendations: this.recommendations,
    screenedTheatrically: this.screenedTheatrically,
    similarTVShows: this.similarTVShows,
    translations: this.translations,
    videos: this.videos,
    latest: this.latest,
    airingToday: this.airingToday,
    onTheAir: this.onTheAir,
    popular: this.popular,
    topRated: this.topRated,

  }


  POST = {
    rating: (pk, options = {}) => (
      super.detailRoute(pk, this.CONFIG.routes.rating, options, 'POST')
    ),
  }

  DELETE = {
    rating: (pk, options = {}) => (
      super.detailRoute(pk, this.CONFIG.routes.rating, options, 'DELETE')
    ),
  }
}

export default new TV()
