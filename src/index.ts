// src/index.ts
import express from 'express';
import authRoutes from './routes/authRoutes';
import rolRoutes from './routes/rolRoutes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/roles', rolRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
