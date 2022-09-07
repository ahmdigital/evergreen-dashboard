import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { semVerToString } from "../src/semVer";

import { PackageData } from "../hooks/useProcessDependencyData";
import styles from "./SubRow.module.css";
import Image from "next/image";

import RedIcon from "./images/redIcon.svg";
import YellowIcon from "./images/yellowIcon.svg";
import GreenIcon from "./images/greenIcon.svg";
import { redDef, yellowDef, greenDef } from "./LightStatus";

export type SubRowProps = {
  dependency: PackageData;
};
// Creates the collapsible rows for internal/external dependencies

export function SubRow(props: SubRowProps) {
  // dependencyData contains all the packages and its props (name, version, link etc)
  const depName = props.dependency.name;
  const usedVersion = semVerToString(props.dependency.usedVersion);
  const latestVersion = semVerToString(props.dependency.version);

  let statusIcon = RedIcon;
  let iconDefinition = redDef.description;

  // Setting the status
  if (props.dependency.rank == 2) {
    statusIcon = GreenIcon;
    iconDefinition = greenDef.description;
  }
  if (props.dependency.rank == 1) {
    statusIcon = YellowIcon;
    iconDefinition = yellowDef.description;
  }

  return (
    <TableRow >
      <TableCell className={styles.tableCellStyle}>
        <Tooltip arrow title={<p className={styles.tooltipStyle}>{iconDefinition}</p>}>
          <div className={styles.iconContainer}>
            <Image
              src={statusIcon}
              alt="Repo Priority"
              width="33px"
              height="33px"
              className={styles.inverseSubRowIcon}
            ></Image>
          </div>
        </Tooltip>
      </TableCell>
      <TableCell className={styles.tableCellStyle}>{depName}</TableCell>
      <TableCell className={styles.tableCellStyle}>{usedVersion}</TableCell>
      <TableCell className={`${styles.tableCellStyle} ${styles.latestVerStyle}`}>{latestVersion}</TableCell>
    </TableRow>
  );
}
