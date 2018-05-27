from collections import namedtuple

# FacegramThread holds thread related data
FacegramThread = namedtuple("FacegramThread", "facebookID telegramChatId telegramUsername")

# FacegramUser holds telegram user related information
FacegramUser = namedtuple("FacegramUser", "userId accessHash")