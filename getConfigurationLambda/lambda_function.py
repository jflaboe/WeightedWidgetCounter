import json
import boto3


def get_user(event):
    return json.loads(event['body'])["user"]
    
def get_configuration(user_id):
    client = boto3.client('dynamodb')
    
    response = client.get_item(
    TableName='WeightedWidgetConfiguration',
    Key={
        'user_id': {
            'S': user_id
        }
    })
    print(response)
    return response['Item']['configuration']['S']

def lambda_handler(event, context):
    print(event)
    user = get_user(event)
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
        configuration = get_configuration(user)
        return {
            'statusCode': 200,
            'body': configuration,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
        }

    
