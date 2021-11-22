package main

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"github.com/gempir/go-twitch-irc/v2"
)

func recordDono(bits float64, channel string) {
	fmt.Println("Dono")
}

func recordBits(bits int, channel string) {
	fmt.Println("Bits")
}

func recordPrimeSub(channel string) {
	fmt.Println("Prime")
}

func recordTierOneSub(channel string) {
	fmt.Println("Tier 1")
}

func recordTierTwoSub(channel string) {
	fmt.Println("Tier 2")
}

func recordTierThreeSub(channel string) {
	fmt.Println("Tier 3")
}

func main() {
	// or client := twitch.NewAnonymousClient() for an anonymous user (no write capabilities)
	client := twitch.NewClient("fendull", "")
	re := regexp.MustCompile(".* just tipped " + regexp.QuoteMeta("$") + "([0-9]*" + regexp.QuoteMeta(".") + "[0-9]*).*")


	client.OnPrivateMessage(func(message twitch.PrivateMessage) {
		//fmt.Println("Private Message: " + message.Message)
		if message.User.Name == "streamelements" {
			donoString := re.FindSubmatch([]byte(message.Message))
			if len(donoString) > 0 {
				fmt.Println("Dono message: " + message.Message)
				fmt.Println(donoString)
				donoAmount, _ := strconv.ParseFloat(string(donoString[1]), 32)
				recordDono(donoAmount, message.Channel)
			}
			return
		} 

		if message.Bits > 0 {
			fmt.Println("Bits message: " + message.Message)
			recordBits(message.Bits, message.Channel)
		}
		
	})

	client.OnUserNoticeMessage(func(message twitch.UserNoticeMessage) {
		if strings.Contains(message.Tags["msg-id"], "sub") {
			if message.Tags["msg-param-sub-plan"] == "Prime" {
				recordPrimeSub(message.Channel)
			} else if message.Tags["msg-param-sub-plan"] == "1000" {
				recordTierOneSub(message.Channel)
			} else if message.Tags["msg-param-sub-plan"] == "2000" {
				recordTierTwoSub(message.Channel)
			} else if message.Tags["msg-param-sub-plan"] == "3000" {
				recordTierThreeSub(message.Channel)
			}
		}

	})


	client.Join("mizkif")
	client.Capabilities = []string{twitch.TagsCapability, twitch.CommandsCapability}
	err := client.Connect()
	if err != nil {
		panic(err)
	}
}