import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import styles from "./ReposOverviewTable.module.css";
import RedIcon from "../../../components/images/redIcon.svg";
import YellowIcon from "../../../components/images/yellowIcon.svg";
import greenIcon from "../../../components/images/greenIcon.svg";
import Image from "next/image";
import { TableBody } from "@mui/material";

type RowProps = {
  icon: any;
  iconAlt?: string;
  statusCount: number;
  statusLabel: string;
};

enum StatusLabel {
  RED = "need updating now",
  YELLOW = "should be updated soon",
  GREEN = "up-to-date",
}

const Row = (props: RowProps) => {
  const ICON_SIZE = "40px";
  return (
    <TableRow>
      <TableCell className={styles.tableCellStyleIcon}>
        <Image
          src={props.icon}
          alt={props.iconAlt ? props.iconAlt : ""}
          width={ICON_SIZE}
          height={ICON_SIZE}
        ></Image>
      </TableCell>
      <TableCell className={styles.tableCellStyleCount}>
        <p>{props.statusCount} </p>
      </TableCell>
      <TableCell className={styles.statusLabel}>
        <p>{props.statusLabel}</p>
      </TableCell>
    </TableRow>
  );
};

export default function ReposOverViewTable(props: { rankArray: any }) {
  return (
    <Table
      sx={{
        [`& .${tableCellClasses.root}`]: {
          borderBottom: "none",
        },
      }}
    >
      <TableBody>
        <Row
          icon={RedIcon}
          statusCount={props.rankArray.red}
          statusLabel={StatusLabel.RED}
          iconAlt={"Red Status"}
        ></Row>
        <Row
          icon={YellowIcon}
          statusCount={props.rankArray.yellow}
          statusLabel={StatusLabel.YELLOW}
          iconAlt={"Yellow Status"}
        ></Row>
        <Row
          icon={greenIcon}
          statusCount={props.rankArray.green}
          statusLabel={StatusLabel.GREEN}
          iconAlt={"Green Status"}
        />
      </TableBody>
    </Table>
  );
}
