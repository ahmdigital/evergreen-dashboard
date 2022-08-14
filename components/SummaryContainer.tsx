import React, { useState, useEffect } from "react";
import styles from "./SummaryContainer.module.css";
import sharedStyles from "./treeView.module.css";
import ReposOverviewTable from "./SummaryComponents/RepoOverviewTable/ReposOverviewTable";
import helpIcon from "./images/helpIcon.png";
import Image from "next/image";
import HelpScreen from "./HelpScreen";


type AuthResponse = {
  access_token: string,
  scope: string,
  token_type: string,
}

export default function SummaryContainer(props: {
  rankArray: any;
  loadingWheel: any;
}) {



  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const random_state = (Math.random() + 1).toString(36);
  const redirect_uri = "http://localhost:3000/"
  const [token, setToken] = useState<string>("")
  const [code, setCode] = useState<string>("")
  // get code
  function redirect() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=repo&state=${random_state}`
  }

  // example of url after redirecting to the callback url
  // http://localhost:3000/?code=${client_id}&state=${random_state}
  useEffect(() => {
    const matches: RegExpMatchArray | null = document.location.href.match("code=.*&")
    // render is called twice
    if (matches?.length === 1 && token === "") {
      const code = matches[0].substring(5, matches[0].length - 1)
      setCode(code)
      console.log(`code ${code}`)


      const getToken = async () => {
        const response: Response = await fetch("api/authenticate/" + code)
        console.log(`response ${response}`)
        const responseObj: AuthResponse = await response.json()
        console.log(`token ${responseObj}`)
        console.log(`token ${responseObj.access_token}`)
        setToken(responseObj.access_token)
      }
      getToken()

    }
  }, [])

  const totalRepos =
    props.rankArray.green + props.rankArray.yellow + props.rankArray.red;
  let overallPercent = Math.round((props.rankArray.green / totalRepos) * 100);

  // State for opening the helpLegend
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  return (
    <div className={`${styles.summaryStyle} ${sharedStyles.sectionContainer}`}>
      <h3 className={sharedStyles.h3ContainerStyle}>Summary </h3>
      <button onClick={redirect}>Login</button>
      <p>Token: {token?.slice(10)}</p>
      <div className={styles.container}>
        <div className={`${styles.summaryOverall} ${styles.sharedCompProps}`}>
          <h3 className={styles.overallTitleStyle}>Overall</h3>
          <h2 className={styles.percentStyle} >{overallPercent}%</h2>
        </div>

        <div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
          <div className={styles.summaryCompHeader}>
            <h4 className={styles.summaryStyle}>Repos Overview</h4>
            <Image
              className={styles.helpBtn}
              width="30px"
              height="30px"
              alt="help"
              src={helpIcon}
              onClick={() => {
                setOpenHelp(true);
              }}
            />
          </div>
          {openHelp && <HelpScreen closeHelp={setOpenHelp} />}
          <div>
            <div className={styles.summaryComponent2}>
              <ReposOverviewTable rankArray={props.rankArray} />
            </div>
          </div>
        </div>

        <div className={`${styles.loadingWheelBox} ${styles.sharedCompProps}`}>
          {props.loadingWheel}
        </div>
      </div>
    </div>
  );
}
