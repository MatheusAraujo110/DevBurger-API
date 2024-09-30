import { Router } from 'express'
import { v4 } from "uuid"

import User from './app/models/User'

const router = new Router()

router.get('/', async (request, response) => {
    const user = await User.create({
        id: v4(),
        name: 'matheus',
        email: 'theusnascimento386@gmail.com',
        password_hash: '25961511',
    })

    return response.status(201).json(user)
})

export default router