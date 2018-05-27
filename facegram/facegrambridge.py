from .config import FacegramConfig
from .bridge import Bridge
from .networkclient import NetworkClient

class FacegramBridge(object):
    def __init__(self):
        self.config = FacegramConfig()

    def startBridge(self):
        """Starts FacegramBridge"""
        self.createNetworkClient()
        self.bridge = Bridge(self.networkClient)
        self.loadConversations()
        self.registerBridgeHandlers()
        self.networkClient.fbClient.listen()
        
    def createNetworkClient(self):
        """Creates network client from configuration"""
        configuration = self.config.readConfig()
        self.networkClient = NetworkClient(
            configuration["FACEBOOK"]["login"],
            configuration["FACEBOOK"]["password"],
            configuration["TELEGRAM"]["api_id"],
            configuration["TELEGRAM"]["api_hash"],
            "feelfreelinux"
        )
    
    def loadConversations(self):
        """This function reads conversations from config, and creates missing conversations in telegram"""
        threads = self.config.loadThreads()
        for i, thread in enumerate(threads):
            # Create conversation if certain informations are missing(telegramId, telegramUsername)
            if (len(thread) == 1):
                threads[i] = self.networkClient.createConversation(thread[0])
                # Update config
                self.config.updateThreads(threads)
            self.bridge.registerThread(threads[i])

    def stopBridge(self):
        """Stops bridge"""
        self.networkClient.stop()

    def registerBridgeHandlers(self):
        """Registers Bridge in networkClient"""
        self.networkClient.registerBridge(self.bridge)

            
        


        
    

