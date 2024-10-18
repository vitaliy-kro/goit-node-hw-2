const { v2: cloudinary } = require('cloudinary');
const { HttpError } = require('http-errors');
const uploadImageToCloudinary = (req, res, next) => {
  const { buffer } = req.file;
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      resource_type: 'auto',
      folder: 'avatars',
    },
    (err, result) => {
      if (err) {
        console.error('Cloudinary upload error:', err);
        return next(err);
      }
      if (!result) {
        console.error('Cloudinary upload error: Result is undefined');
        return next(new HttpError('Cloudinary upload result is undefined'));
      }
      req.body.upload_image_url = result.secure_url;
      next();
    }
  );

  uploadStream.end(buffer);
};

module.exports = { uploadImageToCloudinary };
