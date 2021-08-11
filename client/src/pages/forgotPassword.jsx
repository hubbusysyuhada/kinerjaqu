import React, { useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import {
    Grid,
    Divider,
    TextField,
    Button,
    Snackbar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    Paper
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import MuiAlert from '@material-ui/lab/Alert';
import Image1 from '../assets/background1.jpg'
import Image2 from '../assets/background2.jpg'
import Image3 from '../assets/background3.jpg'
import { purple } from '@material-ui/core/colors'
import { BIRTHDATE_CHECK, CHANGE_PASSWORD } from '../store/action'

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

export default function ForgotPassword () {
    const [validate, setValidate] = useState(false)
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
            height: validate ? '45vh' : '40vh',
            margin: 'auto',
            backgroundColor: 'white',
            opacity: 0.7,
            textAlign: 'center',
            borderRadius: '20px'
        }
    })
    const style = useStyle()
    const dispatch = useDispatch()
    const history = useHistory()
    const user_redux = useSelector(state => state.AuthReducer)
    const [openBirthdateError, setOpenBirthdateError] = useState(false)
    const [openNewPasswordError, setOpenNewPasswordError] = useState(false)
    const [openValidationError, setOpenValidationError] = useState(false)
    const [openServerError, setOpenServerError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [userInput, setUserInput] = useState({
        email: '',
        newPassword: '',
        confirmNewPassword: '',
        birthdate: '',
        securityAnswer: ''
    })

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenBirthdateError(false);
        setOpenValidationError(false)
        setOpenNewPasswordError(false)
        setOpenServerError(false)
        setOpenSuccess(false)
    };

    const checkBirthdate = async event => {
        event.preventDefault()
        const { payload, error } = await dispatch(BIRTHDATE_CHECK({
            email: userInput.email,
            birthdate: userInput.birthdate
        }))
        if (payload) {
            const temp = JSON.parse(JSON.stringify(userInput))
            temp.birthdate = ''
            temp.email = ''
            setUserInput(temp)
            setValidate(true)
        }
        else if (error) setOpenBirthdateError(true)
    }

    const changePassword = async event => {
        event.preventDefault()
        const check = userInput.securityAnswer === user_redux.securityAnswer
        if (userInput.newPassword !== userInput.confirmNewPassword) return setOpenNewPasswordError(true)
        else if (!check) return setOpenValidationError(true)
        const { error } = await dispatch(CHANGE_PASSWORD({
            newPassword: userInput.newPassword,
            securityAnswer: userInput.securityAnswer,
            id: user_redux.id
        }))
        if (error) return setOpenServerError(true)
        setOpenSuccess(true)
        setTimeout(() => {
            history.push('/auth')
        }, 2000);

    }

    return (
        <div className={style.body}>
            <Grid container spacing={3} className={style.container}>
                <Grid className={style.form}>
                    {
                        validate
                        ?
                        <div>
                            <h1 className={style.text}> CHANGE PASSWORD </h1>
                            <Divider className={style.divider}/>
                            <TextField
                                size="small"
                                id="security-answer"
                                type="text"
                                name="Security Answer"
                                label={user_redux.securityQuestion}
                                value={userInput.securityAnswer}
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => setUserInput({
                                    ...userInput, securityAnswer: e.target.value
                                })}
                            />
                            <TextField
                                size="small"
                                type="password"
                                name="New Password"
                                label="New Password"
                                value={userInput.newPassword}
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => setUserInput({
                                    ...userInput, newPassword: e.target.value
                                })}
                            />
                            <TextField
                                size="small"
                                type="password"
                                name="Confirm New Password"
                                label="Confirm New Password"
                                value={userInput.confirmNewPassword}
                                variant="outlined"
                                className={style.input}
                                onChange={(e) => setUserInput({
                                    ...userInput, confirmNewPassword: e.target.value
                                })}
                            />
                            <br/>
                            <ColorButton variant="contained" color="primary" onClick={changePassword}>Change Password</ColorButton>
                            <p className={style.text}>Click <a href="/" onClick={(e) => {
                                e.preventDefault()
                                history.push('/auth')
                            }}>here</a> to login</p>
                            <p className={style.footer}>©hubbusysyuhada</p>
                        </div>
                        :
                        <div>
                            <h1 className={style.text}> FORGOT PASSWORD </h1>
                            <Divider className={style.divider}/>
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
                                type="date"
                                name="Birthdate"
                                label="Birthdate"
                                InputLabelProps={{shrink: true}}
                                variant="outlined"
                                value={userInput.birthdate}
                                className={style.input}
                                onChange={(e) => {
                                    setUserInput({
                                        ...userInput, birthdate: e.target.value
                                    })
                                }}
                            />
                            <br/>
                            <ColorButton variant="contained" color="primary" onClick={checkBirthdate}>Check</ColorButton>
                            <p className={style.text}>Click <a href="/" onClick={(e) => {
                                e.preventDefault()
                                history.push('/auth')
                            }}>here</a> to login</p>
                            <p className={style.footer}>©hubbusysyuhada</p>
                        </div>
                    }
                    
                </Grid>
            </Grid>
            <Snackbar open={openBirthdateError} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                Invalid Email/Birthdate
                </Alert>
            </Snackbar>
            <Snackbar open={openNewPasswordError} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                New Password does not match!
                </Alert>
            </Snackbar>
            <Snackbar open={openValidationError} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                Wrong security answer!
                </Alert>
            </Snackbar>
            <Snackbar open={openServerError} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                Internal server error
                </Alert>
            </Snackbar>
            <Snackbar open={openSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="success">
                    Password changed! Redirecting to log in...
                </Alert>
            </Snackbar>
        </div>
    )
}