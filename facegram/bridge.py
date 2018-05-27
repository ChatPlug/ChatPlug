from .threadbridge import ThreadBridge
from fbchat.models import *
from pyrogram.api import functions
from pyrogram.api import types

from .models import *


class Bridge:
    """Bridge connects telegram and facebook handlers and exchanges messages between them"""
    def __init__(self, networkClient):
        self.networkClient = networkClient
        self.threadBridgeRegistry = []

    def telegramMessageHandler(self, client, message):
        """Handles telegram messages and sends them to facebook account"""
        thread = self.getBridgeForTelegramId(message.chat.id).thread
        if thread is not None:
            self.networkClient.fbClient.send(Message(
                text=message.text), thread_id=thread.facebookID, thread_type=ThreadType.USER)

    def facebookMessageHandler(self, author_id, message_object, thread_id, thread_type):
        """Handles facebook messages and sends them to corresponding telegram chat"""
        thread = self.getBridgeForFacebookId(thread_id).thread
        if thread is not None:
            self.networkClient.telegramClient.send_message(
                thread.telegramChatId,
                message_object.text
            )

    def registerThread(self, thread):
        """Registers FacegramBridge to stack"""
        print("Thread registered facebookId=" + thread[0])
        self.threadBridgeRegistry.append(ThreadBridge(self.networkClient, FacegramThread(
            facebookID=thread[0], telegramChatId=thread[1], telegramUsername=thread[2])))

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
