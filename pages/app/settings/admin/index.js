import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, IconButton, Snackbar, Tooltip, Typography } from "@material-ui/core";
import { DeleteRounded, EditRounded, ExpandMoreRounded, LinkRounded, NoEncryptionRounded, PlaylistAddRounded, ShoppingCartRounded } from "@material-ui/icons";
import MuiAlert from '@material-ui/lab/Alert';
import { useRouter } from "next/router";
import { compose, find, length, map } from "ramda";
import { viewOnPath } from "ramda-godlike";
import { useContext, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { checkPriveleges } from "../../../../src/auth/checkPriveleges";
import { CookieContext } from "../../../../src/customization/CookieContext";
import { buttonBack } from "../../../../src/DOM/itemsElements";
import { gotoButton, gridContainer, settingsPart } from "../../../../src/DOM/settingsElements";
import { lang } from "../../../../src/DOM/styles";
import useLongPress from "../../../../src/DOM/useLongPress";
import fetchApi from "../../../../src/fetch";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />

const usersAccord = (current, setCurrent, deleteMethod, resetPassMethod, editMethod, lang, setOpen) => ({username, nickname, pass, id, can_add, can_reserve}) => {
    var active = current !== id;
    
    return <Accordion style={{width: "90%"}} expanded={!active}>
        <AccordionSummary
            onClick={() => setCurrent(id)}
            expandIcon={<ExpandMoreRounded />} 
        >
            <Typography variant="h6">
                {nickname} 
                {can_add && <PlaylistAddRounded style={{maxHeight: 20, marginLeft: 5}}/>}
                {can_reserve && <ShoppingCartRounded style={{maxHeight: 20, marginLeft: 5}}/>}
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div>
                <Typography variant="body1" paragraph>
                    {username}
                </Typography>
                {
                    (can_add || can_reserve) && <Typography variant="body2">
                        {
                            (lang(39) + (can_add ? lang(40) : "") + (can_add && can_reserve ? ", " : "") + (can_reserve ? lang(41) : "") + ".")
                        }
                    </Typography>
                }
            </div>
        </AccordionDetails>
        <AccordionActions>
            <IconButton {...editMethod}>
                <EditRounded />
            </IconButton>
            {
                pass ? 
                    <IconButton style={{marginLeft: 20}} {...resetPassMethod}>
                        <NoEncryptionRounded />
                    </IconButton>
                    :
                    <CopyToClipboard text={"https://bringm3.herokuapp.com/auth/password?user=" + username}>
                        <IconButton style={{marginLeft: 20}} onClick={() => setOpen(true)}>
                            <LinkRounded />
                        </IconButton>
                    </CopyToClipboard>
            }
            <IconButton style={{marginLeft: 20}} {...deleteMethod}>
                <DeleteRounded />
            </IconButton>
        </AccordionActions>
    </Accordion>
}

const Admin = () => {
    const router = useRouter();
    const context = useContext(CookieContext);
    const language = lang(context);

    const [open, setOpen] = useState(false);

    const [canAction, setCanAction] = useState(true);
    const [users, setUsers] = useState([]);
    const [current, setCurrent] = useState(null);

    const fetchUsers = async () => setUsers(viewOnPath(["message"], await fetchApi(router)("/api/login/user")));
    useEffect(() => fetchUsers(), []);

    const getUsernameById = () => compose(({username}) => username, find(({id}) => id === current))(users);

    const editOnPress = () => {
        let userToEdit = find(({id}) => id === current, users);
        router.push({
            pathname: "/app/settings/admin/edit",
            query: userToEdit
        });
    }

    const resetPassOnPress = () => {
        const resetPass = async () => {
            setCanAction(false);
            setCurrent(null);

            await fetchApi(router)("/api/login/user_pass", {method : "DELETE", body: JSON.stringify({user: getUsernameById()})});
            await fetchUsers();

            setCanAction(true);
        }

        canAction && resetPass();
    }

    const deleteOnPress = () => {
        const deleteUser = async () => {
            setCanAction(false);
            setCurrent(null);

            await fetchApi(router)("/api/login/user", {method : "DELETE", body: JSON.stringify({user: getUsernameById()})});
            await fetchUsers();

            setCanAction(true);
        }

        canAction && deleteUser();
    }

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 1500,
    }

    const longPressDelete = useLongPress(deleteOnPress, () => {}, defaultOptions);
    const longPressResetPass = useLongPress(resetPassOnPress, () => {}, defaultOptions);
    const longPressEdit = useLongPress(editOnPress, () => {}, defaultOptions);

    return [
        buttonBack("/app/settings"),
        settingsPart(
            language(44),
            language(45),
            length(users) < 9 && gotoButton("/app/settings/admin/add", router, language(46)),
            true
        ),
        <p style={{marginTop: 20}} />,
        map(usersAccord(current, (i) => setCurrent(current === i || !canAction ? null : i), longPressDelete, longPressResetPass, longPressEdit, language, setOpen), users),
        <div style={{marginBottom: 10}} />,
        users.length > 0 && gridContainer(<Typography variant="body2" style={{whiteSpace: 'pre-line'}}>{language(61)}</Typography>),
        <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
            <Alert severity="info" color="secondary" onClose={() => setOpen(false)}>{language(64) }</Alert>
        </Snackbar>
    ];
}

export const getServerSideProps = async (context) => await checkPriveleges(context);

export default Admin;

// navigator.clipboard.writeText(