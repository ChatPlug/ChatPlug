import configparser
import json
from pathlib import Path
from .models import FacegramThread

class FacegramConfig(object):
    """Handles all configuration related stuff"""
    def __init__(self):
        self.config = configparser.ConfigParser()
    
    def readConfig(self):
        """Reads config from configuration.ini"""
        configFile = Path("config.ini")
        if configFile.is_file():
            self.config.read("config.ini")
            return self.config
        else:
            self.writeDefaultConfig()
    
    
    def writeDefaultConfig(self):
        """Writes default config and exits"""
        self.config['TELEGRAM'] = {'api_id': 'TELEGRAM_API_ID',
        'api_hash': 'TELEGRA_API_HASH',
        'username': 'TELEGRAM_USERNAME'}

        self.config['FACEBOOK'] = {'login': 'FACEBOOK_EMAIL',
        'password': 'FACEBOOK_PASSWORD'}

        with open('config.ini', 'w') as configFile:
            self.config.write(configFile)
        
        print("Configure bridge with config.ini")
        exit()

    def loadThreads(self):
        """Loads saved conversations from file"""
        conversationConf = Path("conversations.json")
        if conversationConf.is_file():
            with open('conversations.json') as conversationFile:
                return json.load(conversationFile)        
        else:
            with open('conversations.json', 'w') as conversationFile:
                conversationFile.write(json.dumps([]))
                return self.loadThreads()

    """Writes full conversation to file"""
    def addThread(self, thread):
        threads = self.loadThreads()
        with open('conversations.json', 'w') as conversationFile:
            conversationFile.write(json.dumps(threads+[thread]))
