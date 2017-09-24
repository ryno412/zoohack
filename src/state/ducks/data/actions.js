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
      .then(response => {
        if (response.status === 200) {
          return response.json().then(res => {
            dispatch(setData(res));
            dispatch(fetchDataSuccess());
          });
        } else {
          dispatch(fetchDataFailure(res));
        }
      })
      .catch(error => {
        dispatch(fetchDataFailure(error));
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
