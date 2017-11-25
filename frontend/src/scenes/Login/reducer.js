import { combineReducers } from 'redux'

import { users } from 'services/titles/api'

const defaultState = {
  registerError: null
};

const main = (state = defaultState, action) => {

  switch(action.type) {
    
    case users.create + '_FULFILLED':
      if(action.payload.error) {
        return {
          registerError: action.payload.error
        }
      }
      return {
        registerError: null,
        ...state,
      };
    
    default:
      return state;
  }
};

const reducer = combineReducers({
  main,
});


export default reducer;