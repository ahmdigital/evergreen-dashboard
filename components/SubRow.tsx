import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { semVerToString } from "../src/semVer";

import { PackageData } from "../hooks/useProcessDependencyData";
import styles from "./SubRow.module.css";
import Image from "next/image";

import RedIcon from "./images/redIcon.svg";
import YellowIcon from "./images/yellowIcon.svg";
import GreenIcon from "./images/greenIcon.svg";

export type SubRowProps = {
  dependency: PackageData;
};
// Creates the collapsible rows for internal/external dependencies

export function SubRow(props: SubRowProps) {
  // dependencyData contains all the packages and its props (name, version, link etc)
  const depName = props.dependency.name;
  const depLink = props.dependency.link;
  const usedVersion = semVerToString(props.dependency.usedVersion);
  const latestVersion = semVerToString(props.dependency.version);

  let statusIcon = RedIcon;

  // Setting the status
  if (props.dependency.rank == 2) {
    statusIcon = GreenIcon;
  }
  if (props.dependency.rank == 1) {
    statusIcon = YellowIcon;
  }

  return (
    <TableRow >
      <TableCell className={styles.tableCellStyle}>
        <Image
          src={statusIcon}
          alt="Repo Priority"
          width="33px"
          height="33px"
          className={styles.inverseSubRowIcon}
        ></Image>
      </TableCell>
      <TableCell className={styles.tableCellStyle}>
        <a href={depLink} rel="noreferrer" target="_blank">
          {depName}
        </a>
      </TableCell>
      <TableCell className={styles.tableCellStyle}>{usedVersion}</TableCell>
      <TableCell className={`${styles.tableCellStyle} ${styles.latestVerStyle}`}>{latestVersion}</TableCell>
    </TableRow>
  );
}
