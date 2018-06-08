<p align="center">
  <img src="./facegram_logo.png" width="250" height="250" alt="Logo">
</p>

# :bridge_at_night: facegram
FacegramBridge is and simple and extensible Facebook - Telegram bridge. Reclaim your privacy now, don't let Zuckbot spy on you  and drain your battery. :battery: :moneybag:
<p align="center">
  <img src="https://media.giphy.com/media/dSdvPrKU0w8WGo4c9L/giphy.gif">
</p>

# :ballot_box_with_check:	 Requirements
<p align="center">
  <img src="./facegram_equation.png" width="250"  alt="Logo">
</p>

To use this you will need:
- Two Telegram accounts
   - Your main telegram account
   - A secondary account, which will be used by the bridge (unfortunately you will also need another phone number) 
- An API key for the second account https://core.telegram.org/api/obtaining_api_id
- Your Facebook account


# :electric_plug: Getting started
To start run `pip install` and `python3 main.py`. It will create all the nessesary config files. Fill necessary config information in generated `config.ini` file. 
To import conversation, simply message your second telegram account account with `/help` to list and import your recent facebook threads. However, every incoming message from facebook will register its sender in Facegram, so you don't need to import all of your contacts manually :smile:.

# :warning: Disclamer

We do not guarantee that this bridge will work correctly. We are not responsible for getting banned on Facebook and/or Telegram. Use at your own discretion.

# :scroll: License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
