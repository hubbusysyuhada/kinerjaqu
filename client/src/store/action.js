import axios from '../helpers/axios'

export const USER_REGISTER = payload => {
    return async dispatch => {
        try {
            const { data } = await axios.post('/register', payload)
            console.log('data:', data);
            return dispatch({type: 'auth/register', payload: data})
        } catch (error) {
            const { data, status: code } = error.response
            console.log({
                error: data,
                code
            });
            if (code === 400) return dispatch({
                type: 'auth/uniqueEmailError'
            })
            return dispatch({type: 'auth/invalid'})
        }
    }
}

export const GIVE_USER_REDUX = payload => {
    return dispatch => {
        return dispatch({type: 'auth/login', payload})
    }
}

export const USER_LOGIN = payload => {
    return async (dispatch) => {
        try {
            const { data } = await axios.post('/login', payload)
            console.log('data:', data);
            return dispatch({type: 'auth/login', payload: data})
        } catch (error) {
            const { data, status: code } = error.response
            console.log({
                error: data,
                code
            });
            if (code === 403) return dispatch({
                type: 'auth/verificationError',
                payload: data.message.split('/')[1]
            })
            return dispatch({type: 'auth/invalid'})
        }
    }
}

export const USER_LOGOUT = () => {
    return dispatch => {
        dispatch({type: 'auth/logout'})
        dispatch({type: 'task/clear'})
    }
}

export const CLEAR_ERROR = () => {
    return dispatch => {
        dispatch({type: 'auth/clearError'})
    }
}

export const RELOGIN = () => {
    return dispatch => {
        dispatch({type: 'auth/relogin'})
    }
}

export const USER_VERIFICATION = (accountId, code) => {
    return async dispatch => {
        try {
            const { data } = await axios.patch(`/verify/${accountId}`, {code})
            console.log('data:', data);
            return dispatch({type: 'auth/verify', payload: {
                id: accountId,
                name: data.name,
                token: data.token
            }})
        } catch (error) {
            const { data, status: code } = error.response
            console.log({
                error: data,
                code
            });
            return dispatch({type: 'auth/invalid'})
        }
    }
}

export const BIRTHDATE_CHECK = payload => {
    return async dispatch => {
        try {
            const { data } = await axios.post('/birthdate', payload)
            console.log('data:', data);
            return dispatch({type: 'auth/verifyBirthdate', payload: data})
        } catch (error) {
            const { data, status: code } = error.response
            console.log({
                error: data,
                code
            });
            return dispatch({type: 'auth/invalidDate', error: data, code})
        }
    }
}

export const CHANGE_PASSWORD = payload => {
    return async dispatch => {
        try {
            const { data } = await axios.post(`/change-password/${payload.id}`, payload)
            console.log('data:', data);
            return dispatch({type: 'auth/changePassword'})
        } catch (error) {
            const { data, status: code } = error.response
            console.log({
                error: data,
                code
            });
            if (code === 400) return dispatch({
                type: 'auth/changePasswordError'
            })
            return dispatch({type: 'auth/invalid', error: data, code})
        }
    }
}

export const TASK_FETCH = token => {
    return async dispatch => {
        const {data} = await axios.get('/task', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        data.forEach(task => {
            task.tanggal = parseDate(task.tanggal)
            task.deadline = parseDate(task.deadline)
        })
        console.log('data:', data);
        dispatch({type: 'task/fetch', payload: data})
    }
}

export const PATCH_STATUS = (task, status, token) => {
    return async dispatch => {
        axios.patch(`/task/${task.id}`, {
            status
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        task.status = status
        dispatch({type: 'task/patch', payload: task})
    }
}

export const DELETE_TASK = (task, token) => {
    return async dispatch => {
        const {data} = axios.delete(`/task/${task.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch({type: 'task/delete', payload: task})
    }
}

export const DELETE_INPUT = (task, token) => {
    return async dispatch => {
        const {data} = axios.delete(`/task/${task.id}/input`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch({type: 'task/deleteInput', payload: task})
    }
}

export const DELETE_OUTPUT = (task, token) => {
    return async dispatch => {
        const {data} = axios.delete(`/task/${task.id}/hasil`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch({type: 'task/deleteOutput', payload: task})
    }
}

export const NEW_TASK = (payload, token) => {
    return async dispatch => {
        payload.deadline = parseDate(payload.deadline)
        payload.tanggal = parseDate(payload.tanggal)
        await axios.post('/task', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const {data} = await axios.get('/task', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        data.forEach(task => {
            task.tanggal = parseDate(task.tanggal)
            task.deadline = parseDate(task.deadline)
        })
        dispatch({type: 'task/fetch', payload: data})
    }
}

export const EDIT_TASK = (payload, token) => {
    return dispatch => {
        axios.put(`/task/${payload.id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        payload.deadline = parseDate(payload.deadline)
        payload.tanggal = parseDate(payload.tanggal)
        dispatch({type: 'task/put', payload})
    }
}

export const UPLOAD_FILE = (payload, token) => {
    payload.type = payload.type.toLowerCase()
    if (payload.type === 'output') payload.type = 'hasil'
    return async dispatch => {
        dispatch({type: 'task/uploading'})
        const { data } = await axios.post(`/task/${payload.id}/${payload.type}`,
        payload.formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        payload = {
            ...payload,
            data
        }
        dispatch({type: 'task/uploaded', payload})
    }
}

const parseDate = (fullDate) => {
    const parse = new Date(fullDate)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = months[parse.getMonth()]
    const date = parse.getDate()
    const year = parse.getFullYear()
    return `${date} ${month} ${year}`
}