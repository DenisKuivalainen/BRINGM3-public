import { useRouter } from "next/router";
import { curry, __ } from "ramda";
import { useContext, useState } from "react";
import { checkPriveleges } from "../../src/auth/checkPriveleges";
import { CookieContext } from "../../src/customization/CookieContext";
import { addButton, buttonBack } from "../../src/DOM/itemsElements";
import { inputField, gridWrap } from "../../src/DOM/loginElements";
import { settingsPart } from "../../src/DOM/settingsElements";
import { lang } from "../../src/DOM/styles";
import fetchApi from "../../src/fetch";
import { strLength } from "../../src/someHelpfulMethods";

const Add = () => {
    const router = useRouter();
    const context = useContext(CookieContext);
    let language = lang(context);

    const [item, setItem] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(0);

    const [itemStatus, setItemStatus] = useState(0);
    const [descriptionStatus, setDescriptionStatus] = useState(0);
    const [categoryStatus, setCategoryStatus] = useState(0);

    const [itemHelper, setItemHelper] = useState(0);
    const [descriptionHelper, setDescriptionHelper] = useState(0);

    const handleChange = curry((val, set, setStatus, setHelper) => {
        let length = strLength(val);
        const change = () => {
            set(val);
            setStatus(0);
            setHelper(length);
        }

        length <= 50 && change();
    })

    const handleItemChange = handleChange(__, setItem, setItemStatus, setItemHelper);
    const handleDescChange = handleChange(__, setDescription, setDescriptionStatus, setDescriptionHelper);
    
    const [canClick, setCanClick] = useState(true);
    const clickHandler = () => {
        const changeStatuses = (s, n = 0, itemCh = true, descCh = true, catCh = true) => {
            const change = (fn, ch) => fn(ch ? s : n);

            change(setItemStatus, itemCh);
            change(setDescriptionStatus, descCh);
            change(setCategoryStatus, catCh);
        }
        
        const add = async() => {
            let body = {
                item: item,
                category: category,
                desc: description
            }
            await fetchApi(router)(
                "/api/items",
                {method : "POST", body: JSON.stringify(body)}
            )
            router.push("/app");
        }

        const click = async() => {
            console.log(2)
            setCanClick(false);
            changeStatuses(1);

            let checkItem = strLength(item) > 0;
            // let checkDesc = strLength(description) > 0;
            let checkDesc = true;
            let checkCat = category !== null;
            let checkAll = checkItem && checkDesc && checkCat;

            checkAll ?
                add() :
                changeStatuses(0, 2, checkItem, checkDesc,  checkCat);

            !checkAll && setCanClick(true);
        }

        console.log(1, canClick)
        canClick && click();
    }

    return [
        buttonBack("/app"),
        settingsPart(language(33), language(34), null, 1),
        inputField(item, e => handleItemChange(e.target.value), itemStatus, itemHelper + "/50", "text", language(35)),
        inputField(description, e => handleDescChange(e.target.value), descriptionStatus, descriptionHelper + "/150", "text", language(36), 5),
        gridWrap(addButton(clickHandler, language))
    ];
}

export const getServerSideProps = async (context) => await checkPriveleges(context);

export default Add;