import types from './types';

const initialState = {
  loading: false,
  data: [],
  errors: {}
};


// const initialState = {
//     loading: false,
//     data: [{"_id":"59c77fc9a76c63000476e21e","phone":"+17605225669","FromCity":"ESCONDIDO","FromCountry":"US","__v":4,"chatPrompt":"reportDone","name":"Ryan ","reports":[{"_id":"59c77fd7a76c63000476e21f","FromCountry":"US","FromCity":"ESCONDIDO","bird":"macaw","reportType":"bird","location":"the hill","tag":"no","image":"https://api.twilio.com/2010-04-01/Accounts/AC05e5e36cdd8805d91483a43ffdba1ca3/Messages/MMa0f2cc85ccc658371c381328138360ba/Media/ME4f459bdd73f30e39b30c408322bf8576","imageMeta":[{"description":"fauna","score":0.9179540276527405,"_id":"59c77ff6a76c63000476e229"},{"description":"horse","score":0.885948896408081,"_id":"59c77ff6a76c63000476e228"},{"description":"horse like mammal","score":0.8145066499710083,"_id":"59c77ff6a76c63000476e227"},{"description":"snout","score":0.7873150706291199,"_id":"59c77ff6a76c63000476e226"},{"description":"mane","score":0.7227965593338013,"_id":"59c77ff6a76c63000476e225"},{"description":"wildlife","score":0.7131479978561401,"_id":"59c77ff6a76c63000476e224"},{"description":"stallion","score":0.6409427523612976,"_id":"59c77ff6a76c63000476e223"},{"description":"horse supplies","score":0.5868728160858154,"_id":"59c77ff6a76c63000476e222"},{"description":"mustang horse","score":0.5660416483879089,"_id":"59c77ff6a76c63000476e221"},{"description":"pack animal","score":0.559547483921051,"_id":"59c77ff6a76c63000476e220"}]},{"_id":"59c78024a76c63000476e22a","FromCountry":"US","FromCity":"ESCONDIDO","bird":"toucan","reportType":"nest","image":"https://api.twilio.com/2010-04-01/Accounts/AC05e5e36cdd8805d91483a43ffdba1ca3/Messages/MM13858b2ba690ba259a8d2681260fb91d/Media/ME782d3f96df2bef18bf2dbcfa9499c4c4","imageMeta":[{"description":"fauna","score":0.9324552416801453,"_id":"59c78043a76c63000476e234"},{"description":"ecosystem","score":0.8917757272720337,"_id":"59c78043a76c63000476e233"},{"description":"grass","score":0.8887433409690857,"_id":"59c78043a76c63000476e232"},{"description":"wildlife","score":0.8763430714607239,"_id":"59c78043a76c63000476e231"},{"description":"grassland","score":0.8757947683334351,"_id":"59c78043a76c63000476e230"},{"description":"pasture","score":0.7491500377655029,"_id":"59c78043a76c63000476e22f"},{"description":"tree","score":0.7308769226074219,"_id":"59c78043a76c63000476e22e"},{"description":"grass family","score":0.6980568766593933,"_id":"59c78043a76c63000476e22d"},{"description":"national park","score":0.6379550695419312,"_id":"59c78043a76c63000476e22c"},{"description":"savanna","score":0.6310446858406067,"_id":"59c78043a76c63000476e22b"}]}]}]
//
// };


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
