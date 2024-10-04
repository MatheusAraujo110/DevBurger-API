import * as Yup from 'yup'

const ProductController = {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.string().required(),
            category: Yup.string().required(),
        })

        try {
            schema.validateSync(request.body, { abortEarly: false })
        } catch (err) {
            return response.status(400).json({ error: err.errors })
        }

        return response.status(201).json({ message: 'ok' })
    }
}

export default ProductController