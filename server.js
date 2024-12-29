const express = require("express");
const stripe = require('stripe')('sk_test_51QScLsInzgpo2TYQQuHK9XrIGXUvKRhZD7rHF8walMQzH1IQ5ym5T6HTnb70RobZJ4klTCpm5QNtkWTwA4Fyo1eb00efv9oyJf');
const dotenv = require("dotenv");
const dbConnect = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
dbConnect();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
        });
        console.log(paymentIntent);
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
