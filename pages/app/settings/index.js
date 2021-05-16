import { ButtonGroup, Link } from "@material-ui/core";
import { useRouter } from "next/router"
import { curry } from "ramda";
import { useContext } from "react";
import { CookieContext } from "../../../src/customization/CookieContext";
import { changePallete, changeTheme, settingsPart, logoutButton, gotoButton } from "../../../src/DOM/settingsElements"
import { lang, styles } from "../../../src/DOM/styles";
import fetchApi from "../../../src/fetch";
import { config } from "../../../src/config";
import { checkPriveleges } from "../../../src/auth/checkPriveleges";
import { addButton, itemAccord, buttonBack } from "../../../src/DOM/itemsElements";

const themePart = () => {
    const router = useRouter();
    const context = useContext(CookieContext);
    const language = lang(context);

    const setCookie = curry((nm, val) => fetchApi(router)("/api/cookies?name=" + nm + "&value=" + val));
    const getCookie = nm => !!context[nm] ? parseInt(context[nm]) : 0;
    const handleThemeChange = (oldVal) => setCookie("theme", (oldVal + 1) % 2);
    const handlePalleteChange = setCookie("pallete");

    let theme = getCookie("theme");
    let pallete = getCookie("pallete");

    const palletChangeItems = changePallete(pallete, theme, language, handlePalleteChange);

    return settingsPart(
        language(15),
        language(16),
        <>
            <ButtonGroup
                style={styles.settingsButtonGroup}
                variant="contained"
                color="secondary"
            >
                {changeTheme(theme, language, handleThemeChange)}
                {palletChangeItems.button()}
            </ButtonGroup>
            {palletChangeItems.menu()}
        </>
    )
}

export const aboutPart = () => {
    const context = useContext(CookieContext);
    const language = lang(context);

    return settingsPart(
        language(17),
        [
            language(18),
            <Link color="secondary" htef={config("links", "git")}>Github</Link>,
            ". \n",
            language(19),
            <Link color="secondary" htef={"d.kuivalainen@yandex.ru"}>d.kuivalainen@yandex.ru</Link>,
            "."
        ],
        null, 1
    )
}

const logoutPart = (nickname) => {
    const router = useRouter();
    const context = useContext(CookieContext);
    const language = lang(context);

    return settingsPart(
        language(20),
        language(37) + nickname + ". " + language(21),
        logoutButton(language(22), router)
    )
}

const addUserPart = () => {
    const context = useContext(CookieContext);
    const language = lang(context);
    const router = useRouter();


    return settingsPart(
        language(42),
        language(43),
        gotoButton("/app/settings/admin/", router, language(44))
    );
}

const Settings = ({nickname, is_head}) => [buttonBack("/app"), themePart(), logoutPart(nickname), is_head && addUserPart(), aboutPart()]

export const getServerSideProps = async (context) => await checkPriveleges(context);

export default Settings;