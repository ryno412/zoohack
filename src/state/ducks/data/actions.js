import types from './types';
const apiUrl =
  process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000/';

export const initFetchData = () => {
  return {
    type: types.INIT_FETCH_DATA
  };
};

export const fetchDataSuccess = () => {
  return {
    type: types.FETCH_DATA_SUCCESS
  };
};

export const fetchDataFailure = error => {
  return {
    type: types.FETCH_DATA_FAILURE,
    error: error
  };
};

export const fetchData = id => {
  return dispatch => {
    dispatch(initFetchData());
    const params = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`${apiUrl}results`, params)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(res => {
        if (res.results) {
          dispatch(setData(res.results));
          dispatch(fetchDataSuccess());
        } else {
          dispatch(fetchDataFailure(res.error));
        }
      });
  };
};

export const setData = data => {
  return {
    type: types.SET_DATA,
    data: data
  };
};

export default {
  initFetchData,
  fetchDataSuccess,
  fetchDataFailure,
  fetchData,
  setData
};
