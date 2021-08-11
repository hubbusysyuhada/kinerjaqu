const errorHandler = require('../middlewares/errorHandler')
const {authentication, authorization} = require('../middlewares/auth')
const UserController = require('../controllers/UserController')
const TaskController = require('../controllers/TaskController')
const router = require('express').Router()
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'helpers/files')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + ` - ${file.originalname}`) //Appending extension
    }
  })
const upload = multer({storage})

router.get('/', (req, res, next) => {
    res.send('Hello world from router')
})
// user routes
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/resend/:accountId', UserController.resendMail)
router.patch('/verify/:accountId', UserController.emailActivation)
router.post('/birthdate', UserController.birthdateCheck)
router.post('/change-password/:accountId', UserController.changePassword)

router.use(authentication)
router.get('/task', TaskController.getAllTask)
router.get('/task/:taskId', TaskController.getTask)

router.use(authorization)
router.post('/task', TaskController.newTask)
router.post('/task/:taskId/hasil', upload.any(), TaskController.uploadHasil)
router.delete('/task/:taskId/hasil', upload.any(), TaskController.deleteHasil)
router.patch('/task/:taskId/hasil', upload.any(), TaskController.changeHasilFile)
router.post('/task/:taskId/input', upload.any(), TaskController.uploadInput)
router.delete('/task/:taskId/input', upload.any(), TaskController.deleteInput)
router.patch('/task/:taskId/input', upload.any(), TaskController.changeInputFile)
router.delete('/task/:taskId', TaskController.deleteTask)
router.patch('/task/:taskId', TaskController.updateTask)
router.put('/task/:taskId', TaskController.editTask)

router.use(errorHandler)

module.exports = router