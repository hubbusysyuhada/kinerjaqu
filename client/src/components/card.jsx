import React,{ useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Grid,
    Switch,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Button,
    CircularProgress,
    Backdrop
} from '@material-ui/core'
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import { useDispatch, useSelector } from 'react-redux'
import { PATCH_STATUS, DELETE_TASK, DELETE_INPUT, DELETE_OUTPUT, EDIT_TASK, UPLOAD_FILE } from '../store/action.js'
import MuiAlert from '@material-ui/lab/Alert';
import { purple } from '@material-ui/core/colors'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function Card ({props}) {
    const useStyle = makeStyles( theme => ({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
        card: {
            textAlign: 'center',
            margin: 'auto',
            height: '150px',
            width: '90%',
            backgroundColor: 'white',
            opacity: 0.8,
            borderRadius: '20px',
            marginBottom: '10px',
        },
        content: {
            textAlign: 'center',
            margin: 'auto'
        },
        files: {
            margin: '5px'
        },
        upload: {
            color: '#65c533',
            marginLeft: '5px'
        },
        delete: {
            marginLeft: '5px'
        },
        editTask: {
            marginLeft: '5px',
            color: '#ffc22f'
        },
        deleteTask: {
            marginLeft: '5px',
            color: 'whitesmoke'
        },
        download: {
            marginLeft: '5px'
        }
    }))

    const style = useStyle()
    const dispatch = useDispatch()
    const user_redux = useSelector(state => state.AuthReducer)
    const uploading = useSelector(state => state.TaskReducer.uploading)
    const [check, setCheck] = useState(props.status)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openUploadDialog, setOpenUploadDialog] = useState(false)
    const [deadlineError, setDeadlineError] = useState(false)
    const [emptyTitleError, setEmptyTitleError] = useState(false)
    const [emptyDateError, setEmptyDateError] = useState(false)
    const [emptyDeadlineError, setEmptyDeadlineError] = useState(false)
    const [deadlineErrorDialog, setDeadlineErrorDialog] = useState(false)
    const [backdropOpen, setBackdropOpen] = useState(false)
    const [filePath, setFilePath] = useState(null)
    const [fileName, setFileName] = useState(null)
    const [fileType, setFileType] = useState(null)
    const [editForm, setEditForm] = useState({
        tanggal: parseDate(props.tanggal),
        deadline: parseDate(props.deadline),
        kinerja: props.kinerja,
        keterangan: props.keterangan,
    })
    useEffect(() => {
        setCheck(props.status)
    }, [props])
    
    useEffect(() => {
        if (!uploading) setBackdropOpen(false)
    }, [uploading])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setEmptyTitleError(false)
        setEmptyDateError(false)
        setEmptyDeadlineError(false)
        setDeadlineError(!(editForm.tanggal < editForm.deadline))
        setDeadlineErrorDialog(false)
    };

    const handleEditClose = () => {
        setEditForm({
            tanggal: props.tanggal,
            deadline: props.deadline,
            kinerja: props.kinerja,
            keterangan: props.keterangan,
        })
        setOpenEditDialog(false);
    }

    const handleUploadClose = () => {
        setOpenUploadDialog(false);
    }

    function patchStatus(e) {
        e.preventDefault()
        dispatch(PATCH_STATUS(props, !check, user_redux.token))
        setCheck(!check)
    }

    function deleteTask(e) {
        e.preventDefault()
        Swal.fire({
            icon: 'question',
            text: `Delete ${props.kinerja}? This action is permanent`,
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
                dispatch(DELETE_TASK(props, user_redux.token))
            }
        })
    }

    function deleteInputFile(e) {
        e.preventDefault()
        Swal.fire({
            icon: 'question',
            text: `Delete ${props.kinerja} input file? This action is permanent`,
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
                dispatch(DELETE_INPUT(props, user_redux.token))
            }
        })
    }

    function deleteOutputFile(e) {
        e.preventDefault()
        Swal.fire({
            icon: 'question',
            text: `Delete ${props.kinerja} output file? This action is permanent`,
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
                dispatch(DELETE_OUTPUT(props, user_redux.token))
            }
        })
    }

    function parseDate (date) {
        const newDate = date.split(' ')
        if (newDate[0] < 10) newDate[0] = `0${newDate[0]}`
        let month = new Date(newDate).getMonth() + 1
        if (month < 10) month = `0${month}`
        return `${newDate[2]}-${month}-${newDate[0]}`
    }

    function downloadFile (e, type) {
        e.preventDefault()
        Swal.fire({
            icon: 'question',
            title: `Download ${type} File of "${props.kinerja}"?`,
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
                if (type.toLowerCase() === 'input') window.open(`${JSON.parse(props.input).download}`)
                else window.open(`${JSON.parse(props.hasil).download}`)
            }
        })
    }

    return (
        <div>
            <Grid container>
                <div className={style.card}>
                    <Grid container xs={11}>
                        <Grid xs={1} className={style.content}>
                            <h1>{props.index}</h1>
                        </Grid>
                        <Grid xs={3} className={style.content}>
                            <h1>{props.kinerja}</h1>
                        </Grid>
                        <Grid xs={2} className={style.content}>
                            <p>{props.keterangan}</p>
                        </Grid>
                        <Grid xs={2} className={style.content}>
                            <h6>Start: {props.tanggal}</h6>
                            <h6>Due: {props.deadline}</h6>
                        </Grid>
                        <Grid xs={3} className={style.content}>
                            <h5 className={style.files}>Input</h5>
                            {
                                props.input
                                ?
                                    <div>
                                        <IconButton color='primary' component='span' onClick={() => {
                                            setOpenUploadDialog(true)
                                            setFileType('Input')
                                        }} className={style.upload}>
                                            <CloudUploadIcon/>
                                        </IconButton>
                                        <IconButton color='primary' component='span' onClick={(e) => {
                                            setFileType('Input')
                                            downloadFile(e, 'Input')
                                        }} className={style.download}>
                                            <CloudDownloadIcon/>
                                        </IconButton>
                                        <IconButton color='secondary' component='span' onClick={deleteInputFile} className={style.delete}>
                                            <DeleteRoundedIcon/>
                                        </IconButton>
                                    </div>
                                :
                                    <IconButton color='primary' component='span' onClick={() => {
                                        setOpenUploadDialog(true)
                                        setFileType('Input')
                                    }} className={style.upload}>
                                        <CloudUploadIcon/>
                                    </IconButton>
                            }
                            <h5 className={style.files}>Output</h5>
                            {
                                props.hasil
                                ?
                                    <div>
                                        <IconButton color='primary' component='span' onClick={() => {
                                            setOpenUploadDialog(true)
                                            setFileType('Output')
                                        }} className={style.upload}>
                                            <CloudUploadIcon/>
                                        </IconButton>
                                        <IconButton color='primary' component='span' onClick={(e) => {
                                            setFileType('Output')
                                            downloadFile(e, 'Output')
                                        }} className={style.download}>
                                            <CloudDownloadIcon/>
                                        </IconButton>
                                        <IconButton color='secondary' component='span' onClick={deleteOutputFile} className={style.delete}>
                                            <DeleteRoundedIcon/>
                                        </IconButton>
                                    </div>
                                :
                                    <IconButton color='primary' component='span' onClick={() => {
                                        setOpenUploadDialog(true)
                                        setFileType('Output')
                                    }} className={style.upload}>
                                        <CloudUploadIcon/>
                                    </IconButton>
                            }
                        </Grid>
                        <Grid xs={1} className={style.content}>
                            <Switch
                                checked={check}
                                onChange={patchStatus}
                                color="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        </Grid>
                    </Grid>
                </div>
                <Grid xs={1} className={style.content}>
                    <IconButton color='default' component='span' onClick={() => {
                        setOpenEditDialog(true)
                        setEditForm({
                            tanggal: parseDate(props.tanggal),
                            deadline: parseDate(props.deadline),
                            kinerja: props.kinerja,
                            keterangan: props.keterangan,
                        })
                    }} className={style.editTask}>
                        <EditRoundedIcon/>
                    </IconButton>
                    <br />
                    <IconButton color='default' component='span' onClick={deleteTask} className={style.deleteTask}>
                        <DeleteRoundedIcon/>
                    </IconButton>
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

            <Dialog open={openEditDialog} onClose={handleUploadClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" style={{margin: 'auto', textAlign: 'center'}}>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        type="text"
                        value={editForm.kinerja}
                        onChange={(e) => {
                            setEditForm({
                                ...editForm, kinerja: e.target.value
                            })
                        }}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        defaultValue={editForm.tanggal}
                        InputLabelProps={{shrink: true}}
                        onChange={(e) => {
                            setEditForm({
                                ...editForm, tanggal: e.target.value
                            })
                            if (e.target.value < editForm.deadline) setDeadlineError(false)
                            else setDeadlineError(true)
                        }}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Deadline"
                        type="date"
                        defaultValue={editForm.deadline}
                        error={deadlineError}
                        helperText={deadlineError ? 'Deadline must be greater than the given Date above': ''}
                        InputLabelProps={{shrink: true}}
                        onChange={(e) => {
                            setEditForm({
                                ...editForm, deadline: e.target.value
                            })
                            if (!(e.target.value > editForm.tanggal)) setDeadlineError(true)
                            else setDeadlineError(false)
                        }}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        value={editForm.keterangan}
                        onChange={(e) => {
                            setEditForm({
                                ...editForm, keterangan: e.target.value
                            })
                        }}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleEditClose} color="primary">
                    Cancel
                </Button>
                <Button
                onClick={(event) => {
                    event.preventDefault()
                    if (!editForm.kinerja) setEmptyTitleError(true)
                    else if (!editForm.tanggal) setEmptyDateError(true)
                    else if (!editForm.deadline) setEmptyDeadlineError(true)
                    else if (deadlineError) setDeadlineErrorDialog(true)
                    else {
                        dispatch(EDIT_TASK({
                            ...editForm,
                            id: props.id,
                            status: props.status,
                            input: props.input,
                            hasil: props.hasil
                        }, user_redux.token))
                        handleEditClose()
                    }

                }}
                color="primary">
                    Submit
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openUploadDialog} onClose={handleUploadClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" style={{margin: 'auto', textAlign: 'center'}}>Upload {fileType} File</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        disabled
                        type="text"
                        value={!filePath ? 'You haven\'t pick a file' : fileName}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        component="label"
                        onChange={e => {
                            let name = []
                            let path = []
                            for (let i = 0; i < e.target.files.length; i++) {
                                const file = e.target.files[i]
                                name.push(file.name)
                                path.push(file)
                            }
                            setFileName(name.join(', '))
                            setFilePath(path)

                        }}
                    >
                        Pilih File
                        <input
                            type="file"
                            multiple
                            hidden
                        />
                    </Button>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleUploadClose} color="primary">
                    Cancel
                </Button>
                <Button
                onClick={(event) => {
                    event.preventDefault()
                    if (filePath.length > 0) {
                        const formData = new FormData()
                        filePath.forEach(file => formData.append('file', file))
                        const payload = {
                            formData,
                            id: props.id,
                            type: fileType
                        }
                        setOpenUploadDialog(false)
                        setBackdropOpen(true)
                        dispatch(UPLOAD_FILE(payload, user_redux.token))
                        setFilePath(null)
                        setFileName(null)
                    }
                }}
                color="primary">
                    Upload
                </Button>
                </DialogActions>
            </Dialog>

            {/* BACKDROP */}
            <Backdrop className={style.backdrop} open={backdropOpen}>
                <CircularProgress color="inherit" />
                <br/>
                <p>loading...</p>
            </Backdrop>

        </div>
    )
}