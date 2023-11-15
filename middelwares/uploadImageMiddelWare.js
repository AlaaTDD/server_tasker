const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../utils/apiError");


const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    cb(null, true);
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

const multerOptionsPdf = () => {
  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
    console.log(file);
      cb(null, "uploads/pdfs");
    },
    filename: function (req, file, cb) {
      const filename = `pdf-${uuidv4()}-${Date.now()}.pdf`;
      cb(null, filename);
     req.body.link=filename;
    },
  });

  const multerFilter = function (req, file, cb) {
  
    if (file.mimetype.startsWith("application/pdf")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only pdfs allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};
const multerOptionsPdfDAy = () => {
  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
    console.log(file);
      cb(null, "uploads/pdfsday");
    },
    filename: function (req, file, cb) {
      const filename = `pdfsday-${uuidv4()}-${Date.now()}.pdf`;
      cb(null, filename);
     req.body.link=filename;
    },
  });

  const multerFilter = function (req, file, cb) {
  
    if (file.mimetype.startsWith("application/pdf")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only pdfs allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};
const multerOptionsPdfReview = () => {
  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
    console.log(file);
      cb(null, "uploads/pdfsreview");
    },
    filename: function (req, file, cb) {
      const filename = `pdfsreview-${uuidv4()}-${Date.now()}.pdf`;
      cb(null, filename);
     req.body.link=filename;
    },
  });

  const multerFilter = function (req, file, cb) {
  
    if (file.mimetype.startsWith("application/pdf")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only pdfs allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};
//////////////////////////////////////////////////
exports.uploadsingleImage = (fieldname) => multerOptions().single(fieldname);
exports.uploadsinglePdf = (fieldname) => multerOptionsPdf().single(fieldname);
exports.uploadsinglePdfDay = (fieldname) => multerOptionsPdfDAy().single(fieldname);
exports.uploadsinglePdfReview = (fieldname) => multerOptionsPdfReview().single(fieldname);
exports.uploadmixImage = (arrayOfFields) => multerOptions().fields(arrayOfFields);

