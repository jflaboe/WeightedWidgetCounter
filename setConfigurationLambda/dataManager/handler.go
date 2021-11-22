package main

import (
        "fmt"
        "context"
        "github.com/aws/aws-lambda-go/lambda"
		"github.com/aws/aws-sdk-go/aws"
		"github.com/aws/aws-sdk-go/aws/session"
		"github.com/aws/aws-sdk-go/service/dynamodb"
		"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type SetConfigurationEvent struct {
        Name string
}

func HandleRequest(ctx context.Context, event SetConfigurationEvent) (string, error) {
        return fmt.Sprintf("Hello %s!", name.Name ), nil
}

func main() {
        lambda.Start(HandleRequest)
}