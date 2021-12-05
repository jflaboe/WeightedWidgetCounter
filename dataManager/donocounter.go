package main

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"github.com/gempir/go-twitch-irc/v2"
	"sync"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/aws"
)

type WidgetCounts struct {
	Bits int
	Tips float64
	PrimeSub int
	TierOneSub int
	TierTwoSub int
	TierThreeSub int
}

type WidgetData struct {
	channelName string
	counts *WidgetCounts
	mu sync.Mutex
}


func resetCounter(channel string, data *WidgetData) {
	data.counts.Tips = 0
	data.counts.Bits = 0
	data.counts.TierOneSub = 0
	data.counts.TierTwoSub = 0
	data.counts.TierThreeSub = 0
	data.counts.PrimeSub = 0
}
func recordData(data *WidgetData, key string, value *string, channel) {
	data.mu.Lock()
	defer data.mu.Unlock()
	svc := dynamodb.New(session.New(&aws.Config{
		Region: aws.String("us-west-2"),
	}))
	
	input := &dynamodb.UpdateItemInput{
	ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
		":v": {
			N: value,
		},
	},
	TableName: aws.String("WeightedWidgetConfiguration"),
	Key: map[string]*dynamodb.AttributeValue{
        "user_id": {
            S: aws.String(channel),
        },
    },
	UpdateExpression: aws.String("ADD counts." + key + " :v"),
	}
	
	result, err := svc.UpdateItem(input)
	fmt.Println(result)
	fmt.Println(err)
}

func main() {
	data := &WidgetData{channelName: "extraemily", counts: &WidgetCounts{Tips: 0, Bits: 0, TierOneSub: 0, TierTwoSub: 0, TierThreeSub: 0, PrimeSub: 0}}
	// or client := twitch.NewAnonymousClient() for an anonymous user (no write capabilities)
	fmt.Println(data)
	client := twitch.NewClient("fendull", "")
	re := regexp.MustCompile(".* just tipped " + regexp.QuoteMeta("$") + "([0-9]*" + regexp.QuoteMeta(".") + "[0-9]*).*")


	client.OnPrivateMessage(func(message twitch.PrivateMessage) {
		fmt.Println("Private Message: " + message.Message)
		if message.User.Name == "streamelements" {
			donoString := re.FindSubmatch([]byte(message.Message))
			if len(donoString) > 0 {
				fmt.Println("Dono message: " + message.Message)
				fmt.Println(donoString)
				donoAmount, _ := strconv.ParseFloat(string(donoString[1]), 32)
				go recordData(data, "tips", aws.String(fmt.Sprintf("%f", donoAmount)), message.Channel)
			}
			return
		} 

		if message.Bits > 0 {
			fmt.Println("Bits message: " + message.Message)
			go recordData(data, "bits", aws.String(strconv.Itoa(message.Bits)), message.Channel)
		}
		
	})

	client.OnUserNoticeMessage(func(message twitch.UserNoticeMessage) {
		if strings.Contains(message.Tags["msg-id"], "sub") && !strings.Contains(message.Tags["msg-id"], "mystery") {
			fmt.Println("SUB")
			if message.Tags["msg-param-sub-plan"] == "Prime" {
				go recordData(data, "primeSub", aws.String(strconv.Itoa(1)), message.Channel)
			} else if message.Tags["msg-param-sub-plan"] == "1000" {
				go recordData(data, "tierOneSub", aws.String(strconv.Itoa(1)), message.Channel)
			} else if message.Tags["msg-param-sub-plan"] == "2000" {
				go recordData(data, "tierTwoSub", aws.String(strconv.Itoa(1)), message.Channel)
			} else if message.Tags["msg-param-sub-plan"] == "3000" {
				go recordData(data, "tierThreeSub", aws.String(strconv.Itoa(1)), message.Channel)
			}
		}

	})
	client.OnConnect(func() {
		fmt.Println("CONNECTED")
	})

    fmt.Println("STARTING")
	client.Join("extraemily")
	client.Join("nicro")
	fmt.Println("Joined")
	client.Capabilities = []string{twitch.TagsCapability, twitch.CommandsCapability}
	err := client.Connect()
	if err != nil {
		panic(err)
	}
}