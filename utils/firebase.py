import os
import json
import firebase_admin
import pyrebase
from firebase_admin import credentials, auth
from dotenv import load_dotenv

try:
    # Load environment variables locally
    if not os.getenv('VERCEL'):
        load_dotenv()

    firebase_credentials = os.environ.get('FIREBASE_CREDENTIALS')
    firebase_config = os.environ.get('FIREBASE_CONFIG')

    if not firebase_credentials or not firebase_config:
        raise ValueError("Firebase credentials or config not found in environment variables")

    cred = credentials.Certificate(json.loads(firebase_credentials))
    firebase = firebase_admin.initialize_app(cred)
    
    pb = pyrebase.initialize_app(json.loads(firebase_config))
except Exception as e:
    print(f"Firebase initialization error: {e}")
    raise