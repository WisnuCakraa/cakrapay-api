import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = parseInt(process.env.PORT || '3000', 10);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server Cakrapay running on port ${port}`);
});
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'cakrapay-api is running',
    timestamp: new Date().toISOString(),
  })
})