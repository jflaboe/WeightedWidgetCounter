import {useState, useCallback, useEffect, React} from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

const validFloat = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
const currencies = [
    {
        value: '',
        label: 'n/a'
    },
    {
        value: '$',
        label: '$',
    },
    {
        value: '€',
        label: '€',
    },
    {
        value: '฿',
        label: '฿',
    },
    {
        value: '¥',
        label: '¥',
    },
  ];
export default function MainConfigurationFields(props) {

    const handleCurrencyUpdate = function(event) {
        props.updateConfigElement({target: {
            id: "currency-symbol-field",
            value: event.target.value
        }})
    }

    return (
        <Grid container direction="column" alignItems="flex-start" spacing={2}>
            <Grid  container item direction="row" align-items="center">
                <Grid item>
                    <TextField id="default-text-field" label="Default text (no goal)" value={props.config.defaultText} onChange={props.updateConfigElement} />
                </Grid>
                <Grid item>
                    <TextField select id="currency-symbol-field" label="currency symbol" value={props.config.currencySymbol} onChange={handleCurrencyUpdate}>
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                    </TextField>
                </Grid>
            </Grid>
            
            <Grid item>
                <Grid item>
                <TextField id="bits-field" error={!validFloat.test(props.config.weights.bits)} label="Bits Weight" value={props.config.weights.bits} onChange={props.updateConfigElement} />
                </Grid>
            </Grid>
                <Grid item>
                <TextField id="tips-field" error={!validFloat.test(props.config.weights.tips)} label="Tips (StreamElements) Weight" value={props.config.weights.tips} onChange={props.updateConfigElement} />
                </Grid> 
            <Grid item>
                <Grid item>
                <TextField id="prime-sub-field" error={!validFloat.test(props.config.weights.primeSub)} label="Prime Sub Weight" value={props.config.weights.primeSub} onChange={props.updateConfigElement} />
                </Grid>
            </Grid>
            <Grid item>
                <Grid item>
                <TextField id="tier-one-sub-field" error={!validFloat.test(props.config.weights.tierOneSub)} label="Tier One Sub Weight" value={props.config.weights.tierOneSub} onChange={props.updateConfigElement} />
                </Grid>
            </Grid>
            <Grid item>
                <Grid item>
                <TextField id="tier-two-sub-field" error={!validFloat.test(props.config.weights.tierTwoSub)} label="Tier Two Sub Weight" value={props.config.weights.tierTwoSub} onChange={props.updateConfigElement} />
                </Grid>
            </Grid>
            <Grid item>
                <Grid item>
                <TextField id="tier-three-sub-field" error={!validFloat.test(props.config.weights.tierThreeSub)} label="Tier Three Sub Weight" value={props.config.weights.tierThreeSub} onChange={props.updateConfigElement} />
                </Grid>
            </Grid>
            <Grid item>
                <Grid item>
                <TextField id="override-field" error={!validFloat.test(props.config.override)} label="Override Value (starting value)" value={props.config.override} onChange={props.updateConfigElement} />
                </Grid>
            </Grid>
        </Grid>
    )
}