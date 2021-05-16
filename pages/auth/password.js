import { useContext, useState } from 'react';
import { CookieContext } from '../../src/customization/CookieContext';
import { inputField, buttonElement, textElement, validPasswordInput, validRepeatePasswordInput } from '../../src/DOM/loginElements';
import { lang } from '../../src/DOM/styles';
import { useRouter } from 'next/router';
import fetchApi from '../../src/fetch';
import { checkPriveleges } from '../../src/auth/checkPriveleges';

const Pass = ({user}) => {
    const [username, setUsername] = useState(user);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [usernameState, setUsernameState] = useState(0);
    const [passwordState, setPasswordState] = useState(0);
    const [repeatPasswordState, setRepeatPasswordState] = useState(0);

    const [usernameHelper, setUsernameHelper] = useState(" ");
    const [passwordHelper, setPasswordHelper] = useState(" ");
    const [repeatPasswordHelper, setRepeatPasswordHelper] = useState(" ");

    const [canClick, setCanClick] = useState(true);

    const changeUsername = e => setUsername(e.target.value);
    const changePassword = val => {
        setPassword(val);
        setRepeatPassword("");
        setRepeatPasswordState(0);
        setRepeatPasswordHelper(" ");
    }

    const context = useContext(CookieContext);
    let language = lang(context);
    const router = useRouter();

    const changeAllStates = (n) => {
        setUsernameState(n);
        setPasswordState(n);
        setRepeatPasswordState(n);
    }

    const canTryRegister = async() => {
        changeAllStates(1);
        setCanClick(false);

        let body = {
            user: username,
            pass: password,
        };
        let params = {
            method: "PUT",
            body: JSON.stringify(body)
        }

        let success = await fetchApi(router)("/api/login/user_pass", params);

        const setFormsNewValue = () => {
            setUsernameHelper(language(24));
            changeAllStates(0);
            changePassword("");
            setUsernameState(2);
        }

        success.message ? router.push("/auth/success") : setFormsNewValue();
    }

    const tryRegister = async() => {
        let checkFills = (usernameState === 0 || usernameState === 2) && passwordState === 0 && repeatPasswordState === 0 && repeatPassword.length > 0;
        checkFills && canClick && await canTryRegister();
        setCanClick(true);
    }

    return(
        <>
            <div style={{height: "10vw"}} />
            {[
                textElement("subtitle1", language(13)),
                inputField(username, changeUsername, usernameState, usernameHelper, "text", language(5)),
                validPasswordInput(language, password, passwordState, passwordHelper,  changePassword, setPasswordState, setPasswordHelper),
                validRepeatePasswordInput(language, repeatPassword, password, repeatPasswordState, repeatPasswordHelper, setRepeatPassword, setRepeatPasswordState, setRepeatPasswordHelper),
                buttonElement(tryRegister, language(12))
            ]}
        </>
    );
}

export const getServerSideProps = async (context) => {
    await checkPriveleges(context);

    let user = context.query.user;
    return {props: {user: !!user ? user : null}};
}

export default Pass;