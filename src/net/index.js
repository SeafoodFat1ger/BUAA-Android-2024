import axios from "axios";
import {showFailToast} from 'vant';
import router from "../router";

const defaultError = () => showFailToast('发生了一些错误，请联系管理员')
const defaultFailure = (message) => showFailToast(message)

//封装axios的post方法

function post(url, data, success, type = 'json', failure = defaultFailure, error = defaultError) {
    axios.post(url, data, {}).then(({data}) => {
        if (data.code === 401) {
            router.push('/')
            showFailToast('请重新登录')
        } else if (data.code == 200)
            success(data.message, data.data)
        else
            failure(data.message, data.code)
    }).catch(error)
}

//封装axios的get方法
function get(url, success, failure = defaultFailure, error = defaultError) {
    axios.get(url, {}).then(({data}) => {
        if (data.code === 401) {
            router.push('/')
            showFailToast('请重新登录')
        } else if (data.code == 200)
            success(data.message, data.data)
        else
            failure(data.message, data.code)
    }).catch(error)
}


export {get, post}