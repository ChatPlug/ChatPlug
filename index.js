"use strict";
var login = require("facebook-chat-api");
// Create simple echo bot
login({ email: "mrfliper@o2.pl", password: "19975200" }, function (err, api) {
    if (err)
        return console.error(err);
    api.listen(function (error, message) {
        api.sendMessage(message.body, message.threadID);
    });
});
