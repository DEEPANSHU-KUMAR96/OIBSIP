import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import userRoutes from './routes/user.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import orderRoutes from './routes/order.routes.js';

const app = express();

app.use(express.static("./public")) // for deployment

app.use(express.json());
app.use(cors({
    origin: ['https://oibsip-skh1.onrender.com', 'http://localhost:5173'],
    credentials: true
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://oibsip-skh1.onrender.com/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));


app.use('/api/auth', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);

app.get('/{*splat}', (req, res) => { res.sendFile(path.resolve('./public', 'index.html')); });

export default app;
