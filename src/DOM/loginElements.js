const { Button, Grid, Typography, FormControl, InputLabel, OutlinedInput, FormHelperText } = require('@material-ui/core');
const { styles } = require('../../src/DOM/styles');
const { test, lte, equals } = require('ramda');
const { strLength } = require('../../src/someHelpfulMethods');

const buttonElement = (clickHandler, text) => gridWrap(
    <Button 
        style={styles.buttonUser}
        onClick={clickHandler}
        variant="contained" 
        color="primary"
    >
        {text}
    </Button>
)

const inputField = (value, changeValue, state, helper, type, label, rows = 1) => gridWrap(
    <FormControl
        style={styles.inputUser}
        disabled={state === 1}
        error={state === 2}
        variant="outlined"
    >
        <InputLabel 
            htmlFor="component-outlined"
        >
            {label}
        </InputLabel>
        <OutlinedInput 
            multiline={rows > 1}
            rows={rows}
            label={label}
            id="component-outlined"
            type={type}
            value={value}
            onChange={changeValue}
        />
        <FormHelperText>{helper}</FormHelperText>
    </FormControl>
)

const textElement = (variant, text) => gridWrap(
    <Typography variant={variant} gutterBottom style={styles.textUser} align="justify">
            {text}
    </Typography>
)

const gridWrap = (element) => <Grid item xs={12} style={styles.gridUser}>{element}</Grid>

const getValueLength = (value, n) => strLength(value) + "/" + n;

const validNameInput = (ln, arg, state, helper, changeArg, changeState, changeHelper) => {
    const handleChange = e => {
        let newValue = e.target.value;
        let valueLength = strLength(newValue);

        let canBeChanged = lte(valueLength, 20);
        let canBeUsed = lte(5, valueLength) || equals(valueLength, 0);

        canBeChanged && changeArg(e.target.value);
        changeState(canBeUsed ? 0 : 2)
        canBeChanged && changeHelper(getValueLength(newValue, 20) + "     " + (canBeUsed ? "" : ln(2)));
    }

    return inputField(arg, handleChange, state, helper, "text", ln(3));
}

const validUsernameInput = (ln, arg, state, helper, changeArg, changeState, changeHelper) => {
    const handleChange = e => {
        let newValue = e.target.value;
        let valueLength = strLength(newValue);

        let canBeChanged = lte(valueLength, 20);
        let canBeUsed = lte(8, valueLength) || equals(valueLength, 0);

        canBeChanged && changeArg(e.target.value);
        changeState(canBeUsed ? 0 : 2);
        canBeChanged && changeHelper(getValueLength(newValue, 20) + " " + (canBeUsed ? "" : ln(4)));
    };

    return inputField(arg, handleChange, state, helper, "text", ln(5))
}

const validPasswordInput = (ln, arg, state, helper, changeArg, changeState, changeHelper) => {
    const handleChange = e => {
        let newValue = e.target.value;
        let valueLength = strLength(newValue);
        let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        let isStrong = test(strongRegex, newValue) && lte(8, valueLength ) || equals(valueLength, 0) ;

        changeArg(newValue);
        changeState(isStrong ? 0 : 2);
        changeHelper(isStrong ? " " : ln(6));
    }
    return inputField(arg, handleChange, state, helper, "password", ln(7))
}

const validRepeatePasswordInput = (ln, arg, compare, state, helper, changeArg, changeState, changeHelper) => {
    const handleChange = e => {
        let newValue = e.target.value;
        let valueLength = strLength(newValue);
        let isEqual = newValue.localeCompare(compare) === 0 || equals(valueLength, 0);

        changeArg(newValue);
        changeState(isEqual ? 0 : 2);
        changeHelper(isEqual ? " " : ln(9))
    }
    return inputField(arg, handleChange, state, helper, "password", ln(10))
}



module.exports = { 
    textElement, 
    inputField, 
    buttonElement, 
    validNameInput, 
    validUsernameInput,
    validPasswordInput,
    validRepeatePasswordInput,
    gridWrap
}