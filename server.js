require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');

mongoose.set('strictQuery', false);

const { HOST_URI, PORT } = process.env;

async function server() {
  try {
    await mongoose.connect(HOST_URI);
    console.log('Database connection successful');

    app.listen(PORT || 3001, () => {
      console.log(`Server running. Use our API on port: ${PORT || 3001}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
server();
