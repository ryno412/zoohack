import types from './types';

const initialState = {
  loading: false,
  data: [],
  errors: {}
};


// const initialState = {
//     loading: false,
//     data: [{"_id": "59c745f85b042600047ae2e1", "phone": "+17605225669", "FromCity": "ESCONDIDO", "FromCountry": "US", "__v": 2, "chatPrompt": "reportType", "name": "Foo", "reports": [{"_id": "59c7460c5b042600047ae2e2", "FromCountry": "US", "FromCity": "ESCONDIDO", "bird": "root", "reportType": "bird", "location": "hill", "tag": "i", "image": "https://api.twilio.com/2010-04-01/Accounts/AC05e5e36cdd8805d91483a43ffdba1ca3/Messages/MM3e0570c6a2011124645f23c7eaa98d98/Media/ME93305b9b648ea6eedda5211f52e9b0d2", "imageMeta": [{"description": "fauna", "score": 0.9179540872573853, "_id": "59c7462d5b042600047ae2ec"}, {"description": "horse", "score": 0.8859485983848572, "_id": "59c7462d5b042600047ae2eb"}, {"description": "horse like mammal", "score": 0.8145062327384949, "_id": "59c7462d5b042600047ae2ea"}, {"description": "snout", "score": 0.7873151302337646, "_id": "59c7462d5b042600047ae2e9"}, {"description": "mane", "score": 0.7227963805198669, "_id": "59c7462d5b042600047ae2e8"}, {"description": "wildlife", "score": 0.7131481766700745, "_id": "59c7462d5b042600047ae2e7"}, {"description": "stallion", "score": 0.6409427523612976, "_id": "59c7462d5b042600047ae2e6"}, {"description": "horse supplies", "score": 0.5868724584579468, "_id": "59c7462d5b042600047ae2e5"}, {"description": "mustang horse", "score": 0.5660412311553955, "_id": "59c7462d5b042600047ae2e4"}, {"description": "pack animal", "score": 0.5595470666885376, "_id": "59c7462d5b042600047ae2e3"} ] } ] } ],
//     errors: {}
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
