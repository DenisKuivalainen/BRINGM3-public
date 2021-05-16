import { useState, useContext } from 'react';
import { CookieContext } from '../../src/customization/CookieContext';
import { buttonElement, textElement, validNameInput, validUsernameInput, validPasswordInput, validRepeatePasswordInput } from '../../src/DOM/loginElements';
import { lang } from '../../src/DOM/styles';
import { useRouter } from 'next/router';
import fetchApi from '../../src/fetch';
import { checkPriveleges } from '../../src/auth/checkPriveleges';

const Register = () => {
    // States
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [nameState, setNameState] = useState(0);
    const [usernameState, setUsernameState] = useState(0);
    const [passwordState, setPasswordState] = useState(0);
    const [repeatPasswordState, setRepeatPasswordState] = useState(0);

    const [nameHelper, setNameHelper] = useState("0/20");
    const [usernameHelper, setUsernameHelper] = useState("0/20");
    const [passwordHelper, setPasswordHelper] = useState(" ");
    const [repeatPasswordHelper, setRepeatPasswordHelper] = useState(" ");

    const [canClick, setCanClick] = useState(true);

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
        setNameState(n);
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
            name: name
        };
        let params = {
            method: "POST",
            body: JSON.stringify(body)
        }

        let success = await fetchApi(router)("/api/login/register", params);

        const setFormsNewValue = () => {
            setUsernameHelper(language(24));
            changeAllStates(0);
            changePassword("");
            setUsernameState(2);
        }

        !!success && setFormsNewValue();
    }

    const tryRegister = async() => {
        let checkFills = nameState === 0 && usernameState === 0 && passwordState === 0 && repeatPasswordState === 0 && repeatPassword.length > 0;
        checkFills && canClick && await canTryRegister();
        setCanClick(true);
    }

    return(
        <>
            <div style={{height: "10vw"}} />
            {textElement("subtitle1", language(8))}
            {validNameInput(language, name, nameState, nameHelper, setName, setNameState, setNameHelper)}
            {validUsernameInput(language, username, usernameState, usernameHelper, setUsername, setUsernameState, setUsernameHelper)}
            {validPasswordInput(language, password, passwordState, passwordHelper, changePassword, setPasswordState, setPasswordHelper)}
            {validRepeatePasswordInput(language, repeatPassword, password, repeatPasswordState, repeatPasswordHelper, setRepeatPassword, setRepeatPasswordState, setRepeatPasswordHelper)}
            {buttonElement(tryRegister, language(12))}
        </>
    );
}

export const getServerSideProps = async (context) => await checkPriveleges(context);

export default Register;