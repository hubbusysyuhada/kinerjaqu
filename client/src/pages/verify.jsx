import React, {useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
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
import { RELOGIN, USER_VERIFICATION, CLEAR_ERROR } from '../store/action'

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

export default function Verify () {
    const { accountId } = useParams()
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
            height: '40vh',
            // height: '43vh',
            margin: 'auto',
            backgroundColor: 'white',
            opacity: 0.7,
            textAlign: 'center',
            borderRadius: '20px'
        }
    })
    const user_redux = useSelector(state => state.AuthReducer)
    const style = useStyle()
    const dispatch = useDispatch()
    const history = useHistory()
    const [openError, setOpenError] = useState(false)
    const [openRegError, setOpenRegError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [disabledVerify, setDisabledVerify] = useState(false)
    const [userInput, setUserInput] = useState({
        code: ''
    })

    useEffect(() => {
        if (!user_redux.id || !accountId) history.push('/auth')
    }, [])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenError(false);
        setOpenSuccess(false);
    };

    const verify = async (e) => {
        e.preventDefault()
        setDisabledVerify(true)
        const {type, payload} = await dispatch(USER_VERIFICATION(accountId, userInput.code))
        if (type === 'auth/invalid') {
            setOpenError(true)
            setDisabledVerify(false)
        }
        else if (type === 'auth/verify') {
            localStorage.setItem('name', payload.name)
            localStorage.setItem('id', payload.id)
            localStorage.setItem('access_token', payload.token)
            setOpenSuccess(true)
            setTimeout(() => {
                history.push('/task')
            }, 2000);
        }
        dispatch(CLEAR_ERROR())
    }

    return (
        <div className={style.body}>
            <Grid container spacing={3} className={style.container}>
                <Grid className={style.form}>
                    <div>
                        <h1 className={style.text}> KINERJAQU </h1>
                        <Divider className={style.divider}/>
                        <p style={{fontSize: '13px'}}><b>Please enter the 4-digit activation code <br/> we sent to your email</b></p>
                        <TextField
                            id="standard-number"
                            type="text"
                            InputLabelProps={{
                                shrink: true
                            }}
                            value={userInput.code}
                            inputProps={{
                                style: {
                                    textAlign: 'center',
                                    height: '30px',
                                    fontSize: '30px',
                                    fontWeight: 'bold',
                                    width: '100px'
                                },
                                maxLength: 4
                            }}
                            style={{marginTop: '5px', textAlign: 'center'}}
                            onChange={(e) => {
                                const check = new RegExp(/^[0-9]*$/).test(e.target.value)
                                if (check) setUserInput({...userInput, code: e.target.value})
                            }}
                        />
                        <br/>
                        <ColorButton variant="contained" color="primary" onClick={verify} style={{marginTop: '20px'}} disabled={!!disabledVerify}>Verify</ColorButton>
                        <p className={style.text}>Click <a href="/" onClick={(e) => {
                            e.preventDefault()
                            dispatch(RELOGIN())
                            history.push('/auth')
                        }}>here</a> to login with another email</p>
                        {/* <p className={style.text}><a href="/" onClick={(e) => {
                            e.preventDefault()
                            dispatch(RELOGIN())
                            history.push('/auth')
                        }}>Resend Mail</a></p> */}
                        <p className={style.footer}>©hubbusysyuhada</p>
                    </div>
                </Grid>
            </Grid>
            <Snackbar open={openError} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                Invalid Activation Code!
                </Alert>
            </Snackbar>
            <Snackbar open={openRegError} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                PLEASE CONTACT ADMIN TO REGISTER YOUR ACCOUNT
                </Alert>
            </Snackbar>
            <Snackbar open={openSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="success">
                Email activated... Welcome {localStorage.getItem('name')}!
                </Alert>
            </Snackbar>
        </div>
    )
}