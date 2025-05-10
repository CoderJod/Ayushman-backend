const express = require('express');
const router = express.Router();
const { updateStatus, getStatus, getStatusSummary, getAllUserStatuses} = require('../controllers/deviceController');

router.post("/status/update", updateStatus);
router.get("/status/summary", getStatusSummary);
router.get('/status/allUsers', getAllUserStatuses);

module.exports = router;
