import { useContext, useState } from 'react';
import { CookieContext } from '../../src/customization/CookieContext';
import { inputField, buttonElement, textElement } from '../../src/DOM/loginElements';
import { lang } from '../../src/DOM/styles';
import fetchApi from '../../src/fetch';
import { useRouter } from 'next/router';
import { checkPriveleges } from '../../src/auth/checkPriveleges';


const Login = () => {
    // States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameState, setUsernameState] = useState(0);
    const [passwordState, setpasswordState] = useState(0);
    const [usernameHelper, setUsernameHelper] = useState(" ");

    const [canClick, setCanClick] = useState(true);

    // Change field input
    const changeUsername = e => {
        let newValue = e.target.value;
        setUsername(newValue);
        setUsernameHelper(" ");
        setUsernameState(0);
        setpasswordState(0);
    }
    const changePassword = e => setPassword(e.target.value);

    const context = useContext(CookieContext);
    let language = lang(context);
    const router = useRouter();

    const tryLogin = async () => {
        canClick && password.length > 0 && username.length > 0 && await canTryLogin();
        setCanClick(true);
    }

    const canTryLogin = async() => {
        setCanClick(false);
        setUsernameState(1);
        setpasswordState(1);

        let body = {
            user: username,
            pass: password
        };
        let params = {
            method: "POST",
            body: JSON.stringify(body)
        }

        let success = await fetchApi(router)("/api/login/auth", params);

        const setFormsNewValue = () => {
            setUsernameHelper(language(23));
            setUsernameState(2);
            setPassword("");
            setpasswordState(2);
        }

        !!success && setFormsNewValue();
    }

    return(
        <>
            <div style={{height: "10vw"}} />
            {textElement("subtitle1", language(0))}
            {inputField(username, changeUsername, usernameState, usernameHelper, "text", language(5))}
            {inputField(password, changePassword, passwordState, " ", "password", language(7))}
            {buttonElement(tryLogin, language(1))}
        </>
    );
}

export const getServerSideProps = async (context) => await checkPriveleges(context);

export default Login;