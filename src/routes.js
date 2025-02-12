import { Router } from "express"
import multer from "multer"
import multerConfig from "./config/multer"
import authMiddleware from "./app/middlewares/auth"

import UserController from './app/controllers/UserController'
import SessionController from "./app/controllers/SessionController"
import ProductController from "./app/controllers/ProductController"
import CategoryController from "./app/controllers/CategoryController"
import OrderController from "./app/controllers/OrderController"
import CreatePaymentIntentController from "./app/controllers/stripe/CreatePaymentIntentController"


const routes = new Router()
const upload = multer(multerConfig)

routes.post('/users', UserController.store)  // Cadastro.
routes.post('/session', SessionController.store) // Login.

routes.use(authMiddleware) // Será chamado por todas as rotas ABAIXO.
routes.post('/products', upload.single('file'), ProductController.store)
routes.get('/products', authMiddleware, ProductController.index)
routes.put('/products/:id', upload.single('file'), ProductController.update)


routes.post('/categories', upload.single('file'), CategoryController.store)
routes.get('/categories', authMiddleware, CategoryController.index)
routes.put('/categories/:id', upload.single('file'), CategoryController.update)

routes.post('/orders', OrderController.store)  // Cria um pedido.
routes.get('/orders', OrderController.index)  // Busca todos os pedidos.
routes.put('/orders/:id', OrderController.update)  // Editar um pedido.

routes.post('/create-payment-intent', CreatePaymentIntentController.store)

export default routes