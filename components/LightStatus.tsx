import closeIcon from "./images/closeIcon.png";
import greenIcon from "./images/greenIcon.svg";
import yellowIcon from "./images/yellowIcon.svg";
import redIcon from "./images/redIcon.svg";
import styles from "./LightStatus.module.css";
import Image from "next/image";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import config from "../config.json";
import { semVerFromString } from "../src/semVer";

export type HelpScreenProps = {
  closeHelp: (_value: boolean | ((_prev: boolean) => boolean)) => void;
};

// class created to make linking of descriptions to config easier later on
class VersionDefinition {
  description: string;

  constructor(description: string) {
    this.description = description;
  }
}

// defines the status icon definitions based on rankCutoff configured 
const upperLimit = semVerFromString(config.rankCutoff.major);
const lowerLimit = semVerFromString(config.rankCutoff.minor);

// defines red, yellow and green traffic light descriptions
export const redDef = new VersionDefinition(`Current major version behind by more than 1 major or ${upperLimit.minor} minors.`);
export const yellowDef = new VersionDefinition(`Current minor version behind by ${lowerLimit.minor} or ${upperLimit.minor} minors.`);
export const greenDef = new VersionDefinition(`Current minor version behind by less than ${lowerLimit.minor} minors.`);


// creates the table for the status definitions
function StatusTable() {
  return (
    <TableContainer>
      <Table size="medium" className={styles.tableStyle}>
        <TableHead>
          <TableRow>
            <TableCell className={styles.tableHeaderCellStyle}>Status</TableCell>
            <TableCell className={styles.tableHeaderCellStyle}>Definition</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className={styles.tableCellStyle}>
              <Image src={redIcon} alt="Red" width="40px" height="40px"></Image>
            </TableCell>
            <TableCell className={styles.tableCellStyle}>
              <p>{redDef.description}</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={styles.tableCellStyle}>
              <Image src={yellowIcon} alt="Yellow" width="40px" height="40px"></Image>
            </TableCell>
            <TableCell className={styles.tableCellStyle}>
              <p>{yellowDef.description}</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={styles.tableCellStyle}>
              <Image src={greenIcon} alt="Green" width="40px" height="40px"></Image>
            </TableCell>
            <TableCell className={styles.tableCellStyle}>
              <p>{greenDef.description}</p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// assembles the pop-up for the light status help
export default function HelpScreen(props: HelpScreenProps) {
  return (
    <div className={styles.modalBg}>
      <div className={styles.modalContainer}>
        <div
          className={styles.closeHelpScreen}
          onClick={() => props.closeHelp(false)}
        >
          <Image
            className={styles.closeBtn}
            width="40"
            height="40"
            alt="help"
            src={closeIcon}
          />
        </div>
        <div>
          <StatusTable/>
        </div>
      </div>
    </div>
  );
}

