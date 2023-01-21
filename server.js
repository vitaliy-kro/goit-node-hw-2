require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');

mongoose.set('strictQuery', false);

const { HOST_URI } = process.env;

async function server() {
  try {
    await mongoose.connect(HOST_URI);
    console.log('Database connection successful');

    app.listen(3000, () => {
      console.log('Server running. Use our API on port: 3000');
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
server();
