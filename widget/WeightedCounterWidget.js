export default class WeightedCounterWidget {
    constructor(opts) {
        this.opts = opts;

        if (opts.test) {
            this.dataProvider = new TestDataProvider(this);
        } else if (opts.testWithData) {
            this.dataProvider = new TestWithDataDataProvider(this);
            this.dataProvider.setData(opts.testWithData);
        } else {
            this.dataProvider = new WeightedCounterWidgetDataProviderImpl(this);
        }

        this.dataProvider.begin();
    }
    cleanUp() {
        this.dataProvider.close();
    }
    render(data) {
        
        let currencySymbol = this.opts.currencySymbol;
        let currentPoints = this.getCurrentPoints(data);
        let nextGoal = this.getNextGoal(currentPoints);
        let preText = this.opts.defaultText + (this.opts.defaultText.length > 0 ? ": " : "");
        let postText = "";

        if (nextGoal) {
            preText = nextGoal.description + ": ";
            postText = " / " + currencySymbol + nextGoal.value.toFixed(0);
        }
        let text = preText + currencySymbol + currentPoints.toFixed(0) + postText;
        document.getElementById("widget-root").innerHTML = text; 
    }

    getCurrentPoints(data) {
        if (data.counts && this.opts.weights) {
            return data.counts.tierOneSub * this.opts.weights.tierOneSub
            + data.counts.tierTwoSub * this.opts.weights.tierTwoSub
            + data.counts.tierThreeSub * this.opts.weights.tierThreeSub
            + data.counts.tips * this.opts.weights.tips
            + data.counts.bits * this.opts.weights.bits
            + data.counts.primeSub * this.opts.weights.primeSub + (this.opts.override | 0);
        }
        
        return 0;
    }

    getNextGoal(currentPoints) {
        if (!currentPoints && currentPoints !== 0){
            console.log("No points");
            return null;
        }

        if (!this.opts.goals || this.opts.goals.length == 0) {
            console.log("No goals");
            return null;
        }

        let goals = this.opts.goals;
        let sortedGoals = goals.sort((goal, otherGoal) => {return goal.value < otherGoal.value})
        
        let i = 0;
        while (i < goals.length) {
            if (goals[i].value > currentPoints){
                return goals[i];
            }
            i += 1;
        }
        return goals[-1];
    }
}

class WeightedCounterWidgetDataProvider {
    constructor(widget) {
        this.widget = widget;
    }

    begin() {
        console.log("Starting data provider");
    }

    close() {
        console.log("Stopping data provider");
    }

    reset() {
        console.log("Resetting data provider");
    }
}

class TestDataProvider extends WeightedCounterWidgetDataProvider{
    constructor(widget) {
        super(widget);
        this.interval = null;
    }

    begin() {
        const applyCallback = () => {
            this.widget.render(this.randomData())
        };

        this.interval = setInterval(applyCallback, 3000);
    }

    close() {
        try {
            clearInterval(this.interval);
        } catch (e) {
            console.log(e)
            console.log("Data Provider not running")
        }
    }

    reset() {
        this.close();
        this.begin();
    }

    randomData() {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        return {
            counts: {
                tierOneSub: getRandomInt(50),
                tierTwoSub: getRandomInt(10),
                tierThreeSub: getRandomInt(1),
                tips: getRandomInt(100),
                bits: getRandomInt(1000),
            }
        }
    }
}

class TestWithDataDataProvider extends WeightedCounterWidgetDataProvider{
    constructor(widget) {
        super(widget);
        this.interval = null;
        this.data = null;
    }

    begin() {
        const applyCallback = () => {
            this.widget.render(this.getData())
        };

        this.interval = setInterval(applyCallback, 3000);
    }

    close() {
        try {
            this.interval.clearInterval();
        } catch (e) {
            console.log("Data Provider not running")
        }
    }

    reset() {
        this.close();
        this.begin();
    }

    setData(data) {
        this.data = data;
    } 

    getData() {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        return {
            counts: {
                tierOneSub: 1,
                tierTwoSub: 0,
                tierThreeSub: 0,
                tips: 0,
                bits: 0,
            }
        }
    }
}

class WeightedCounterWidgetDataProviderImpl extends WeightedCounterWidgetDataProvider {
    constructor(widget) {
        super(widget);
        this.socket = null
        this.interval = null
    }

    sendPing() {
        this.socket.send("PING")
    }

    update(message) {
        let data = JSON.parse(message.data);
        console.log(data)
        this.widget.opts = data.configuration
        this.widget.render(data)
    }

    begin() {
        let params = new URLSearchParams(document.location.search.substring(1));
        let socket = new WebSocket("wss://websocket.fendull.com?user=" + params.get('user'));
        socket.onopen = () => {this.sendPing.bind(this)};
        this.socket = socket;
        this.socket.onmessage = this.update.bind(this);
        this.socket.onclose = this.reset.bind(this);
        setTimeout(this.sendPing.bind(this), 5000);
        this.interval = setInterval((this.sendPing.bind(this)), 60000);
    }

    close() {
        clearInterval(this.interval)
        this.socket.close();
    }

    reset() {
        try {
            this.close();
        } catch(e) {
            console.log(e)
        }
        
        this.begin();
    }
}