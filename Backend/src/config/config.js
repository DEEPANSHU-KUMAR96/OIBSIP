import 'dotenv/config';

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
}

if(!process.env.JWT_SECRET) {
    throw new Error('JWT_KEY must be defined');
}

if(!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_KEY must be defined');
}


export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET
}