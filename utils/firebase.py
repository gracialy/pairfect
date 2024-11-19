import os
import json
import firebase_admin
import pyrebase
from firebase_admin import credentials, auth

try:
    firebase_credentials = os.environ.get('FIREBASE_CREDENTIALS')
    firebase_config_str = os.environ.get('FIREBASE_CONFIG')
    
    if not firebase_credentials or not firebase_config_str:
        raise ValueError("Firebase credentials or config not found in environment variables")
    
    with open('/tmp/firebase_key.json', 'w') as f:
        f.write(firebase_credentials)
    
    cred = credentials.Certificate('/tmp/firebase_key.json')
    firebase = firebase_admin.initialize_app(cred)
    
    firebase_config = json.loads(firebase_config_str)
    pb = pyrebase.initialize_app(firebase_config)
except Exception as e:
    print(f"Firebase initialization error: {e}")
    raise