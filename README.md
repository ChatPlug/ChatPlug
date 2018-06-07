# facegram
FacegramBridge is and simple and extensible Facebook-Telegram bridge

# Requirements
To use this you will need:
- Two Telegram accounts
   - Your main telegram account
   - A secondary account, which will be used by the bridge (unfortunately you will also need another phone number) 
- An API key for the second account https://core.telegram.org/api/obtaining_api_id
- Your Facebook account


# Starting
To start run `pip install` and `python3 main.py`. It will create all the nessesary config files. To import conversation, add your facebook conversation id to `conversations.json`. Facegram will generate the rest for you (Telegram chat).

