from .config import FacegramConfig
from .bridge import Bridge
from .networkclient import NetworkClient
from .commands_handler import CommandsHandler

class FacegramBridge(object):
    def __init__(self):
        self.config = FacegramConfig()

    def startBridge(self):
        """Starts FacegramBridge"""
        self.createNetworkClient()
        self.bridge = Bridge(self.networkClient, self.config)
        self.loadConversations()
        self.registerBridgeHandlers()
        CommandsHandler(self.networkClient, self.bridge, self.config)
        self.networkClient.fbClient.listen()
        
    def createNetworkClient(self):
        """Creates network client from configuration"""
        configuration = self.config.readConfig()
        self.networkClient = NetworkClient(
            configuration["FACEBOOK"]["login"],
            configuration["FACEBOOK"]["password"],
            configuration["TELEGRAM"]["api_id"],
            configuration["TELEGRAM"]["api_hash"],
            configuration["TELEGRAM"]["username"]
        )
    
    def loadConversations(self):
        """This function reads conversations from config, and creates missing conversations in telegram"""
        self.bridge.registerThreads(self.config.loadThreads())

    def stopBridge(self):
        """Stops bridge"""
        self.networkClient.stop()

    def registerBridgeHandlers(self):
        """Registers Bridge in networkClient"""
        self.networkClient.registerBridge(self.bridge)

            
        


        
    

