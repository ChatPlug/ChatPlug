from pyrogram import Client as TelegramClient
from pyrogram.api import functions
from pyrogram.api import types
from .fbclienthandler import FBClientHandler
from fbchat import Client as FacebookClient
from fbchat import ThreadType
from pyrogram import MessageHandler
from .models import *


class NetworkClient(object):
    """Handles all network related actions"""
    def __init__(self, fbLogin, fbPassword, apiId, apiHash, telegramUsername):
        self.fbClient = FBClientHandler(fbLogin, fbPassword)
        self.telegramClient = TelegramClient(
            session_name="facegram_session",
            api_id=apiId,
            api_hash=apiHash)
            
        self.telegramClient.start()
        self.username = telegramUsername

        # Lookup user data from username
        self.user = self.lookupUser(self.username)

    def registerBridge(self, bridge):
        """Registers Bridge and adds Telegram handlers"""
        self.fbClient.bridge = bridge
        self.telegramClient.add_handler(MessageHandler(bridge.telegramMessageHandler), 1)

    def stop(self):
        """Stops telegram and facebook client (Loggout)"""
        self.fbClient.logout()
        self.telegramClient.stop()
        
    def loadThreadBridges(self, ids):
        return self.fbClient.fetchThreadInfo(ids)

    def createConversation(self, threadId):
        """ Creates conversation for facebook threadId. Returns list of telegram parameters"""
        thread = self.fbClient.fetchThreadInfo(threadId)[threadId]
        
        # Create chat with facebook's thread name
        update = self.telegramClient.send(
            functions.messages.CreateChat(users=[types.InputUserSelf(),types.InputUser(
                    user_id=self.user.userId,
                    access_hash=self.user.accessHash
                )],
                title=thread.name
            )
        )
        chatId = update.chats[0].id
        isGroup = False
        if (thread.type is ThreadType.GROUP):
            isGroup = True
        # Returns [facebookThreadId, telegramChatId, telegramUsername, threadtype] 
        return [threadId, chatId, self.username, isGroup]

    def lookupUser(self, username):
        """ Creates FacegramUser from telegram username """
        resolved_peer = self.telegramClient.send(
            functions.contacts.ResolveUsername(
                username=username
            )
        )

        return FacegramUser(userId=resolved_peer.users[0].id, accessHash=resolved_peer.users[0].access_hash)
