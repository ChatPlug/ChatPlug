from .threadbridge import ThreadBridge
from fbchat.models import *
from pyrogram.api import functions
from pyrogram.api import types
from .fbmessagehandler import FBMessageHandler
from .telegrammessagehandler import TelegramMessageHandler
from .models import *


class Bridge:
    """Bridge connects telegram and facebook handlers and exchanges messages between them"""
    def __init__(self, networkClient, config):
        self.networkClient = networkClient
        self.config = config
        self.threadBridgeRegistry = []

    def telegramMessageHandler(self, client, message):
        """Handles telegram messages and sends them to facebook account"""
        thread = self.getBridgeForTelegramId(message.chat.id)
        if thread is not None:
            TelegramMessageHandler(thread.thread, message, self.networkClient)

    def facebookMessageHandler(self, author_id, message_object, thread_id, thread_type):
        """Handles facebook messages and sends them to corresponding telegram chat"""
        thread = self.getBridgeForFacebookId(thread_id)
        if thread is not None:
            FBMessageHandler(author_id, message_object, thread.thread, thread_type, self.networkClient)
        else:
            thread = self.networkClient.createConversation(thread_id)
            self.config.addThread(thread)
            self.registerThreads(self.config.loadThreads())
            FBMessageHandler(author_id, message_object, FacegramThread(*thread), thread_type, self.networkClient)


    def registerThreads(self, threads):
        """Registers FacegramBridge to stack"""
        self.threadBridgeRegistry = []
        for thread in threads:
            print("Thread registered facebookId=" + thread[0])
            self.threadBridgeRegistry.append(ThreadBridge(self.networkClient, FacegramThread(*thread)))

    def getBridgeForTelegramId(self, telegramId):
        """Returns bridge for telegramId"""
        for bridge in self.threadBridgeRegistry:
            # we need to compare it as abs as telegram can return negavite id
            if (int(bridge.thread.telegramChatId) == abs(telegramId)):
                return bridge
        return None

    def getBridgeForFacebookId(self, facebookId):
        """Returns bridge for facebookId"""
        for bridge in self.threadBridgeRegistry:
            if (str(bridge.thread.facebookID) == str(facebookId)):
                return bridge
        return None
