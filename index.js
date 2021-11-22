import WeightedCounterWidget from './WeightedCounterWidget.js';
import { TestWithDataConfigurationProvider } from './WeightedWidgetCounterConfigurationProvider.js';

function getConfiguration() {
    return new TestWithDataConfigurationProvider().getOptions();
}

function initialize(config) {
    return new WeightedCounterWidget(config);
}


let configuration = getConfiguration();
let widget = initialize(configuration);