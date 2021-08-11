import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Grid,
    Divider,
    TextField,
    Button,
    Snackbar
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import MuiAlert from '@material-ui/lab/Alert';
import Image1 from '../assets/background1.jpg'
import Image2 from '../assets/background2.jpg'
import Image3 from '../assets/background3.jpg'
import { purple } from '@material-ui/core/colors'
import { USER_LOGIN, CLEAR_ERROR, USER_REGISTER } from '../store/action'

const randomize = Math.random()
let Image
if (randomize <= 0.33) Image = Image1
else if (0.33 < randomize && randomize <= 0.66) Image = Image2
else Image = Image3

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: purple[500],
        '&:hover': {
        backgroundColor: purple[700],
        },
},
}))(Button);

export default function Auth () {
    const [loginForm, setLoginForm] = useState(true)
    const [loading, setLoading] = useState(false)
    const useStyle = makeStyles({
        container : {
            height: '100vh',
            width: '100%',
            textAlign: 'center',
            margin: 'auto'
        },
        item: {
            margin: 'auto',
            textAlign: 'center'
        },
        divider: {
            width: "80%",
            margin: "auto",
            textAlign: "center",
            marginBottom: '20px',
            marginTop: '20px'
        },
        text : {
            fontFamily: 'monospace'
        },
        footer : {
            fontFamily: 'monospace',
            marginTop: '30px',
            fontSize: '10px'
        },
        input: {
            margin: '5px',
            width: '70%',
            textAlign: 'center'
        },
        body: {
            backgroundImage: `url(${Image})`,
            backgroundSize: '100%'
        },
        form: {
            width: '50%',
            height: loginForm ? '40vh' : '67.5vh',
            margin: 'auto',
            backgroundColor: 'white',
            opacity: 0.7,
            textAlign: 'center',
            borderRadius: '20px'
        }
    })
    const style = useStyle()
    const dispatch = useDispatch()
    const user_redux = useSelector(state => state.AuthReducer)
    const history = useHistory()
    const [openInputError, setOpenInputError] = useState(false)
    const [openError, setOpenError] = useState(false)
    const [openPasswordError, setOpenPasswordError] = useState(false)
    const [openUniqueError, setOpenUniqueError] = useState(false)
    const [openVerificationError, setOpenVerificationError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openRegSuccess, setOpenRegSuccess] = useState(false)
    const [userInput, setUserInput] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        birthdate: '',
        securityQuestion: '',
        securityAnswer: ''
    })

    useEffect(() => {
        if (localStorage.name
            &&
            localStorage.id
            &&
            localStorage.access_token) history.push('/task')
        else {
            localStorage.removeItem('id')
            localStorage.removeItem('name')
            localStorage.removeItem('access_token')
        }
    }, [])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenInputError(false)
        setOpenError(false)
        setOpenUniqueError(false)
        setOpenPasswordError(false)
        setOpenSuccess(false)
        setOpenRegSuccess(false)
    };

    const login = async (event) => {
        event.preventDefault()
        if (!userInput.email || !userInput.password) setOpenInputError(true)
        else {
            setLoading(true)
            const {type, payload} = await dispatch(USER_LOGIN({
                email: userInput.email,
                password: userInput.password
            }))
            if (type === 'auth/invalid') {
                setOpenError(true)
                setLoading(false)
            }
            else if (type === 'auth/verificationError') {
                history.push(`verify/${payload}`)
            } else if (type === 'auth/login') {
                setOpenSuccess(true)
                localStorage.name = payload.name
                localStorage.access_token = payload.token
                localStorage.id = payload.id
                setTimeout(() => {
                    history.push('/')
                }, 2000);
            }
            dispatch(CLEAR_ERROR())
        }
    }

    const register = async (event) => {
        event.preventDefault()
        setLoading(true)
        if (!userInput.email
            || !userInput.password
            || !userInput.confirmPassword
            || !userInput.birthdate
            || !userInput.securityQuestion
            || !userInput.securityAnswer) return setOpenInputError(true)
        if (userInput.password !== userInput.confirmPassword) return setOpenPasswordError(true)
        const {type, payload} = await dispatch(USER_REGISTER(userInput))
        if (type === 'auth/uniqueEmailError') setOpenUniqueError(true)
        else if (type === 'auth/register') {
            setOpenRegSuccess(true)
            setTimeout(() => {
                history.push(`/verify/${payload.id}`)
            }, 3000);
        }
        setLoading(false)
    }

    return (
        <div className={style.body}>
            <Grid container spacing={3} className={style.container}>
                <Grid className={style.form}>
                    <div>
                        <h1 className={style.text}> KINERJAQU </h1>
                    </div>
                    <Divider className={style.divider}/>
                    {
                        loginForm
                        ?
                        <div>
                            <TextField
                                size="small"
                                type="text"
                                label="Email"
                                name="Email"
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => setUserInput({
                                    ...userInput, email: e.target.value
                                })}
                            />
                            <TextField
                                size="small"
                                type="password"
                                name="Password"
                                label="Password"
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => setUserInput({
                                    ...userInput, password: e.target.value
                                })}
                            />
                            <br/>
                            <ColorButton variant="contained" color="primary" onClick={login} disabled={!!loading}>Login</ColorButton>
                            <p className={style.text}>Don't have an account? <a href="/" onClick={(e) => {
                                e.preventDefault()
                                setLoginForm(false)
                            }}>register</a></p>
                            <p className={style.text} style={{fontSize: '10px'}}><a href="/" onClick={(e) => {
                                e.preventDefault()
                                history.push('/forgot-password')
                            }}>Forgot password?</a></p>
                            <p className={style.footer}>©hubbusysyuhada</p>
                        </div>
                        :
                        <div>
                            <TextField
                                size="small"
                                type="text"
                                label="Email"
                                name="Email"
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => setUserInput({
                                    ...userInput, email: e.target.value
                                })}
                            />
                            <TextField
                                size="small"
                                type="text"
                                name="Name"
                                label="Name"
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => setUserInput({
                                    ...userInput, name: e.target.value
                                })}
                            />
                            <TextField
                                size="small"
                                type="password"
                                name="Password"
                                label="Password"
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => setUserInput({
                                    ...userInput, password: e.target.value
                                })}
                            />
                            <TextField
                                size="small"
                                type="password"
                                name="Confirm Password"
                                label="Confirm Password"
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => setUserInput({
                                    ...userInput, confirmPassword: e.target.value
                                })}
                            />
                            <TextField
                                size="small"
                                type="date"
                                name="Birthdate"
                                label="Birthdate"
                                InputLabelProps={{shrink: true}}
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => {
                                    setUserInput({
                                        ...userInput, birthdate: e.target.value
                                    })
                                }}
                            />
                            <TextField
                                size="small"
                                type="text"
                                name="Security Question"
                                label="Security Question"
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => setUserInput({
                                    ...userInput, securityQuestion: e.target.value
                                })}
                            />
                            <TextField
                                size="small"
                                type="text"
                                name="Security Answer"
                                label="Security Answer"
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => setUserInput({
                                    ...userInput, securityAnswer: e.target.value
                                })}
                            />
                            <br/>
                            <ColorButton variant="contained" color="primary" onClick={register}>Register</ColorButton>
                            <p className={style.text}>Already have an account? <a href="/" onClick={(e) => {
                                e.preventDefault()
                                setLoginForm(true)
                            }}>login</a></p>
                            <p className={style.footer}>©hubbusysyuhada</p>
                        </div>
                    }
                    
                </Grid>
            </Grid>
            <Snackbar open={openError} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                Invalid Email/Password!
                </Alert>
            </Snackbar>
            <Snackbar open={openUniqueError} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                Email already exists!
                </Alert>
            </Snackbar>
            <Snackbar open={openPasswordError} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                Password does not match!
                </Alert>
            </Snackbar>
            <Snackbar open={openInputError} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                    Please fill in all of the field
                </Alert>
            </Snackbar>
            <Snackbar open={openSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="success">
                Welcome {user_redux.name}! Redirecting...
                </Alert>
            </Snackbar>
            <Snackbar open={openRegSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="success">
                Register success! Please check your email
                </Alert>
            </Snackbar>
        </div>
    )
}