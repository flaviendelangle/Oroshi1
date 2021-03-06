import { readAsText } from 'promise-file-reader'
import json2csv from 'json2csv'
import downloadjs from 'downloadjs'

import * as titles from '../../titles/api'
import { collections } from '../../titles/exports'
import { search } from '../../titles/data'
import { source } from '../../titles/interface'

import { getCollectionAPI, getElementClass } from '../../content/collectionTypes'
import tM from '../../content/type'
import { parseCSV, parseJSON } from '../../utils'
import { pickElement } from '../../languages'
import { CollectionsAPI } from '../../api/collections'
import { checkExistence } from '../publicAPI'


/*
  ACTIONS WITHOUT DISPATCH
 */
export const addSeenToElements = (type, elements, seen) => (
  tM.run(type).local().addSeenToElements(elements, seen)
)

export const addCollectionToElement = (element, collection) => ({
  ...element,
  collection,
})

export const prepareElements = (type, data) => {
  const { content, seen, ...clearedData } = data
  const Element = getElementClass(type)
  const elements = content.map(el => new Element(el))
  elements.forEach((el) => {
    el.setCollection(clearedData)
    tM.run(type).local().prepareElement(el, seen)
  })

  return {
    ...data,
    content: elements,
  }
}


/*
  ACTIONS WITH DISPATCH
 */
export const switchAddingMode = (type, collection) => ({
  type: source.updateIsAdding,
  meta: {
    type,
    collection,
  },
})

export const create = (type, data) => ({
  type: titles.collectionContent.create,
  payload: getCollectionAPI(type).create(data),
  meta: {
    type,
  },
})

export const destroy = (type, collection) => ({
  type: titles.collections.destroy,
  payload: getCollectionAPI(type).destroy(collection.pk),
})

export const get = (type, collection) => ({
  type: titles.collectionContent.load,
  payload: getCollectionAPI(type).retrieve(collection.pk)
    .then(response => prepareElements(type, response))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.toString())
      return undefined
    }),
  meta: {
    type,
    collection,
  },
})

export const getAll = pk => ({
  type: titles.collectionContent.loadAllSettings,
  payload: CollectionsAPI.settings(pk),
})

export const getSettings = (type, collection) => ({
  type: titles.collectionContent.loadSettings,
  payload: getCollectionAPI(type).settings(collection.pk),
  meta: {
    type,
    collection,
  },
})

export const getSuggestions = (type, collection, publicId) => ({
  type: titles.collectionContent.loadSuggestions,
  payload: tM.run(type).local().getSuggestions(type, collection, publicId),
  meta: {
    type,
    collection,
  },
})

export const update = (type, collection, data) => ({
  type: titles.collections.updateSettings,
  payload: getCollectionAPI(type).partialUpdate(collection.pk, data),
  meta: {
    type,
    collection,
  },
})

export const updateField = (type, pk, field, value) => {
  const data = {
    [field]: value,
  }
  return update(type, pk, data)
}

export const updateCover = (type, collection, element, position) => ({
  type: titles.collections.updateSettings,
  payload: getCollectionAPI(type)
    .updateCover(collection.pk, element.getID(), position),
  meta: {
    type,
    collection,
  },
})

export const addElement = (type, collection, element) => ({
  type: titles.collections.add,
  payload: tM.run(type).local().addElement(type, collection, element),
  meta: {
    type,
    collection,
  },
})

export const updateElement = (type, element, data, field) => {
  const collection = element.getCollection()
  const pk = element.getID()
  return {
    type: titles.collections.update,
    payload: getCollectionAPI(type)
      .element(collection.pk)[type]
      .partialUpdate(pk, data)
      .then(() => {
        element.editLocal(data)
        return element
      }),
    meta: {
      type,
      collection,
      field,
    },
  }
}

export const removeElement = (type, collection, element) => {
  const api = getCollectionAPI(type).element(collection.pk)[type]
  return {
    type: titles.collections.remove,
    payload: api.destroy(element.getID()).then(() => {
      element.setInCollection(false)
      return element
    }),
    meta: {
      type,
      collection,
    },
  }
}

export const importCSV = (type, collection, file) => ({
  type: titles.collectionContent.importFromFile,
  payload: readAsText(file).then(result => ({
    data: parseCSV(type, result),
    format: 'csv',
  })),
  meta: {
    type,
    collection,
  },
})

export const importJSON = (type, collection, file) => ({
  type: titles.collectionContent.importFromFile,
  payload: readAsText(file).then(result => ({
    data: parseJSON(type, result),
    format: 'json',
  })),
  meta: {
    type,
    collection,
  },
})

export const importElements = (type, collection, _elements, dispatch) => {
  const importElement = (elements, index) => {
    if (elements.length <= index) {
      dispatch({
        type: `${titles.collectionContent.import}_FULFILLED`,
      })
      return true
    }
    const element = elements[index]
    if (element.isInCollection()) {
      setTimeout(() => importElement(elements, index + 1))
      return dispatch({
        type: titles.collections.add,
        payload: element,
        meta: {
          type,
          collection,
        },
      })
    }
    return addElement(type, collection, element).payload.then((el) => {
      dispatch({
        type: titles.collections.add,
        payload: el,
        meta: {
          type,
          collection,
        },
      })
      importElement(elements, index + 1)
    })
  }

  const data = {
    results: _elements,
  }

  return {
    type: titles.collectionContent.importElement,
    payload: checkExistence(type, collection, data, true).then(({ results }) => {
      const Element = getElementClass(type)
      const elements = Element.fromDistantList(results, collection)
      dispatch({
        type: `${titles.collectionContent.import}_STARTED`,
        data: elements,
      })
      importElement(elements, 0)
    }),
    meta: {
      type,
      collection,
    },
  }
}

const getDataToExport = (type, collection) => (
  get(type, collection).payload.then((data) => {
    const fields = tM.run(type).local().exportFields
    const content = data.content.map((el) => {
      const data2 = {}
      const values = el.getLocal()
      fields.forEach((field) => {
        if (field === 'title') {
          data2[field] = pickElement(values, 'titles', 'title', data.title_language)
        } else {
          data2[field] = values[field]
        }
      })
      return data2
    })
    return {
      data,
      fields,
      content,
    }
  })
)

const exportAsCSV = (type, collection) => {
  const generateComments = () => `#type, ${type}\n`
  return {
    type: collections.csv,
    payload: getDataToExport(type, collection).then(({ fields, content, data }) => {
      const csv = json2csv({ data: content, fields })
      const comments = generateComments()
      downloadjs(comments + csv, `${data.title}.csv`, 'text/csv')
      return null
    }),
  }
}

const exportAsJSON = (type, collection) => ({
  type: collections.json,
  payload: getDataToExport(type, collection).then(({ content, data }) => {
    const comments = {
      type,
    }
    const json = JSON.stringify({
      comments,
      content,
    })
    downloadjs(json, `${data.title}.json`, 'text/json')
  }),
})

export const exportCollection = (type, collection, format) => {
  switch (format) {
    case 'csv':
      return exportAsCSV(type, collection)
    case 'json':
      return exportAsJSON(type, collection)
    default:
      return null
  }
}

export const searchInCollection = (type, collection, request, elements) => ({
  type: search.compute_advanced_search,
  payload: getElementClass(type).search(request, elements),
  meta: {
    type,
    collection,
  },
})
