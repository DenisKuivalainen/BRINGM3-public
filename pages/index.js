import { IconButton, Link, SvgIcon, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useContext } from "react";
import { checkPriveleges } from "../src/auth/checkPriveleges";
import { CookieContext } from "../src/customization/CookieContext";
import { lang, styles } from "../src/DOM/styles";
import Carousel from '@brainhubeu/react-carousel';
import { aboutPart } from "./app/settings";
import { settingsPart } from "../src/DOM/settingsElements";
import { ArrowBackIosRounded, ArrowForwardIosRounded } from "@material-ui/icons";

export default function Home() {
  const router = useRouter();
  const context = useContext(CookieContext);
  const language = lang(context);

  return (
    <>
      <SvgIcon color="primary" style={styles.mainLogo} viewBox="0 0 303 57">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M303 5.04425H272.091L258 0V3.53094L261.475 5.54865L268.929 22.1907V29.3575L260.571 48.6628H297.857V41.3023H272.091L277.234 29.3575H291.429V23.9631L302.975 10.9533L302.862 10.8915H303V5.04425ZM298.33 10.8915L288.301 22.1907H283.195L293.755 10.8915H298.33ZM288.972 10.8915L278.412 22.1907H277.234L275.459 18.2896L282.316 10.8915H288.972ZM272.091 10.8915H277.546L273.888 14.8386L272.091 10.8915ZM292.714 57C294.845 57 296 55.645 296 53.9734C296 52.3019 294.845 50.9469 292.714 50.9469C290.584 50.9469 289.5 52.3019 289.5 53.9734C289.5 55.645 290.584 57 292.714 57ZM269 53.9734C269 55.645 268.13 57 266 57C263.87 57 263 55.645 263 53.9734C263 52.3019 263.87 50.9469 266 50.9469C268.13 50.9469 269 52.3019 269 53.9734ZM24.896 36.472C24.896 40.248 22.336 42.36 17.984 42.36H8.96001V30.328H17.792C22.144 30.328 24.896 32.632 24.896 36.472ZM23.808 17.848C23.808 21.496 21.376 23.416 17.152 23.416H8.96001V12.216H17.152C21.376 12.216 23.808 14.264 23.808 17.848ZM33.984 37.56C33.984 32.312 30.4 27.64 25.344 26.744C29.696 25.336 32.96 21.944 32.96 16.504C32.96 9.84802 27.776 4.98401 18.432 4.98401H0V49.656H19.264C28.544 49.656 33.984 44.664 33.984 37.56ZM64.805 18.872C64.805 22.904 62.565 25.528 57.573 25.528H50.085V12.408H57.573C62.565 12.408 64.805 14.904 64.805 18.872ZM54.309 32.248L64.165 49.656H74.533L63.845 31.544C71.013 29.624 74.021 24.12 74.021 18.68C74.021 11.192 68.645 4.98401 57.893 4.98401H41.125V49.656H50.085V32.248H54.309ZM134.561 35.64L114.272 4.91998H105.312V49.656H114.272V19L134.561 49.656H143.52V4.91998H134.561V35.64ZM150.199 27.256C150.199 13.88 160.055 4.40802 172.983 4.40802C182.967 4.40802 190.903 9.46399 193.783 18.424H183.479C181.431 14.648 177.719 12.664 172.983 12.664C164.983 12.664 159.415 18.36 159.415 27.256C159.415 36.344 165.047 41.976 173.367 41.976C180.279 41.976 184.695 38.008 186.039 31.672H170.679V24.824H194.871V32.632C193.079 41.72 184.951 50.04 173.047 50.04C160.055 50.04 150.199 40.632 150.199 27.256ZM210.46 20.6L222.492 49.656H229.276L241.244 20.6V49.656H250.204V4.98401H240.092L225.884 38.2L211.676 4.98401H201.5V49.656H210.46V20.6ZM95.437 49.656H86.221V11.256H80.013V3H95.437V49.656Z"/>
      </SvgIcon>
      <Typography variant="h5" style={{width: "85%"}}>
        {language(52)}
      </Typography>
      <p style={{marginTop: 5}} />
        <Carousel
          autoPlay={6000}
          infinite
          addArrowClickHandler
          arrowRight={<IconButton><ArrowForwardIosRounded /></IconButton>}
          arrowLeft={<IconButton><ArrowBackIosRounded /></IconButton>}
        >
          <img src={"/pics/pict1.PNG"} style={styles.pics}/>
          <img src={"/pics/pict2.PNG"} style={styles.pics}/>
          <img src={"/pics/pict3.PNG"} style={styles.pics}/>
          <img src={"/pics/pict4.PNG"} style={styles.pics}/>
          <img src={"/pics/pict5.PNG"} style={styles.pics}/>
        </Carousel>

      <Typography style={{width: "85%"}} variant="h6" paragraph>
        {language(53)}
        {<Link color="secondary" onClick={() => {router.push("/auth/register")}}>{language(54)}</Link>}
        {language(55)}      
      </Typography>
      <Typography style={{width: "85%"}} variant="h6" paragraph>
        {language(56)}
        {<Link color="secondary" onClick={() => {router.push("/auth/login")}}>{language(57)}</Link>}.
      </Typography>
      <Typography style={{width: "85%"}} variant="h6" paragraph>
        {language(58)}
        {<Link color="secondary" onClick={() => {router.push("/auth/password")}}>{language(59)}</Link>}
        {language(60)}
      </Typography>
      {settingsPart()}
      {aboutPart()}
    </>
  )
}

export const getServerSideProps = async (context) => await checkPriveleges(context);