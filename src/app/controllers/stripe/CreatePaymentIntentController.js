import Stripe from 'stripe';
import * as Yup from 'yup';
import 'dotenv/config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculeteOrderAmount = (items) => {
    const total = items.reduce((acc, item) => {
        return item.price * item.quantity + acc;
    }, 0);

    return total * 100;
};

const CreatePaymentIntentController = {
    async store(request, response) {
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
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { products } = request.body;

        const amount = calculeteOrderAmount(products);

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'brl',
                automatic_payment_methods: { enabled: true },
            });

            response.json({
                clientSecret: paymentIntent.client_secret,
                dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
            });
        } catch (err) {
            response.status(500).json({ error: 'Erro ao criar PaymentIntent', details: err.message });
        }
    },
};

export default CreatePaymentIntentController;
