import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js';
import couponRoute from './routes/couponRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import analyticsRoute from './routes/analyticsRoute.js';
import cors from 'cors';
import dns from "dns";
import cookieParser from 'cookie-parser';

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));


const PORT = process.env.PORT || 3000;


// ✅ ADD THIS ABOVE routes
app.use(
  "/api/payment/webhook",
  express.raw({ type: "*/*" })
);
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use('/api/auth', userRoute);
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/coupon', couponRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/analytics', analyticsRoute);



connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    })
});
