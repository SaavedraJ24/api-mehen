const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const cart = [];
    res.status(200).json({ success: true, cart })
});

module.exports = router;