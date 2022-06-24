import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import styles from "../../components/summary_components/ReposOverviewTable.module.css";
import RedIcon from "../../components/images/redIcon.svg";
import YellowIcon from "../../components/images/yellowIcon.svg";
import greenIcon from "../../components/images/greenIcon.svg";
import Image from "next/image";


export default function ReposOverViewTable(props: { rankArray: any }) {
  return (
    <Table>
      <TableRow>
        <TableCell className={styles.totalsCellStyle}>
          <h3>Total Repos</h3>
        </TableCell>
        <TableCell className={styles.totalsCellStyle}>
          <p>
            {props.rankArray.green +
              props.rankArray.yellow +
              props.rankArray.red}
          </p>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className={styles.tableCellStyle}>
          <Image src={RedIcon} alt="Red" width="40px" height="40px"></Image>
        </TableCell>
        <TableCell className={styles.tableCellStyle}>
          <p>{props.rankArray.red}</p>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className={styles.tableCellStyle}>
          <Image
            src={YellowIcon}
            alt="Yellow"
            width="40px"
            height="40px"
          ></Image>
        </TableCell>
        <TableCell className={styles.tableCellStyle}>
          <p>{props.rankArray.yellow}</p>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className={styles.tableCellStyle}>
          <Image src={greenIcon} alt="Green" width="40px" height="40px"></Image>
        </TableCell>
        <TableCell className={styles.tableCellStyle}>
          <p>{props.rankArray.green}</p>
        </TableCell>
      </TableRow>
    </Table>
  );
}
