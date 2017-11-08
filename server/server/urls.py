from django.conf.urls import include, url
from django.contrib import admin

from rest_framework_extensions.routers import ExtendedSimpleRouter

from api.MovieCollections.views import MovieCollectionsViewSet
from api.Directors.views import DirectorsViewSet
from api.Genres.views import GenresViewSet
from api.Movies.views import MoviesViewSet, CollectionMoviesViewSet

router = ExtendedSimpleRouter()

movie_collections_routes = router.register(r'^movie_collections', MovieCollectionsViewSet, base_name="movie_collections")
router.register(r'^directors', DirectorsViewSet, base_name="directors")
router.register(r'^genres', GenresViewSet, base_name="genres")
router.register(r'^movies', MoviesViewSet, base_name="movies")

movie_collections_routes.register(r'movies', CollectionMoviesViewSet,
                        base_name="collection_movies",
                        parents_query_lookups=["collection_movies"])

urlpatterns = [
    url(r'^api/', include(router.urls)),
    #url(r'^admin/', admin.site.urls),
]
