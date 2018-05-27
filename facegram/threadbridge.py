from .models import FacegramThread

class ThreadBridge(object):
    def __init__(self, networkClient, thread):
        self.thread = thread