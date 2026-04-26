import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
import time

# الربط بالسكرت السحابي
def init_bot():
    config = os.environ.get('FIREBASE_JSON')
    cred = credentials.Certificate(json.loads(config))
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    return firestore.client()

db = init_bot()

def on_snapshot(col_snapshot, changes, read_time):
    for change in changes:
        if change.type.name in ['ADDED', 'MODIFIED']:
            data = change.document.to_dict()
            if data.get('action') == "بدء مراقبة":
                # هنا منطق السيلينيوم للفحص
                change.document.reference.update({"action": "متصل الآن 🟢"})

query = db.collection("activity_logs").where("action", "==", "بدء مراقبة")
query.on_snapshot(on_snapshot)

while True:
    time.sleep(1)
