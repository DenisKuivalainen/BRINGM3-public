import { Checkbox, FormControlLabel } from "@material-ui/core";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { checkPriveleges } from "../../../../src/auth/checkPriveleges";
import { CookieContext } from "../../../../src/customization/CookieContext";
import { buttonBack, addButton } from "../../../../src/DOM/itemsElements";
import { gridWrap, validNameInput, validUsernameInput } from "../../../../src/DOM/loginElements";
import { settingsPart } from "../../../../src/DOM/settingsElements";
import { lang } from "../../../../src/DOM/styles";
import fetchApi from "../../../../src/fetch";

const checkboxField = (checked, handleChange, label) => <FormControlLabel
    control={<Checkbox checked={checked} onChange={() => handleChange(!checked)} name={label} />}
    label={label}
/>

const Add = () => {
    const context = useContext(CookieContext);
    const language = lang(context);
    const router = useRouter();

    const [canClick, setCanClick] = useState(true);

    const [canAdd, setCanAdd] = useState(false); 
    const [canDelete, setCanDelete] = useState(false); 

    const [uname, setUname] = useState("");
    const [unameState, setUnameState] = useState(0);
    const [unameHelper, setUnameHelper] = useState("0/20");

    const [name, setName] = useState("");
    const [nameState, setNameState] = useState(0);
    const [nameHelper, setNameHelper] = useState("0/20");

    const tryAdd = () => {
        const changeAllStates = (n) => {
            setUnameState(n);
            setNameState(n);
        }

        const doTryAdd = async () => {
            setCanClick(false);
            changeAllStates(1);

            let body = {
                user: uname,
                name: name,
                add: canAdd,
                reserve: canDelete,
                delete: canDelete
            }
            let params = {
                method: "POST",
                body: JSON.stringify(body)
            }

            let {message} = await fetchApi(router)("/api/login/user", params);

            const abort = () => {
                changeAllStates(2); 
                setCanClick(true); 
                console.log(1)
            }

            message ?  
                router.push("/app/settings/admin") :
                abort();
        }

        (nameState === 0 && unameState === 0 && name.length > 0 && uname.length > 0 && canClick) ?
            doTryAdd() :
            changeAllStates(2);
    }

    return [
        buttonBack("/app/settings/admin"),
        settingsPart(
            language(46),
            language(47),
            null, 
            true
        ),
        <p style={{height: 10}} />,
        validUsernameInput(language, uname, unameState, unameHelper, setUname, setUnameState, setUnameHelper),
        validNameInput(language, name, nameState, nameHelper, setName, setNameState, setNameHelper),
        checkboxField(canAdd, x => canClick && setCanAdd(x), language(39) + language(40) + "."),
        checkboxField(canDelete, x => canClick && setCanDelete(x), language(39) + language(41) + "."),
        <p style={{height: 10}} />,
        gridWrap(addButton(tryAdd, language))
    ]
}

export const getServerSideProps = async (context) => await checkPriveleges(context);

export default Add;