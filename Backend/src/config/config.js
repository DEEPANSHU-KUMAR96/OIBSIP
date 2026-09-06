import 'dotenv/config';

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
}

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_KEY must be defined');
}

if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_KEY must be defined');
}

if (!process.env.RAZORPAY_KEY_ID) {
    throw new Error('RAZORPAY_KEY_ID must be defined');
}

if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('RAZORPAY_KEY_SECRET must be defined');
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error('GOOGLE_CLIENT_ID must be defined');
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error('GOOGLE_CLIENT_SECRET must be defined');
}

export const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
};