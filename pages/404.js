import { Typography } from "@material-ui/core"

export const error = (message) => (
    <>
        <div style={{height: "20vw"}} />
        <Typography variant="h5" >{message}</Typography>
    </>
)

export default () => error("404  |  This page could not be found.");