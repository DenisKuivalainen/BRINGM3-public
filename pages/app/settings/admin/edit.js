import { Checkbox, FormControlLabel, Button } from "@material-ui/core";
import { EditRounded } from "@material-ui/icons";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { checkPriveleges } from "../../../../src/auth/checkPriveleges";
import { CookieContext } from "../../../../src/customization/CookieContext";
import { buttonBack } from "../../../../src/DOM/itemsElements";
import { gridWrap,  } from "../../../../src/DOM/loginElements";
import { settingsPart } from "../../../../src/DOM/settingsElements";
import { lang } from "../../../../src/DOM/styles";
import fetchApi from "../../../../src/fetch";

const checkboxField = (checked, handleChange, label) => <FormControlLabel
    control={<Checkbox checked={checked} onChange={() => handleChange(!checked)} name={label} />}
    label={label}
/>

const Edit = () => {
    const context = useContext(CookieContext);
    const language = lang(context);
    const router = useRouter();
    const [query, setQuery] = useState(router.query);

    useEffect(() => {
        !!!query.id && router.push("/app/settings/admin");
    }, []);

    const [canClick, setCanClick] = useState(true);

    const [canAdd, setCanAdd] = useState(JSON.parse(query.can_add)); 
    const [canDelete, setCanDelete] = useState(JSON.parse(query.can_delete)); 

    const tryAdd = () => {
        const doTryAdd = async () => {
            setCanClick(false);

            let body = {
                id: query.id,
                add: canAdd,
                reserve: canDelete,
                delete: canDelete
            }
            let params = {
                method: "PUT",
                body: JSON.stringify(body)
            }

            let {message} = await fetchApi(router)("/api/login/user", params);

            message ?  
                router.push("/app/settings/admin") :
                setCanClick(true);
        }

        doTryAdd();
    }

    return [
        buttonBack("/app/settings/admin"),
        settingsPart(
            language(48),
            language(49) + query.nickname + " (" + query.username + ") " + language(50),
            null, 
            true
        ),
        <p style={{height: 20}} />,
        checkboxField(canAdd, x => canClick && setCanAdd(x), language(39) + language(40) + "."),
        checkboxField(canDelete, x => canClick && setCanDelete(x), language(39) + language(41) + "."),
        <p style={{height: 10}} />,
        gridWrap(
            <Button
                variant="contained" 
                color="secondary"  
                style={{float: "right", marginRight: 10}} 
                onClick={tryAdd}
                endIcon={<EditRounded />}
            >
                {language(51)}
            </Button>
        )
    ]
}

export const getServerSideProps = async (context) => await checkPriveleges(context);

export default Edit;