import { IconButton, Typography } from "@material-ui/core";
import { HelpOutlineRounded } from "@material-ui/icons";
import { useRouter } from "next/router";
import { append, compose, map } from "ramda";
import { viewOnPath } from "ramda-godlike";
import React, { useContext, useEffect, useState } from "react";
import { checkPriveleges } from "../../src/auth/checkPriveleges";
import { CookieContext } from "../../src/customization/CookieContext";
import { addButton, itemAccord } from "../../src/DOM/itemsElements";
import { gridContainer, settingsPart } from "../../src/DOM/settingsElements";
import { lang } from "../../src/DOM/styles";
import useLongPress from "../../src/DOM/useLongPress";
import fetchApi from "../../src/fetch";

const descPart = (title, description, content, dropLine) => compose(
    arr => dropLine ? arr : append(<Line />, arr),
    map(gridContainer)
)(
    [
        <Typography variant="h6" style={styles.settingsTitle}>{title}</Typography>,
        <Typography variant="body1" style={{whiteSpace: 'pre-line'}}>{description}</Typography>,
        content
    ]
);

const mainApp = (props) => {
    const router = useRouter();
    const context = useContext(CookieContext);
    let language = lang(context);
    const [items, setItems] = useState([]);
    const [itemId, setItemId] = useState(null);
    const [canUpdateItemId, setCanUpdateItemId] = useState(true);

    const fetchItems = async() => setItems(viewOnPath(["message"], await fetchApi(router)("/api/items")));
    useEffect(() => fetchItems(), []);
    
    //#region LONG PRESS
    const deleteOrReserveItem = async (id, method) => {
        setItemId(null);
        setCanUpdateItemId(false);
        
        let body = {id: id};
        await fetchApi(router)(
            "/api/items",
            {method : method, body: JSON.stringify(body)}
        );

        await fetchItems();
        setCanUpdateItemId(true);
    }

    const onLongPressDone = () => {
        !!itemId && deleteOrReserveItem(itemId, "DELETE");
    }
    const onLongPressReserve = () => {
        !!itemId && deleteOrReserveItem(itemId, "PUT");
    }
    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 750,
    }

    const longPressDoneEvent = useLongPress(() => onLongPressDone(), () => {}, defaultOptions);
    const longPressReserveEvent = useLongPress(() => onLongPressReserve(), () => {}, defaultOptions);
    //#endregion 
    
    return [
        settingsPart(
            [!canUpdateItemId ? language(26) : language(25), "   ", <IconButton onClick={() => router.push("/app/help")}><HelpOutlineRounded /></IconButton>],
            language(27),
            props.can_add ? addButton(() => router.push("/app/add"), language) : null,
            1
        ),
        <div style={{marginBottom: 20}} />,
        map(i => itemAccord(i, longPressDoneEvent, longPressReserveEvent, itemId, (id) => canUpdateItemId && setItemId(id), props, language), items),
        <div style={{marginBottom: 10}} />,
        items.length > 0 && gridContainer(<Typography variant="body2" style={{whiteSpace: 'pre-line'}}>{language(61)}</Typography>)
    ]   
}



export const getServerSideProps = async (context) => await checkPriveleges(context);

export default mainApp;