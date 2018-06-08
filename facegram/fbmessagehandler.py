from fbchat.models import *
from pyrogram.api import functions
from pyrogram.api import types

class FBMessageHandler(object):
    """ FBMessageHandler sends facebook messages as telegram messages / images """
    def __init__(self, author_id, message_object, thread, thread_type, networkClient):
        self.networkClient = networkClient
        self.thread = thread
        if (networkClient.fbClient.uid != author_id):
            # TODO Better sticker handling (Bare images looks AWFUL)
            if (message_object.sticker is not None):
                self.sendImage(message_object.sticker.url)

            if (message_object.attachments is not None and len(message_object.attachments) > 0):
                for attachement in message_object.attachments:
                    if type(attachement) is ImageAttachment:
                        fullUrl = self.networkClient.fbClient.fetchImageUrl(attachement.uid)
                        self.sendImage(fullUrl)
        
            if (message_object.text is not None):
                self.sendMessage(message_object.text)

    def sendImage(self, url):
        self.networkClient.telegramClient.send_photo(self.thread.telegramChatId, url)

    def sendMessage(self, message):
        self.networkClient.telegramClient.send_message(self.thread.telegramChatId, message)
        