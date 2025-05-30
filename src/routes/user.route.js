import {Router} from 'express'
import { AccessrefereshToken, userLogin, userLogout, userRegister } from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
const router= Router()
router.route("/register").post(upload.fields([{name:"avatar",maxCount:1},{name:"coverImage",maxCountL:1}]),userRegister)
router.route('/login').post(userLogin)
router.route('/logout').post(verifyJWT
,userLogout)
router.route('/refresh-token').post(AccessrefereshToken)
export default router