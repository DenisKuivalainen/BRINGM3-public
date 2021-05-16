const { viewOnPath } = require("ramda-godlike");
const { useState, useLayoutEffect } = require("react");
const languages = require('../customization/lang.json');

const useClientHeight = (sub) => {
    const [size, setSize] = useState(0);
    const updateSize = () => setSize(document.documentElement.clientHeight);

    // Get window size
    useLayoutEffect(() => {
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Get client size
    sub = !!sub ? sub : 0;

    return size - sub;
}

const lang = ({ lang }) => (opt) => {
    let ln = lang ? parseInt(lang) : 0;
    let phrase = viewOnPath([ln, "content", opt], languages);
    return !!phrase ? phrase : "ERROR! Contact support."
}

const styles ={
    textUser: {
        marginLeft: "5%",
        marginRight: "5%",
        width: "90%",
        maxWidth: 500*0.9,
        minWidth: 200*0.9
    },
    inputUser: {
        width: "100%",
        maxWidth: 500,
        minWidth: 200
    },
    pics: {
        width: "100%",
        maxWidth: 450,
        minWidth: 180
    },
    buttonUser: {
        marginLeft: "55%",
        marginRight: "5%",
        width: "40%",
        maxWidth: 500*0.4,
        minWidth: 200*0.4
    },
    gridUser: {
        width: "80%",
        maxWidth: 500*0.8,
        minWidth: 200*0.8,
    }, 
    menuToolbar: {
        width: "100%",
        maxWidth: 800,
        minWidth: 300,
        marginLeft: "auto",
        marginRight: "auto",
        minHeight: 56
    },
    menuIconButton: {
        marginLeft: 7
    },
    menuButtons: {
        marginLeft: "auto",
        marginRight: 0
    },
    paperContainer: {
        marginTop: 56,
        paddingTop: 4,
        width: "100%",
        maxWidth: 840,
        minWidth: 300*840/800,
        marginLeft: "auto",
        marginRight: "auto",
    },
    gridContainer: {
        width: "100%",
        maxWidth: 840,
        minWidth: 300*840/800,
    },
    line: {
        width: "90%",
        marginTop: 15,
        marginBottom: 15
    },
    fullGrid: {
        width: "90%",
        paddingTop: 2,
        paddingBottom: 2
    },
    settingsButtonGroup: {
        float: "right",
        marginRight: 10
    },
    settingsTitle: {
        marginTop: 15
    },
    mainLogo: {minHeight: 47, maxHeight: 126, height: "auto", margin: "5% 10% 3% 10%"}
};



module.exports = { styles, useClientHeight, lang };