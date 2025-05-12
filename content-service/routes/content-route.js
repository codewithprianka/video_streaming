const express = require('express');
const router = express.Router();

const contentController = require('../controllers/contentController');
const contentMiddleware=  require("../middlewares/content-middleware");
const upload = require("../utils/multer");

router.post(
  "/add",
  contentMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  contentController.addContent
);

router.get("/get",contentController.getContent);
router.get("/get/:id",contentController.getContentById);

module.exports = router;
