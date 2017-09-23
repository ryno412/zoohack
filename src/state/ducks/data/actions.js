import types from './types';
const apiUrl =
  process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000/';

export const initFetchData = () => {
  return {
    type: types.INIT_FETCH_MESSAGES
  };
};

export const fetchDataSuccess = () => {
  return {
    type: types.FETCH_MESSAGES_SUCCESS
  };
};

export const fetchDataFailure = error => {
  return {
    type: types.FETCH_MESSAGES_FAILURE,
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
    return fetch(`${apiUrl}data`, params)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(res => {
        if (res.messages) {
          dispatch(setData(res.messages));
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
