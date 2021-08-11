const { Account, sequelize } = require('../models')
const { validatePassword } = require('../helpers/bcrypt')
const { encoding } = require('../helpers/jwt')
const {sendConfirmationEmail} = require('../helpers/confirmation')
const moment = require('moment')

class UserController {
    static async login (req, res, next) {
        const {email, password} = req.body
        const user = await Account.findOne({where: {email}})
        if (user) {
            const passCompare = validatePassword(password, user.password)
            if (!user.isActive && passCompare) return next ({
                name: 'custom error',
                code: 403,
                message: `please verify your email first/${user.id}`
            })
            if (passCompare) return res.status(200).json({
                id: user.id,
                name: user.name,
                token: encoding({
                    id: user.id,
                    email,
                    name: user.name,
                    birthdate: user.birthdate
                })
            })
        }
        return next({
            name: 'custom error',
            code: 400,
            message: 'Invalid email/password'
        })
    }
    
    static async register (req, res, next) {
        const { email, name, password, securityQuestion, securityAnswer, birthdate } = req.body
        console.log({ email, name, password, securityQuestion, securityAnswer, birthdate });
        if (!email || !name || !password || !securityAnswer || !securityQuestion || !birthdate) return next({
            name: 'custom error',
            code: 400,
            message: 'All field are required'
        })
        const params = {...req.body, birthdate: moment(req.body.birthdate, "YYYYMMDD")}
        const uniqueEmailCheck = await Account.count({where: {email}})
        if (uniqueEmailCheck) return next({
            name: 'custom error',
            code: 400,
            message: 'email already exist'
        })
        await sequelize.transaction(async transaction => {
            const registered = await Account.create(params, {transaction})
            if (registered) {
                sendConfirmationEmail(email, registered.activationCode)
                return res.status(201).json({
                    id: registered.id,
                    name,
                    email,
                    message: 'Please check your email for verification'
                })
            }
        })
        return next({
            name: 'custom error',
            code: 500,
            message: 'internal server error'
        })
    }

    static async emailActivation (req, res, next) {
        const { accountId } = req.params
        const { code } = req.body
        const user = await Account.findByPk(accountId)
        if (user) {
            const check = code === user.activationCode
            if (check) {
                await Account.update({...user, isActive: true}, {where: {id: accountId}})
                return res.status(200).json({
                    message: "email activated.",
                    id: user.id,
                    name: user.name,
                    token: encoding({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        birthdate: user.birthdate
                    })
                })
            }
            return next({
                name: 'custom error',
                code: 400,
                message: 'Invalid code'
            })
        }
        return next({
            name: 'custom error',
            code: 400,
            message: 'Invalid id'
        })
    }

    static async birthdateCheck (req, res, next) {
        const { birthdate, email } = req.body
        const user = await Account.findOne({where: {email}})
        if (user) {
            const check = moment(birthdate).isSame(moment(user.birthdate), 'day')
            if (check) {
                return res.status(200).json({
                    id: user.id,
                    securityAnswer: user.securityAnswer,
                    securityQuestion: user.securityQuestion
                })
            }
        }
        return next({
            name: 'custom error',
            code: 400,
            message: 'Invalid email'
        })
    }

    static async changePassword (req, res, next) {
        const { accountId } = req.params
        const { newPassword, securityAnswer } = req.body
        const user = await Account.findByPk(accountId)
        if (user) {
            const securityAnswerCheck = securityAnswer === user.securityAnswer
            if (securityAnswerCheck) {
                await Account.update({
                    password: newPassword
                },
                {
                    where: { id: accountId },
                    individualHooks: true
                })
                return res.status(200).json({status: "ok"})
            }
            return next({
                name: 'custom error',
                code: 400,
                message: 'Invalid security answer'
            })
        }
        return next({
            name: 'custom error',
            code: 400,
            message: 'Invalid id'
        })
    }

    static async resendMail (req, res, next) {
        const { accountId } = req.params
        const user = await Account.findByPk(accountId)
        if (!user) return next({
            name: 'custom error',
            code: 404,
            message: 'user not found'
        })
        await sendConfirmationEmail(user.email, user.activationCode)
        return res.status(200).json({status: "ok"})
    }
}

module.exports = UserController