from pyrogram import Client, Filters, MessageHandler
from .models import FacegramThread

class CommandsHandler (object): 
    def __init__ (self, networkClient, bridge, config):
        self.networkClient = networkClient
        self.config = config
        self.bridge = bridge
        print("Registered commands")
        self.threads = self.networkClient.fbClient.fetchThreadList()
        self.networkClient.telegramClient.add_handler(MessageHandler(self.handleCommand, Filters.command("help")), 0)
        self.networkClient.telegramClient.add_handler(MessageHandler(self.handleImport, Filters.command("import")), 0)

    def handleCommand(self, client, message):
        self.threads = self.networkClient.fbClient.fetchThreadList()
        
        messageText = ""
        for index, thread in enumerate(self.threads):
            messageText += "Thread #" + str(index+1) + " " + thread.name + "\n"

        messageText += "\nUse command `/import [thread number]` to import given thread"
        client.send_message(message.chat.id, messageText)

    def handleImport(self, client, message):
        # TODO better handling
        try:
            number = message.text.replace("/import ", "").replace("#", "")
            newThread = self.networkClient.createConversation(self.threads[int(number)-1].uid)
            self.config.addThread(FacegramThread(*newThread))
            self.bridge.registerThreads(self.config.loadThreads())
            client.send_message(message.chat.id, "Imported thread #" + number + " " + self.threads[int(number)-1].name)
        except:
            client.send_message("Exception occured while importing data")
