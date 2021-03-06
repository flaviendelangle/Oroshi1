import { collectionContent, collections } from '../../services/titles/api'
import { sort, search } from '../../services/titles/data'
import { layout } from '../../services/titles/interface'
import tM from '../../services/content/type'
import { getValue } from '../../services/localstorage'
import Element from '../../services/content/element'

import { setSortParameters, setLayoutParameters } from '../../scenes/Collection/utils'
import * as contentManager from '../../scenes/Collection/CollectionContent/content_manager'


const generateDefaultState = (type) => {
  const getter = tM.read(type)
  const GridGenerator = getter.grid()
  const StreamGenerator = getter.stream()

  const { defaultOrder } = getter.sort_options()

  return {
    content: [],
    isContentLoaded: false,
    query: '',
    layout: getValue(`layout_${type}`) || 'grid',
    order: getValue(`order_${type}`) || defaultOrder,
    stream: new StreamGenerator(),
    grid: new GridGenerator(),
  }
}

const reducer = (_state, action) => {
  const { meta: { type } } = action
  const state = _state || generateDefaultState(type)

  const getter = tM.read(type)
  const GridGenerator = getter.grid()
  const StreamGenerator = getter.stream()
  const { defaultOrder } = getter.sort_options()

  switch (action.type) {
    /**
     * The collection has been loaded
     */
    case `${collectionContent.load}_FULFILLED`: {
      if (!action.payload) {
        return state
      }
      const newContent = Element.sortList(
        action.payload.content,
        state.order.grid,
      )
      return {
        ...state,
        isContentLoaded: true,
        content: newContent,
        stream: new StreamGenerator(newContent, state.query, state.order.stream),
        grid: new GridGenerator(newContent, state.query),
        autoComplete: Element.buildAutoComplete(newContent, state.order.stream),
      }
    }

    /**
     * An element has been added to the collection
     */
    case `${collections.add}_FULFILLED`: {
      const newContent = contentManager.add(state.content, action.payload, state.order.grid)

      return {
        ...state,
        content: newContent,
        stream: new StreamGenerator(newContent, state.query, state.order.stream),
        grid: new GridGenerator(newContent, state.query),
        autoComplete: Element.buildAutoComplete(newContent, state.order.stream),
      }
    }

    /**
     * An element has been removed from the collection
     */
    case `${collections.remove}_FULFILLED`: {
      const newContent = contentManager.remove(state.content, action.payload)

      return {
        ...state,
        content: newContent,
        stream: new StreamGenerator(newContent, state.query, state.order.stream),
        grid: new GridGenerator(newContent, state.query),
        autoComplete: Element.buildAutoComplete(newContent, state.order.stream),
      }
    }

    /**
     * An element has been updated in the collection (ex : Not (Seen) => Seen)
     */
    case `${collections.update}_FULFILLED`: {
      const newContent = contentManager.update(state.content, action.payload)

      return {
        ...state,
        content: newContent,
        stream: new StreamGenerator(newContent, state.query, state.order.stream),
        grid: new GridGenerator(newContent, state.query),
        autoComplete: Element.buildAutoComplete(newContent, state.order.stream),
      }
    }


    /**
     * The order of the elements has been updated (check OrderMenu component)
     */
    case sort.update: {
      setSortParameters(type, action.parameters, defaultOrder)
      const newContent = (action.parameters.layout === 'grid') ?
        Element.sortList(state.content, action.parameters) :
        state.content
      const newOrder = {
        ...state.order,
        [action.parameters.layout]: action.parameters,
      }
      return {
        ...state,
        order: newOrder,
        content: newContent,
        stream: new StreamGenerator(newContent, state.query, newOrder.stream),
        grid: new GridGenerator(newContent, state.query),
        autoComplete: Element.buildAutoComplete(newContent, newOrder.stream),
        update: Math.random(),
      }
    }

    /**
     * The search query has been updated (check Header's Search component)
     */
    case search.update_query: {
      return {
        ...state,
        query: action.query,
        stream: new StreamGenerator(state.content, action.query, state.order.stream),
        grid: new GridGenerator(state.content, action.query),
      }
    }

    /**
     * The layout in which we want to see the elements has been updated
     */
    case layout.update: {
      setLayoutParameters(type, action.layout)
      return {
        ...state,
        query: '',
        layout: action.layout,
      }
    }

    default:
      return state
  }
}

export default reducer
