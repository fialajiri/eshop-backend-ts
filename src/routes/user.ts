import express from 'express'

import { currentUser } from '../middlewares/current-user'
import { signIn } from '../controllers/user/signin'
import { signUp } from '../controllers/user/signup'
import { signOut } from '../controllers/user/signout'

const router = express.Router()

router.get('/api/users/currentuser', currentUser)

router.post('/api/users/signup', signUp)

router.post('/api/users/signin', signIn)

router.post('/api/users/signout', signOut)


export {router as userRoutes}