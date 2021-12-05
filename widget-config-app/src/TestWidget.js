import {useState, React, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import WeightedCounterWidget from './WeightedCounterWidget';
import Button from '@mui/material/Button';
import background from './stream.png';

let weightedCounterWidget = null;
export default function TestWidget(props) {
    const [isTest, setIsTest] = useState(true);
    if (weightedCounterWidget !== null){
        weightedCounterWidget.cleanUp();
    }

    const refresh = () => {
        let conf = props.getConfig()
        conf.test = isTest;
        weightedCounterWidget.cleanUp();
        weightedCounterWidget = new WeightedCounterWidget(conf);
    }

    useEffect(()=>{
        let conf = props.getConfig()
        conf.test = isTest;
        weightedCounterWidget = new WeightedCounterWidget(conf);
    }, [])


    return (
        <Grid className="test-widget" container direction="row" justifyContent="center" alignItems="center">
            <Grid item>
            <div id="widget-container" style={{ backgroundImage: `url(${background})` }}>
                <div id="widget-root"></div>
            </div>
            </Grid>
            <Grid item container direction="column" justifyContent="center" alignItems="center" spacing={3}>
                <Grid item><Button variant="contained" onClick={refresh}>Refresh</Button></Grid>
                <Grid item><Button variant="contained" onClick={()=>{setIsTest(!isTest); refresh();}}>{isTest ? "Use Live Data" : "Use Random Data"}</Button></Grid>
            </Grid>
        </Grid>
    )
}