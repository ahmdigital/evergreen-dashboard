import { Divider } from "@mui/material";
import Image from "next/image";
import redIcon from "../../images/redIcon.svg";
import greenIcon from "../../images/greenIcon.svg";
import yellowIcon from "../../images/yellowIcon.svg";
import styles from "../../../styles/CondensedSummary.module.css";
import Box from "@mui/material/Box";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

export type RepoOverviewCondensedProps = {
  readonly red: number | string;
  readonly green: number | string;
  readonly yellow: number | string;
};

type CondensedRepoSummaryProps = {
  statusValues: RepoOverviewCondensedProps;
  overall?: number;
  target: number;
};

const Summary = (props: CondensedRepoSummaryProps) => {
  const { red, green, yellow } = props.statusValues;
  const overall = props.overall;
  const target = props.target;

  const overallStatusColour = () => {
    if (typeof overall === "undefined") {
      return "var(--colour-red)";
    } else {
      if (overall < target) {
        return "var(--colour-red)";
      } else {
        return "var(--colour-green)";
      }
    }
  };


  return (
    <div className={styles.rootContainer} >
      <div className={styles.topPart}>
        <div className={styles.percentageContainer}>
          <label>Overall:</label>
          <span
            className={`${styles.overall} ${styles.percentage}`}
            style={{ backgroundColor: overallStatusColour() }}
          >
            {overall ? `${overall}%` : 'N/A'}
          </span>
        </div>
        <span className={styles.percentageContainer}>
          <label>Target:</label>
          <span className={`${styles.percentage}`}>
            {`${target}%`}
          </span>
        </span>
      </div>
      <Divider />
      <div className={styles.statuses}>
        <div className={styles.status}>
          <label>{red}</label>
          <Image src={redIcon} alt='Red' width='30px' height='30px'></Image>
        </div>
        <div className={styles.status}>
          <label>{green}</label>
          <Image src={greenIcon} alt='Green' width='30px' height='30px'></Image>
        </div>
        <div className={styles.status}>
          <label>{yellow}</label>
          <Image
            src={yellowIcon}
            alt='Yellow'
            width='30px'
            height='30px'></Image>
        </div >
      </div >
    </div >
  );
};

export default function CondensedSummary(props: CondensedRepoSummaryProps) {
  return (
    <Box
      sx={{ flexGrow: 1 }}
      className={`${styles.summaryStyle}`}
    >
      <Summary
        statusValues={props.statusValues}
        overall={props.overall}
        target={props.target}
      />
    </Box>
  );
}
