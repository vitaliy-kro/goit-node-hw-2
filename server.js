require('dotenv').config();
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');

const app = require('./app');

mongoose.set('strictQuery', false);

const {
  HOST_URI,
  CLOUDINARY_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
} = process.env;

async function server() {
  try {
    await mongoose.connect(HOST_URI);
    console.log('Database connection successful');

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_SECRET, // Click 'View API Keys' above to copy your API secret
    });

    app.listen(3000, () => {
      console.log('Server running. Use our API on port: 3000');
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
server();
