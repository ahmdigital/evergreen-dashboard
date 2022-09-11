import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import styles from "../../styles/ReposOverviewTable.module.css";
import RedIcon from "../../components/images/redIcon.svg";
import YellowIcon from "../../components/images/yellowIcon.svg";
import greenIcon from "../../components/images/greenIcon.svg";
import Image from "next/image";
import { TableBody } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

type RowProps = {
  icon: any;
  iconAlt?: string;
  statusCount: number;
  statusLabel: string;
};

const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: 'var(--font-size-large)',
          fontWeight: 'var(--font-weight-semibold)',
          marginTop: 0,
          marginBottom: 0,
          padding: '16px 10px 16px 10px',
        }
      }
    },
  }
})

enum StatusLabel {
  RED = "need(s) updating urgently",
  YELLOW = "should be updated soon",
  GREEN = "up-to-date",
}

const Row = (props: RowProps) => {
  const ICON_SIZE = "40px";
  return (
    <TableRow>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
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
