const multer = require("multer");
const { Worker, newStore } = require("../DB/services");

const validate = async (rq, file, cb) => {
  const data = JSON.parse(rq.body.data);
  if (data.name) {
    const worker = await Worker.find({ name: data.name });
    if (worker.length > 0) {
      cb(null, false);
    } else cb(null, true);
  }
  if (data.productName) {
    const stowage = await newStore.find({ productName: data.productName });
    if (stowage.length > 0) {
      cb(null, false);
    } else cb(null, true);
  }
};

const storage = multer.diskStorage({
  destination: function (rq, file, cb) {
    cb(null, "uploads");
  },
  filename: function (rq, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage, fileFilter: validate });

exports.upload = upload.single("myFile");
