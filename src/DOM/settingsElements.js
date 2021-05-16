const { Button, ListItemIcon, Menu, MenuItem, ListItemText, Grid, Typography } = require("@material-ui/core");
const { Brightness4Rounded, Brightness5Rounded, FiberManualRecordRounded, MeetingRoomRounded} = require("@material-ui/icons");
const { compose, map, append } = require("ramda");
const { mapIndexed } = require("ramda-godlike");
const { useState } = require("react");
const palletes = require("../customization/pallete.json");
const { default: fetchApi } = require("../fetch");
const { styles } = require("./styles");

const changeTheme = (isDay, lang, handleClick) => {
    const daytime = () => isDay ?
        <Brightness5Rounded /> :
        <Brightness4Rounded />;

    return (
        <Button
            onClick={e => handleClick(isDay)}
        >
            {daytime()}
        </Button>
    );
}

const palleteItem = (value, k, themeColor, select) => (
    <MenuItem
        autoFocus
        button
        onClick={() => select(k)}
    >
        <ListItemIcon>
            <FiberManualRecordRounded style={{color: themeColor[0]}} />
            <FiberManualRecordRounded style={{color: themeColor[1]}} />
        </ListItemIcon>
        <ListItemText primary={value} />
    </MenuItem>
)

const changePallete = (current, theme, lang, handleChange) => {
    const [anchorEl, setAnchorEl] = useState(null);

    let title = lang(14);

    const closeDialog = (val) => {
        setAnchorEl(null);
        handleChange(val);
    }
    const items = mapIndexed(
        (item, k) => palleteItem(
            item.name, 
            k,
            item[theme ? "dark" : "light"],
            closeDialog
        )
    );
    
    
    return {
        button: () => (
            <Button 
                aria-controls="pallete-menu"
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                {title}
            </Button>
        ),
        menu: () => (
            <Menu
                id="simple-menu"
                    anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => closeDialog(current)}
                elevation={2}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {items(palletes)}
            </Menu>
        )
    }
}

const Line = () => <hr class="MuiDivider-root" style={styles.line}/>

const gridContainer = (item) => !!item ? <Grid xs={12} style={styles.fullGrid}>{item}</Grid> : <></>

const settingsPart = (title, description, content, dropLine) => compose(
    arr => dropLine ? arr : append(<Line />, arr),
    map(gridContainer)
)(
    [
        <Typography variant="h6" style={styles.settingsTitle}>{title}</Typography>,
        <Typography variant="body1" style={{whiteSpace: 'pre-line'}}>{description}</Typography>,
        <p style={{marginTop: 1}} />,
        content
    ]
);

const logoutButton = (text, router) => <Button
    onClick={()=> fetchApi(router)("/api/login/logout")}
    variant="contained"
    color="secondary"
    style={styles.settingsButtonGroup}
    endIcon={<MeetingRoomRounded />}
>
    {text}
</Button>

const gotoButton = (url, router, text) => <Button
    onClick={() => router.push(url)}
    variant="contained"
    color="secondary"
    style={styles.settingsButtonGroup}
>
    {text}
</Button>


module.exports = {
    changeTheme,
    changePallete,
    settingsPart,
    logoutButton,
    gridContainer,
    gotoButton
}