import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

export{
    postSignup,
    postSignin,
    getUser,
    getSignout,
    getVerify,
} from './user';