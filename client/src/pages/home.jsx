import React,{ useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Grid,
    Divider,
    Button,
    Snackbar,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import MuiAlert from '@material-ui/lab/Alert';
import Image1 from '../assets/background1.jpg'
import Image2 from '../assets/background2.jpg'
import Image3 from '../assets/background3.jpg'
import Done from '../assets/done.png'
import Loading from '../assets/loading.gif'
import { purple } from '@material-ui/core/colors'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Swal from 'sweetalert2'
import { USER_LOGOUT, TASK_FETCH, GIVE_USER_REDUX, NEW_TASK } from '../store/action'
import Card from '../components/card'

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

export default function Home () {
    const _ = require('lodash')
    const useStyle = makeStyles({
        container : {
            height: '98vh',
            width: '100%',
            textAlign: 'center',
            margin: 'auto'
        },
        searchBox: {
            margin: '10px',
            textAlign: 'left',
            position: 'absolute',
            top: '17%',
            left: '10%',
            width: '25%'
        },
        item: {
            margin: 'auto',
            textAlign: 'center'
        },
        divider: {
            width: "90%",
            margin: "auto",
            textAlign: "center",
            marginBottom: '0px',
            marginTop: '20px',
            marginBottom: '55px'
        },
        text : {
            fontFamily: 'monospace',
            textAlign: 'center',
            margin: 'auto'
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
        logout: {
            position: 'absolute',
            right: '20px',
            top: '15px',
        },
        butttons: {
            position: 'absolute',
            left: '10%',
            top: '27%'
        },
        new: {
            position: 'absolute',
            right: '10%',
            top: '20%'
        },
        newTaskButton: {
            backgroundColor: '#65c533'
        },
        buttton: {
            marginLeft: '5px'
        },
        insideContainer: {
            margin: 'auto',
            textAlign: 'center',
            width: '90%',
            height: '80vh'
        },
        card: {
            textAlign: 'center',
            margin: 'auto',
            height: '50px',
            width: '90%',
            backgroundColor: 'white',
            opacity: 0.8,
            borderRadius: '20px'
        },
        cardContainer: {
            position: 'absolute',
            top: '34%',
            overflow: 'scroll',
            height: '75%',
            width: '90%',
            height: '60%'
        }
    })
    const style = useStyle()
    const dispatch = useDispatch()
    const history = useHistory()
    const user_redux = useSelector(state => state.AuthReducer)
    const task_redux = useSelector(state => state.TaskReducer)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState('Upcoming Task')
    const [notDoneTask, setNotDoneTask] = useState([])
    const [doneTask, setDoneTask] = useState([])
    const [fetch, setFetch] = useState(false)
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [deadlineError, setDeadlineError] = useState(false)
    const [emptyTitleError, setEmptyTitleError] = useState(false)
    const [emptyDateError, setEmptyDateError] = useState(false)
    const [emptyDeadlineError, setEmptyDeadlineError] = useState(false)
    const [deadlineErrorDialog, setDeadlineErrorDialog] = useState(false)
    let today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }).split(',')[0].split('/')
    if (today[0] < 10) today[0] = `0${today[0]}`
    if (today[1] < 10) today[1] = `0${today[1]}`
    today = `${today[2]}-${today[0]}-${today[1]}`
    const [newForm, setNewForm] = useState({
        tanggal: today,
        deadline: null,
        kinerja: null,
        keterangan: null,
    })

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setEmptyTitleError(false)
        setEmptyDateError(false)
        setEmptyDeadlineError(false)
        setDeadlineError(!(newForm.tanggal < newForm.deadline))
        setDeadlineErrorDialog(false)
    };

    useEffect(async () => {
        if (!_.isEmpty(user_redux) && _.isEmpty(task_redux.tasks)) dispatch(TASK_FETCH(user_redux.token))
    }, [user_redux])

    useEffect(() => {
        let notDone = task_redux.tasks.filter(task => task.status === false)
        let done = task_redux.tasks.filter(task => task.status === true)
        setNotDoneTask(sortTask(notDone))
        setDoneTask(sortTask(done))
        setFetch(true)
    }, [task_redux])

    useEffect(() => {
        if (search) {
            const filteredNotDone = notDoneTask.filter(task => (
                task.kinerja.toLowerCase().includes(search)
                ||
                task.tanggal.toLowerCase().includes(search)
            ))
            setNotDoneTask(filteredNotDone)
            const filteredDone = doneTask.filter(task => (
                task.kinerja.toLowerCase().includes(search)
                ||
                task.tanggal.toLowerCase().includes(search)
            ))
            setDoneTask(filteredDone)
        } else {
            let notDone = task_redux.tasks.filter(task => task.status === false)
            let done = task_redux.tasks.filter(task => task.status === true)
            setNotDoneTask(sortTask(notDone))
            setDoneTask(sortTask(done))
        }
    }, [search])

    useEffect(() => {
        if (!localStorage.name
            ||
            !localStorage.id
            ||
            !localStorage.access_token) history.push('/auth')
        if (localStorage.name
            &&
            localStorage.id
            &&
            localStorage.access_token
            && _.isEmpty(user_redux)) dispatch(GIVE_USER_REDUX({
                id: localStorage.getItem('id'),
                name: localStorage.getItem('name'),
                token: localStorage.getItem('access_token'),
            }))
    }, [])

    async function logout (e) {
        e.preventDefault()
        Swal.fire({
            icon: 'question',
            text: `Are you sure want to log out, ${user_redux.name}?`,
            showDenyButton: true,
            confirmButtonText: `YES`,
            denyButtonText: `NO`,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
        }).then(({isConfirmed}) => {
            if (isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    text: 'LOGGED OUT',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                })
                dispatch(USER_LOGOUT())
                localStorage.removeItem('name')
                localStorage.removeItem('access_token')
                localStorage.removeItem('id')
                history.push('/auth')
            }
        })

    }

    function sortTask (tasks) {
        for (let i = 0; i < tasks.length; i++) {
            const done = tasks[i].status
            if (done) {
                for (let j = 0; j < tasks.length; j++) {
                    if (tasks[i].tanggal < tasks[j].tanggal) {
                        let temp = tasks[i]
                        tasks[i] = tasks[j]
                        tasks[j] = temp
                    }
                }
            }
            else {
                for (let j = 0; j < tasks.length; j++) {
                    if (tasks[i].deadline < tasks[j].deadline) {
                        let temp = tasks[i]
                        tasks[i] = tasks[j]
                        tasks[j] = temp
                    }
                }
            }
        }
        return tasks
    }

    const handleAddClose = () => {
        setNewForm({
            tanggal: today,
            deadline: null,
            kinerja: null,
            keterangan: null,
        })
        setOpenAddDialog(false);
    }

    return (
        <div className={style.body}>
            <ColorButton startIcon={<ExitToAppIcon/>} variant="contained" color="primary" onClick={logout} className={style.logout}>Logout</ColorButton>                    
            <br/>
            <Grid container spacing={3} className={style.container}>
                <Grid className={style.insideContainer}>
                    <div>
                        <h1 className={style.text}> {user_redux.name}'s {page} </h1>
                    </div>
                    <Divider className={style.divider}/>
                    <TextField
                        className={style.searchBox}
                        label='Search Task'
                        helperText='Title, Start Date'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className={style.butttons}>
                        <ColorButton variant="contained" color="primary" onClick={() => setPage('Upcoming Task')} className={style.button}>Upcoming Task</ColorButton>
                        {' '}
                        <ColorButton variant="contained" color="primary" onClick={() => setPage('Done Task')} className={style.button}>Done Task</ColorButton>
                    </div>
                    <div className={style.new}>
                        <ColorButton variant="contained" color="primary" onClick={() => setOpenAddDialog(true)} className={style.button}>New Task</ColorButton>
                    </div>
                    <div className={style.cardContainer}>
                        {
                            fetch
                            ?
                                page === 'Upcoming Task'
                                ?
                                    notDoneTask.length > 0
                                    ?
                                    notDoneTask.map((task, index) => {
                                        task = {...task, index: index+1}
                                        return (
                                            <Card props={task}/>
                                        )
                                    })
                                    :
                                    (
                                        <div>
                                            <img src={Done} style={{width: '450px', marginBottom: 0}}/>
                                            <h1 style={{marginTop: 0, fontFamily: 'monospace'}}>YOU HAVE NO UPCOMING TASK</h1>
                                        </div>
                                    )
                                :
                                    doneTask.length > 0
                                    ?
                                    doneTask.map((task, index) => {
                                        task = {...task, index: index+1}
                                        return (
                                            <Card props={task}/>
                                        )
                                    })
                                    :
                                    ''
                            :
                                page === 'Upcoming Task'
                                ?
                                    notDoneTask.length > 0
                                    ?
                                    notDoneTask.map((task, index) => {
                                        task = {...task, index: index+1}
                                        return (
                                            <Card props={task}/>
                                        )
                                    })
                                    :
                                    (
                                        <div>
                                            <img src={Loading} style={{width: '300px', marginBottom: 0}}/>
                                            <h1 style={{marginTop: 0, fontFamily: 'monospace'}}>LOADING...</h1>
                                        </div>
                                    )
                                :
                                    doneTask.length > 0
                                    ?
                                    doneTask.map((task, index) => {
                                        task = {...task, index: index+1}
                                        return (
                                            <Card props={task}/>
                                        )
                                    })
                                    :
                                    ''
                        }
                    </div>
                </Grid>
            </Grid>
            
            {/* SNACKBAR */}

            <Snackbar open={emptyTitleError} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                    Title cannot be empty!
                </Alert>
            </Snackbar>
            <Snackbar open={emptyDateError} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                    Date cannot be empty!
                </Alert>
            </Snackbar>
            <Snackbar open={emptyDeadlineError} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                    Deadline cannot be empty!
                </Alert>
            </Snackbar>
            <Snackbar open={deadlineErrorDialog} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                    Deadline must be greater than the given date!
                </Alert>
            </Snackbar>

            {/* DIALOG */}

            <Dialog open={openAddDialog} onClose={handleAddClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" style={{margin: 'auto', textAlign: 'center'}}>New Task</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        type="text"
                        value={newForm.kinerja}
                        onChange={(e) => {
                            setNewForm({
                                ...newForm, kinerja: e.target.value
                            })
                        }}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        defaultValue={today}
                        InputLabelProps={{shrink: true}}
                        onChange={(e) => {
                            setNewForm({
                                ...newForm, tanggal: e.target.value
                            })
                            if (e.target.value < newForm.deadline) setDeadlineError(false)
                            else setDeadlineError(true)
                        }}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Deadline"
                        type="date"
                        error={deadlineError}
                        helperText={deadlineError ? 'Deadline must be greater than the given Date above': ''}
                        InputLabelProps={{shrink: true}}
                        onChange={(e) => {
                            setNewForm({
                                ...newForm, deadline: e.target.value
                            })
                            if (!(e.target.value > newForm.tanggal)) setDeadlineError(true)
                            else setDeadlineError(false)
                        }}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        value={newForm.keterangan}
                        onChange={(e) => {
                            setNewForm({
                                ...newForm, keterangan: e.target.value
                            })
                        }}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleAddClose} color="primary">
                    Cancel
                </Button>
                <Button
                onClick={(event) => {
                    event.preventDefault()
                    if (!newForm.kinerja) setEmptyTitleError(true)
                    else if (!newForm.tanggal) setEmptyDateError(true)
                    else if (!newForm.deadline) setEmptyDeadlineError(true)
                    else if (deadlineError) setDeadlineErrorDialog(true)
                    else {
                        dispatch(NEW_TASK(newForm, user_redux.token))
                        handleAddClose()
                    }

                }}
                color="primary">
                    Submit
                </Button>
                </DialogActions>
            </Dialog>


        </div>
    )
}