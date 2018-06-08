from fbchat.models import *
from pyrogram.api import functions
from pyrogram.api import types

class TelegramMessageHandler(object):
    """ TelegramMessageHandler sends telegram messages as facebook messages / images """
    def __init__(self, thread, message, networkClient):
        if (thread):
            self.networkClient = networkClient
            self.thread = thread
            self.threadType = ThreadType.USER
            if (thread.isGroup):
                self.threadType = ThreadType.GROUP

            # TODO Better sticker handling (Bare images looks AWFUL)
        
            if (message.text is not None):
                self.sendMessage(message.text)

            if message.photo:
                self.sendImage(message)

    def sendImage(self, message):
        path = self.networkClient.telegramClient.download_media(message)
        self.networkClient.fbClient.sendLocalImage(image_path = path, thread_id=self.thread.facebookID, thread_type=self.threadType)

    def sendMessage(self, message):
        self.networkClient.fbClient.send(message=Message(text=message), thread_id = self.thread.facebookID, thread_type=self.threadType)
        