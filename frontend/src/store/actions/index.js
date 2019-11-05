import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

export {
  setSendStatus,
  postSignup,
  postSignin,
  getUser,
  getSignout,
  getVerify,
  getFriend,
  deleteFriend,
  postUserSearch,
  sendFriend,
  receiveFriend,
} from './user';
