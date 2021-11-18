const multer = require("multer");
const path = require("path");
const uploadFolder = path.resolve("images");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    //console.log(file)
    cb(null, `${file.originalname}-${+Date.now()}`);
  },
});
const picture = ({ originalname, mimetype }) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
  ];
  return (
    originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/) &&
    allowedMimeTypes.includes(mimetype)
  );
};

const fileFilter = (req, file, cb) => {
  if (!picture(file)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: fileStorage, fileFilter });

module.exports = upload;
