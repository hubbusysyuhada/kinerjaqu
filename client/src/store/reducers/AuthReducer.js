const initialState = {
}

function AuthReducer (state = initialState, action) {
    const {payload, type} = action
    switch (type) {
        case 'auth/login':
        case 'auth/verify':
            return {...state, ...payload}
        case 'auth/clearError':
            let temp = JSON.parse(JSON.stringify({...state}))
            delete temp.invalid
            delete temp.verificationError
            delete temp.uniqueError
            return temp
        case 'auth/relogin':
        case 'auth/logout':
        case 'auth/changePassword':
            return {}
        case 'auth/verificationError':
        case 'auth/register':
            return {...state, verificationError: true, id: payload}
        case 'auth/verifyBirthdate':
            return {...state,
                securityAnswer: payload.securityAnswer,
                securityQuestion: payload.securityQuestion,
                id: payload.id
            }
        case 'auth/invalid':
            return {...state, invalid: true}
        default:
            return {...state}
    }
}

export default AuthReducer