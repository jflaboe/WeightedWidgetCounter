class WeightedWidgetCounterConfigurationProvider {
    getOptions() {
        return {};
    }
}

class TestConfigurationProvider extends WeightedWidgetCounterConfigurationProvider {
    getOptions() {
        return {
            test: 1,
            goals: [
                {
                    description: "Run a marathon",
                    value: 100
                },
                {
                    description: "Run an ultra marathon",
                    value: 1000
                },
                {
                    description: "Run an 5k",
                    value: 10
                }
            ],
            weights: {
                tierOneSub: 2.5,
                tierTwoSub: 5,
                tierThreeSub: 10,
                tips: 1,
                bits: 0.01
            },
            defaultText: "Tips",
            currencySymbol: "$"
        }
    }
}

class TestWithDataConfigurationProvider extends WeightedWidgetCounterConfigurationProvider {
    getOptions() {
        return {
            testWithData: {
                counts: {
                    tierOneSub: 1,
                    tierTwoSub: 0,
                    tierThreeSub: 0,
                    tips: 15,
                    bits: 200
                }
            },
            goals: [
                {
                    description: "Run a marathon",
                    value: 100
                },
                {
                    description: "Run an ultra marathon",
                    value: 1000
                },
                {
                    description: "Run an 5k",
                    value: 10
                }
            ],
            weights: {
                tierOneSub: 2.5,
                tierTwoSub: 5,
                tierThreeSub: 10,
                tips: 1,
                bits: 0.01
            },
            defaultText: "Tips",
            currencySymbol: "$"
        }
    }
}

class WeightedWidgetCounterConfigurationProviderImpl extends WeightedWidgetCounterConfigurationProvider {
    getOptions() {
        return this.apiCall();
    }

    async apiCall() {
        let params = new URLSearchParams(document.location.search.substring(1));
        let body = {
            user: params.get('user')
        }
        let result = await fetch("https://api.fendull.com/get-widget-configuration", {
            method: 'POST',
            body: JSON.stringify(body)
        })

        if (result.ok) {
            return await result.json()
        }
        return {}
    }
}

export {
    TestConfigurationProvider,
    TestWithDataConfigurationProvider,
    WeightedWidgetCounterConfigurationProviderImpl
}