import Fab from "@mui/material/Fab";
import HelpOutline from "@mui/icons-material/HelpOutline";
import styles from "./HelpGuide.module.css";


export default function HelpGuide() {
    return (
      <>
        <Fab className={styles.fabStyle}>
            <HelpOutline className={styles.iconStyle}/>
        </Fab>
      </>
    );
  }
  