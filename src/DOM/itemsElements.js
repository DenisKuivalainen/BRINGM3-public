const { useRouter } = require('next/router');
const { compose } = require('ramda');
const { gridContainer } = require('./settingsElements');
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, IconButton, Typography, Fab } from "@material-ui/core"
import { ArrowBackIosRounded, AddRounded, CheckRounded, ExpandMoreRounded, PlaylistAddCheckRounded, ShoppingCartRounded, RemoveShoppingCartRounded } from "@material-ui/icons";
import { useContext } from "react";
import { CookieContext } from "../customization/CookieContext";
import { lang } from "./styles";

const buttonBackRaw = (url) => {
    const router = useRouter();
    const context = useContext(CookieContext);
    let language = lang(context);
    return (
        <Button
            style={{marginTop: 10}}
            onClick={() => router.push(url)}
            startIcon={<ArrowBackIosRounded />}
        >
            {language(38)}
        </Button>
    )
}

const addButton = (clickHandler, language) => (
    <Button 
        variant="contained" 
        color="secondary" 
        startIcon={<AddRounded />} 
        style={{float: "right", marginRight: 10}} 
        onClick={clickHandler}
    >
        {language(31)}
    </Button>
);

const itemAccord = (item, longPressDoneEvent, longPressReserveEvent, itemId, setItemId, props, language) => {
    console.log(props)
    let controls = "item-accord-" + item.id;
    let disable = item.id !== itemId;
    let reservedByMe = props.id === item.reserved_id;
    let reservedBySomebody = !!item.reserved_id;
    let notActiveReserved = !reservedByMe && reservedBySomebody;

    //#region HEAD
    const doneButton = () => (
        <IconButton
            disabled={disable}
            color="secondary"
            onClick={e => e.stopPropagation()}
            {...longPressDoneEvent}
            variant="contained"
            aria-label="Acknowledge"
            style={{marginRight: 10}}
        >
            <CheckRounded />
        </IconButton>
    );

    const accordSummary = () => (
        <>  
            {!notActiveReserved && props.can_reserve ? doneButton() : <div style={{marginRight: 58}}/>}
            <Typography style={{alignSelf: "center"}} color={reservedByMe ? "secondary" : "primary"} variant="h6">
                {item.title}
            </Typography>
        </>
    );
    //#endregion

    //#region BODY
    const youWillBring = () => (
        <Typography style={{marginBottom: 5}} color="secondary" variant="body2">
            {language(28)}
        </Typography>
    );

    const accordDetails = () => (
        <div>
            {reservedByMe && youWillBring()}
            <Typography paragraph>
                {item.description}
            </Typography>
            <Typography variant="body2">
                {item.added_id_value + " " + language(32)}
            </Typography>
        </div>
    );
    //#endregion

    //#region FOOT
        const accordActions = () => (
            <Button
                disabled={disable}
                startIcon={reservedByMe ? <RemoveShoppingCartRounded /> : <ShoppingCartRounded />}
                size="small"
                color={reservedByMe ? "default" : "primary"}
                {...longPressReserveEvent}
            >
                {reservedByMe ? language(29) : language(30)}
            </Button>
        );
    //#endregion

    return (
        <>
            <Accordion style={{width: "90%"}} expanded={!disable} disabled={notActiveReserved}>
                <AccordionSummary
                    onClick={() => setItemId(disable ? item.id : null)}
                    expandIcon={<ExpandMoreRounded  />} 
                    aria-controls={controls}
                    id={controls}
                >
                    {accordSummary()}
                </AccordionSummary>
                <AccordionDetails>
                    {accordDetails()}
                </AccordionDetails>
                <AccordionActions>
                    {accordActions()}
                </AccordionActions>
            </Accordion>
        </>
    )
}

module.exports = { 
    buttonBack: compose(gridContainer, buttonBackRaw),
    addButton,
    itemAccord
};