import types from './types';

const initialState = {
  loading: false,
  data: [],
  errors: {}
};

const data = (state = initialState, action) => {
  switch (action.type) {
    case types.INIT_FETCH_DATA:
      return Object.assign({}, state, {
        loading: true
      });
    case types.FETCH_DATA_SUCCESS:
      return Object.assign({}, state, {
        loading: false
      });
    case types.FETCH_DATA_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        errors: action.errors
      });
    case types.SET_DATA:
      return Object.assign({}, state, {
        data: action.data
      });
    default:
      return state;
  }
};

export default data;
