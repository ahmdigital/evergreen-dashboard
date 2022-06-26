import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { semVerToString } from "../src/semVer";
import { SubRowProps } from "./SubRow";
import Image from "next/image";
import styles from "./SubRow.module.css";

import RedIcon from "./images/redIcon.svg";
import YellowIcon from "./images/yellowIcon.svg";
import GreenIcon from "./images/greenIcon.svg";

type InverseSubRowProps = {
  //This is just renaming dependency to user to make it more clear
  user: SubRowProps["dependency"];
};

export function InverseSubRow(props: InverseSubRowProps) {
  const userName = props.user.name;
  const usedVersion = semVerToString(props.user.version);

  let statusIcon = RedIcon;

  // Setting the status
  if (props.user.rank == 2) {
    statusIcon = GreenIcon;
  }
  if (props.user.rank == 1) {
    statusIcon = YellowIcon;
  }

  // const str = props.user.name + ": " + semVerToString(props.user.version);
  // const colour = rankToDepColour(props.user.rank)[0];
  return (
    <TableRow
      style={{
        backgroundColor: "var(--colour-background)",
        color: "var(--colour-font)",
      }}
    >
      <TableCell className={styles.tableCellStyle}>
        <Image
          src={statusIcon}
          alt="Repo Priority"
          width="33px"
          height="33px"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        ></Image>
      </TableCell>
      <TableCell className={styles.tableCellStyle}>{userName}</TableCell>
      <TableCell className={styles.tableCellStyle}>{usedVersion}</TableCell>
    </TableRow>
  );
}
