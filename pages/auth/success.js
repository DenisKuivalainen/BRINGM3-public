import { useRouter } from 'next/router';
import { useContext } from 'react';
import { checkPriveleges } from '../../src/auth/checkPriveleges';
import { CookieContext } from '../../src/customization/CookieContext';
import { buttonElement, textElement } from '../../src/DOM/loginElements';
import { lang } from '../../src/DOM/styles';
const Success = () => {
    const context = useContext(CookieContext);
    let language = lang(context);

    const router = useRouter();
    
    return (
        <>
            <div style={{height: "10vw"}} />
            {textElement("h6", "Congratualtions!!!")}
            {textElement("subtitle1", language(11))}
            {buttonElement(() => router.push("/auth/login"), language(1))}
        </>
    );
}

export const getServerSideProps = async (context) => await checkPriveleges(context);

export default Success;