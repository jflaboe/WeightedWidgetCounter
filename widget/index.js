import WeightedCounterWidget from './WeightedCounterWidget.js';
import { WeightedWidgetCounterConfigurationProviderImpl } from './WeightedWidgetCounterConfigurationProvider.js';

function getConfiguration() {
    return new WeightedWidgetCounterConfigurationProviderImpl().getOptions();
}

function initialize(config) {
    return new WeightedCounterWidget(config);
}


let configuration = getConfiguration();
console.log(configuration);
let widget = initialize(configuration);