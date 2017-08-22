import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : 'iView project';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'https://demo.g9zz.com' :
    env === 'production' ?
    'https://demo.g9zz.com' :
    'https://demo.g9zz.com';

util.url = ajaxUrl;

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

export default util;