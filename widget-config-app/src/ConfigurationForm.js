import {useState, useEffect} from 'react';
import React from 'react';
import TestWidget from './TestWidget';
import GoalsFields from './GoalsFields';
import MainConfigurationFields from './MainConfigurationFields';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TwitchAuth from './TwitchAuth';

const DEFAULT_CONFIG = {
    currencySymbol: "$",
    defaultText: "Tips",
    goals: [],
    weights: {
        bits: 0.01,
        tips: 1,
        primeSub: 5,
        tierOneSub: 5,
        tierTwoSub: 10,
        tierThreeSub: 25
    },
    override: 0
}

function buildConfig() {
    return {
        currencySymbol: document.getElementById("currency-symbol").value,
        defaultText: document.getElementById("default-text").value,
        goals: JSON.parse(document.getElementById("goal-hidden-input").value),
        weights: {
            bits: parseFloat(document.getElementById("bits").value),
            tips: parseFloat(document.getElementById("tips").value),
            primeSub: parseFloat(document.getElementById("prime-sub").value),
            tierOneSub: parseFloat(document.getElementById("tier-one-sub").value),
            tierTwoSub: parseFloat(document.getElementById("tier-two-sub").value),
            tierThreeSub: parseFloat(document.getElementById("tier-three-sub").value),
        },
        override: parseFloat(document.getElementById("override").value)
    }
}

function buildTextConfig() {
    return {
        currencySymbol: document.getElementById("currency-symbol").value,
        defaultText: document.getElementById("default-text").value,
        goals: JSON.parse(document.getElementById("goal-hidden-input").value),
        weights: {
            bits: document.getElementById("bits").value,
            tips: document.getElementById("tips").value,
            primeSub: document.getElementById("prime-sub").value,
            tierOneSub: document.getElementById("tier-one-sub").value,
            tierTwoSub: document.getElementById("tier-two-sub").value,
            tierThreeSub: document.getElementById("tier-three-sub").value,
        },
        override: document.getElementById("override").value
    }
}



export default function ConfigurationForm(props) {
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [isLoading, setIsLoading] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    function updateConfigElement(e){
        let elementId = e.target.id;
        console.log(e)
        document.getElementById(elementId.substring(0, elementId.length-6)).value = e.target.value;
        setConfig(buildTextConfig())
    }
    function updateGoals(goals){
        document.getElementById("goal-hidden-input").value = JSON.stringify(goals);
        setConfig(buildTextConfig())
    }
    function getWidgetConfiguration(user) {
        let body = {
            user: user
        }
        setIsLoading(true)
        fetch("https://api.fendull.com/get-widget-configuration", {
            method: 'POST',
            body: JSON.stringify(body)
        }).then((result) => {
            if (result.ok){
                return result.json()
            } else {
                return DEFAULT_CONFIG;
            }
        }).then((jsonData) => {
            setIsLoading(false)
            setConfig(jsonData)
            setIsLoaded(true)
        })
    }
    return (
        <React.Fragment>
        <form> 
            <input id="goal-hidden-input" type="hidden" name="goals" value={JSON.stringify(config.goals)} />
            <input id="default-text" type="hidden" name="defaultText" value={config.defaultText} />
            <input id="currency-symbol" type="hidden" name="currencySymbol" value={config.currencySymbol} />
            <input id="bits" type="hidden" name="bits" value={config.weights.bits} />
            <input id="tips" type="hidden" name="tips" value={config.weights.tips} />
            <input id="prime-sub" type="hidden" name="primeSub" value={config.weights.primeSub} />
            <input id="tier-one-sub" type="hidden" name="tierOneSub" value={config.weights.tierOneSub} />
            <input id="tier-two-sub" type="hidden" name="tierTwoSub" value={config.weights.tierTwoSub} />
            <input id="tier-three-sub" type="hidden" name="tierThreeSub" value={config.weights.tierThreeSub} />
            <input id="override" type="hidden" name="override" value={config.override} />
        </form>
        <Grid container direction="column">
            <Grid item container id="nav">
                <Grid item xs={9}>
                    <TwitchAuth>
                        <ForceSignIn />
                    </TwitchAuth>
                </Grid>
                <Grid item xs={2}>
                    { !isLoading && <TwitchAuth>
                        <UpdateButton updateConfig={getWidgetConfiguration} isLoaded={isLoaded} />
                    </TwitchAuth> }
                </Grid> 
            </Grid>
            <Grid item container direction="row" spacing={5} justifyContent="center" alignItems="flex-start">
                <Grid item xs={5}>
                    <MainConfigurationFields config={config} updateConfigElement={updateConfigElement}/>
                </Grid>
                <Grid item xs={5}>
                    <TestWidget getConfig={buildConfig}/>
                    <GoalsFields config={config} updateGoals={updateGoals}/>
                </Grid>
            </Grid>
            <Grid item>
            </Grid>
        </Grid>
        
        
        </React.Fragment>
        
    )
}

function UpdateButton(props) {
    const [isError, setIsError] = useState(false);
    const [isComplete, setIsComplete] = useState(false)
    const updateConfig = function() {
        setIsComplete(false)
        let config = buildConfig();
        const body = {
            auth_token: props.authData.accessToken,
            configuration: config
        }
        
        fetch("https://api.fendull.com/set-widget-configuration", {
            method: 'POST',
            body: JSON.stringify(body)
        }).then((result) => {
            setIsComplete(true)
            if (result.ok){
                setIsError(false)
            } else if (result.status === 400){
                props.authData.reset();
                setIsError(true);
            }
        })
    }
    if (props.authData.authorized) {
        if (!props.isLoaded) {
            props.updateConfig(props.authData.idToken.preferred_username.toLowerCase())
        }
        return (
            <React.Fragment>
                <Button variant="contained" onClick={updateConfig}>Update</Button>
                {
                    isComplete && (isError ? "Failed to update" : "Updated Successfully!")
                }
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment></React.Fragment>
        );
    }
}

function ForceSignIn(props) {
    return (
        <Modal open={!props.authData.authorized} style={{top: "50%", left: "50%", backgroundColor:"white", height: "100vh", width:"100vw"}}>
            <React.Fragment>
            <p> Please sign in using your Twitch account</p>
            <Button variant="contained" onClick={()=>{window.location.href = props.authData.authUrl }}>Twitch Sign In</Button>
            </React.Fragment>
        </Modal>
    )
}