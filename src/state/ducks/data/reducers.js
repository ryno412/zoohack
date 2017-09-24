import types from './types';

// const initialState = {
//   loading: false,
//   data: [],
//   errors: {}
// };


const initialState = {
    loading: false,
    data: [{"_id":"59c77b5de6a40a000467f058","phone":"+17605225669","FromCity":"ESCONDIDO","FromCountry":"US","__v":2,"chatPrompt":"reportDone","name":"Ryan ","reports":[{"_id":"59c77b71e6a40a000467f059","FromCountry":"US","FromCity":"ESCONDIDO","bird":"macaw","reportType":"bird","location":"by the hill","tag":"no","image":"https://api.twilio.com/2010-04-01/Accounts/AC05e5e36cdd8805d91483a43ffdba1ca3/Messages/MMbfd737d8b6e0d477ef12c769174d4caf/Media/MEb3be58cd5ab18a94246e96006a7062fd","imageMeta":[{"description":"fauna","score":0.9179540276527405,"_id":"59c77b91e6a40a000467f063"},{"description":"horse","score":0.8859485983848572,"_id":"59c77b91e6a40a000467f062"},{"description":"horse like mammal","score":0.8145063519477844,"_id":"59c77b91e6a40a000467f061"},{"description":"snout","score":0.7873151302337646,"_id":"59c77b91e6a40a000467f060"},{"description":"mane","score":0.7227963805198669,"_id":"59c77b91e6a40a000467f05f"},{"description":"wildlife","score":0.7131481766700745,"_id":"59c77b91e6a40a000467f05e"},{"description":"stallion","score":0.6409426927566528,"_id":"59c77b91e6a40a000467f05d"},{"description":"horse supplies","score":0.5868722200393677,"_id":"59c77b91e6a40a000467f05c"},{"description":"mustang horse","score":0.5660413503646851,"_id":"59c77b91e6a40a000467f05b"},{"description":"pack animal","score":0.5595472455024719,"_id":"59c77b91e6a40a000467f05a"}]}]}],    errors: {}
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
