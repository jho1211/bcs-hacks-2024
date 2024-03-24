import json
import os
from pymongo import MongoClient

client = MongoClient(host=os.environ.get("ATLAS_URI"))
# Name of collection
db = client.grocery.grocery_lists

def register_id(user_id):
    ## Registers a new grocery list with the given user_id
    if db.find_one({"id": user_id}) is None:
        # Stores the input data
        res = db.insert_one({"id": user_id, "items": []})
        # Checks if the data is stored properly
        if res.inserted_id:
            return True
        # If it is not
        else:
            return False
    else:
        # If the given ID already exists
        return False
        
def register_lambda(event, context):
    print(event)
    user_id = event["id"]
    result = register_id(user_id)
    
    if result:
        return {
            'statusCode': 200, 
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps('Registration successful.')}
    else:
        return {
            'statusCode': 400, 
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps('User already exists.')}

def get_list(user_id):
    # Finds the grocery list for the given user_id
    res = db.find_one({"id": user_id}, {"_id": 0, "items": 1})
    if res:
        return res['items']
    else:
        return None

def get_grocery_list(event, context):
    user_id = event["queryStringParameters"]["id"]
    items = get_list(user_id)
    
    if items is not None:
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'items': items})
        }
    else:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps('User not found.')
        }

def get_grocery_prices(event, context):
    db = client["grocery"]["grocery_prices"]
    query = event["multiValueQueryStringParameters"]["input"]
    results = []
    
    for q in query:
        result = list(db.find({"input_name": q}, projection={'_id': False, 'date': False}))
        results.append(result)
    
    if results:
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(results)
        }
    else:
        return {
            'statusCode': 503,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': "There was an error fetching the grocery prices."
        }

def add_item(user_id, item):
    # Adds an item to the grocery list of the specified user_id
    return db.update_one({"id": user_id}, {"$addToSet": {"items": item}})


def add_grocery_item_to_list(event, context):
    user_id = event.get("id")
    item = event.get("item")
    
    result = add_item(user_id, item)
    
    if result.modified_count != 0:
        return {
            'statusCode': 200, 
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps('Item added successfully.')}
    else:
        return {
            'statusCode': 503,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': "There was an error adding the item to the list. It may already exist."
        }