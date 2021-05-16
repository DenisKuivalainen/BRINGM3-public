import { useContext } from "react";
import { checkPriveleges } from "../../src/auth/checkPriveleges";
import { CookieContext } from "../../src/customization/CookieContext";
import { buttonBack } from "../../src/DOM/itemsElements";
import { settingsPart } from "../../src/DOM/settingsElements";
import { lang } from "../../src/DOM/styles";

const help = () => {
    const context = useContext(CookieContext);
    const language = lang(context);

    return [
        buttonBack("/app"),
        settingsPart(
            language(62),
            language(63),
            null,
            true
        )
    ]
}

export const getServerSideProps = async (context) => await checkPriveleges(context);

export default help;