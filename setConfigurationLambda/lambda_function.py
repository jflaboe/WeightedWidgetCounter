import json
import boto3
import requests

def verify_user(auth_token):
    return True
    
def get_twitch_user(auth_token):
    try:
        return json.loads(requests.get("https://id.twitch.tv/oauth2/userinfo", headers={"Authorization": "Bearer {}".format(auth_token)}).content)["preferred_username"]
    except Exception as e:
        print(e)
        return None
    
def get_auth_token(event):
    return json.loads(event['body'])["auth_token"]

def get_configuration(event):
    return json.loads(event['body'])["configuration"]
    
def set_configuration(user_id, configuration):
    client = boto3.client('dynamodb')
    
    response = client.update_item(
    TableName='WeightedWidgetConfiguration',
    Key={
        'user_id': {
            'S': user_id
        }
    },
    UpdateExpression="SET configuration = :c",
    ExpressionAttributeValues={
        ":c": {
            "S": json.dumps(configuration)
        }
    })

def lambda_handler(event, context):
    print(event)
    # TODO implement
    auth_token = get_auth_token(event)
    user = get_twitch_user(auth_token)
    if user is None:
        return {
            'statusCode': 400,
            'body': json.dumps('Not authorized'),
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
        }
    else:
        configuration = get_configuration(event)
        set_configuration(user.lower(), configuration)
        return {
            'statusCode': 200,
            'body': json.dumps('Hello from Lambda!'),
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
        }

    
