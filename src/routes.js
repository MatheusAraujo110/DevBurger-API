import { Router } from 'express'

const router = new Router()

router.get('/', (request, response) => {
    return response.status(200).json({ message: 'Funcionando noraml...' })
})

export default router