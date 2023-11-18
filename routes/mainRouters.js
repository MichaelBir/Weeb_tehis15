const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.getMainPage);
router.post('/', mainController.PostMainPage);
router.post('/getmovie', mainController.PostSearchPage);



module.exports = router;