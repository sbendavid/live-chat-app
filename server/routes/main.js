const express = require("express");
const router = express.Router();

// Routes
router.get("", (req, res) => {
    res.render("index");
});

router.get("/chat", (req, res) => {
    res.render("chat");
});

router.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    });
});

 router.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      res.sendStatus(200);
    });
});

module.exports = router