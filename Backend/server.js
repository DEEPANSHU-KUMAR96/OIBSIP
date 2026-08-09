import app from './src/app.js';
import connectDB from './src/config/database.js';

connectDB();



process.env.PORT = process.env.PORT || 8000;

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
