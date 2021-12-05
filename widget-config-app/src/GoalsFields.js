import {useState, useCallback, useEffect, React} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";

const validFloat = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;

function Goal(props) {
    return (
        <ListItem className={props.idx % 2 == 0 ? "list-item-even": "list-item-odd"}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    {props.description}
                </Grid>
                <Grid item xs={2}>
                    {"$" + props.value.toString()}
                </Grid>
                <Grid item alignItems="stretch" xs={1} style={{ display: "flex" }}>
                    <IconButton onClick={props.removeItem}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </ListItem>
    )
}

export default function GoalsFields(props) {
    const [newGoalName, setNewGoalName] = useState("");
    const [newGoalValue, setNewGoalValue] = useState("0");

    let addGoals = useCallback(() => {
        props.config.goals.push({description: newGoalName, value: parseFloat(newGoalValue)})

        props.updateGoals(props.config.goals)
        setNewGoalName("");
        setNewGoalValue(0);
    });
    let removeGoal = useCallback(function(idx) {
        let newGoals = props.config.goals.filter((value, index) => {return index !== idx});
        props.updateGoals(newGoals);
        
    })

    return (
        <div id="goals-fields">
            <div id="new-goal">
                <Grid container>
                    <Grid item>
                        <TextField 
                            className="new-goal-input"
                            label="goal description"
                            value={newGoalName}
                            onChange={(e)=>{setNewGoalName(e.target.value)}} />
                    </Grid>
                    <Grid item>
                        <TextField
                            error={!validFloat.test(newGoalValue)}
                            helperText={validFloat.test(newGoalValue) ? "" : "Must be a number"}
                            className="new-goal-input"
                            label="goal value"
                            value={newGoalValue}
                            onChange={(e)=>{setNewGoalValue(e.target.value)}} />
                    </Grid>
                    <Grid item alignItems="stretch" style={{ display: "flex" }}>
                        <Button disabled={!validFloat.test(newGoalValue)} variant="contained" onClick={addGoals}>
                            Add Goal
                        </Button>
                    </Grid>
                </Grid>
            </div>
            <List>
                {props.config.goals.map((goal, idx) => {
                    return (<Goal
                    key={idx.toString() + goal.description + goal.value.toString()}
                    description={goal.description}
                    value={goal.value}
                    idx={idx}
                    removeItem={()=>{removeGoal(idx)}}/>)
                })}
            </List>
        </div>
    )
}