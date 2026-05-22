import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import adminGroupRoutes from './routes/adminGroupRoutes.js';
import unitGroupRoutes from './routes/unitGroupRoutes.js';

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server Running');
});

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/invoices', invoiceRoutes);

app.use(
  '/api/admin-groups',
  adminGroupRoutes
);

app.use(
  '/api/unit-groups',
  unitGroupRoutes
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});