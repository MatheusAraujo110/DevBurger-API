import Stripe from 'stripe';
import * as Yup from 'yup';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Função para calcular o valor total da compra em centavos
const calculateOrderAmount = (items) => {
    const total = items.reduce((acc, item) => {
        return item.price * item.quantity + acc;
    }, 0);

    return Math.round(total); // Certifique-se de retornar um valor inteiro em centavos
};

const CreatePaymentIntentController = {
    async store(request, response) {
        // Validação do corpo da requisição usando Yup
        const schema = Yup.object({
            products: Yup.array()
                .required()
                .of(
                    Yup.object({
                        id: Yup.number().required(),
                        quantity: Yup.number().required(),
                        price: Yup.number().required(),
                    }),
                ),
        });

        try {
            // Validar o corpo da requisição
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { products } = request.body;

        // Calcular o valor total do pedido
        const amount = calculateOrderAmount(products);

        try {
            // Criar o PaymentIntent no Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'brl',
                automatic_payment_methods: { enabled: true },
            });

            // Retornar o clientSecret e link para revisão no dashboard
            response.json({
                clientSecret: paymentIntent.client_secret,
                dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
            });
        } catch (err) {
            // Capturar e retornar erros da API Stripe
            console.error('Error creating PaymentIntent:', err);
            response.status(500).json({
                error: 'Erro ao criar PaymentIntent',
                details: err.message,
            });
        }
    },
};

export default CreatePaymentIntentController;
