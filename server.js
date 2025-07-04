import express from 'express';
import routes from './routes/index';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Load all routes
app.use('/', routes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
