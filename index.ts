import login = require("facebook-chat-api");

// Create simple echo bot
login({email: "FB_EMAIL", password: "FB_PASSWORD"}, (err: any, api:any) => {
    if(err) return console.error(err);

    api.listen((err:any, message:any) => {
        api.sendMessage(message.body, message.threadID);
    });
});