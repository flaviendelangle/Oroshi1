import { search } from '../../../../services/titles/data'

// eslint-disable-next-line import/prefer-default-export
export const update = (type, collection, query) => ({
  type: search.update_query,
  query,
  meta: {
    type,
    collection,
  },
})
