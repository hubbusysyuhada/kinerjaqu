const {decoding} = require('../helpers/jwt')

function authentication (req, res, next) {
    try {
        console.log('enter here');
        console.log(req.headers, '<<< req.headers');
        const token = req.headers.authorization.split('Bearer ')[1]
        console.log('token:', token);
        if (token) {
            req.loggedUser = decoding(token)
            next()
        }
    } catch (error) {
        console.log('masuk error 14', error);
        next({
            name: 'custom error',
            code: 403,
            message: 'forbidden'
        })
    }
}

function authorization (req, res, next) {
    try {
        const token = req.headers.authorization.split('Bearer ')[1]
        if (!token) throw new Error()
        const decoded = decoding(token)
        const {loggedUser} = req
        if (decoded.id === loggedUser.id) next()
        else throw new Error()
    } catch (error) {
        next({
            name: 'custom error',
            code: 401,
            message: 'unauthorized'
        })
    }
}

module.exports = {
    authentication,
    authorization
}