import { v4 } from "uuid"
import * as Yup from "yup"

import User from '../models/User'

const UserController = {
    async store(request, response) {

        const schema = Yup.object({
            email: Yup.string().required(),
            password: Yup.string().min(6).required(),
            admin: Yup.boolean(),
        })

        // const validation = await schema.isValid(request.body)
        // console.log(validation)

        try {
            schema.validateSync(request.body, { abortEarly: false })
        } catch (err) {
            return response.status(400).json({ error: err.errors })
        }

        const { name, email, password, admin } = request.body

        const userExist = await User.findOne({
            where: {
                email,
            },
        })

        if (userExist) {
            return response.status(400).json({ error: 'User already exists' })
        }

        const user = await User.create({
            id: v4(),
            name,
            email,
            password,
            admin,
        })

        return response.status(201).json({
            id: user.id,
            name,
            email,
            admin,
        })
    }
}

export default UserController
