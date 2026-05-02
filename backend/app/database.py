from pymongo import MongoClient
from .config import settings

client = MongoClient(settings.mongo_uri)
db = client[settings.db_name]

users_collection = db["users"]
ambulance_collection = db["ambulance_bookings"]
complaints_collection = db["complaints"]
sos_collection = db["sos_alerts"]
