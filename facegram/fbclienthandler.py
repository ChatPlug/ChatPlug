from fbchat import Client

class FBClientHandler(Client):
    """FBClientHandler passes received messages from facebook to bridge"""
    def registerBridge(self, bridge):
        self.bridge = bridge

    def onMessage(self, author_id, message_object, thread_id, thread_type, **kwargs):
        self.bridge.facebookMessageHandler(author_id, message_object, thread_id, thread_type)
