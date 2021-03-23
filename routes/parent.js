const express = require('express');
const router = express.Router();
const parentController  = require('../controllers/parentController');
const authAdmin = require("../middleware/adminAuth");

router.get('/all', parentController.getAllParents);

module.exports = router;