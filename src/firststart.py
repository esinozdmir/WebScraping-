import sys
import json
from bson import json_util
from pymongo import MongoClient

def get_data_from_db():
    client = MongoClient('mongodb+srv://mali:efmukl123@yazlab21.3tqyjnc.mongodb.net/?retryWrites=true&w=majority&appName=Yazlab21')
    db = client.yazlab21
    collection = db.yayinlar
    data = list(collection.find({}))
    return data

if __name__ == '__main__':
    try:
        data = get_data_from_db()
        print(json.dumps(data, default=json_util.default))  # bson modülünü kullanarak ObjectId'leri işle
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)
