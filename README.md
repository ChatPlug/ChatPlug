<p align="center">
  <img src="./facegram_logo.png" width="250" height="250" alt="Logo">
</p>

# :bridge_at_night: facegram
FacegramBridge is a simple and extensible Facebook (Messenger) - Telegram bridge. Reclaim your privacy now, don't let Zuckbot spy on you  and drain your battery. :battery: :moneybag:
<p align="center">
  <img src="https://media.giphy.com/media/dSdvPrKU0w8WGo4c9L/giphy.gif">
</p>

# :question: How does it work?

Everytime you recieve a message on Messenger it will be relayed to a specific conversation on telegram. When you reply via Telegram the message will be relayed the other way round. This way you don't have to install Facebook Messenger on your phone.

# :ballot_box_with_check:	 Requirements
<p align="center">
  <img src="./facegram_equation.png" width="250"  alt="Logo">
</p>

To use this you will need:
- Python 3
- Two Telegram accounts
   - Your main telegram account
   - A secondary account, which will be used by the bridge (unfortunately you will also need another phone number) 
- An API key for the second account https://core.telegram.org/api/obtaining_api_id
- Your Facebook account


# :electric_plug: Getting started
First of all you will need to install the required libraries. You will have to run this command:

```sh
pip install
```
After installing the dependencies you can start the bridge:

```sh
python main.py
```
On first run the program will create a file called `config.ini` where you have to add your credentials.
# :iphone: Usage

Everytime you recieve a message on Facebook a new conversation with this person group will be created on telegram. However when you want to create the conversation manually you can message the bot with a `/import` command and the ID of the conversation (full help available with `/help`).

# :warning: Disclamer

We do not guarantee that this bridge will work correctly. We are not responsible for getting banned on Facebook and/or Telegram. Use at your own discretion.

All product and company names are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.

Facebook and the Facebook logo are trademarks or registered trademarks of Facebook, Inc., used under license agreement.

# :scroll: License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
