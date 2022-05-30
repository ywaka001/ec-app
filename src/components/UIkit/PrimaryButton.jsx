import React from 'react';
import Button  from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
    "button":{
        backgroundColor:"#4dd0e1",
        color: "#000",
        fontSize: 16,
        height: 48,
        marginButton: 16,
        width: 256
    }
})

const PrimaryButton = (props) => {
    const classes = useStyle();

    return(
        <Button className={classes.button} variant="contained" onClick={() => props.onClick()}>
            {props.label}
        </Button>

    )
}

export default PrimaryButton