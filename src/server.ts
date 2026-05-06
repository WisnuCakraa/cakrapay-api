import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server Cakrapay running on port ${port}`);
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'cakrapay-api is running',
    timestamp: new Date().toISOString(),
  })
})