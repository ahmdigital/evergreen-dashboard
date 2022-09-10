import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import styles from "./ReposOverviewTable.module.css";
import RedIcon from "../../../components/images/redIcon.svg";
import YellowIcon from "../../../components/images/yellowIcon.svg";
import greenIcon from "../../../components/images/greenIcon.svg";
import Image from "next/image";
import { TableBody } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

import { Colours, getResolved } from "../../../src/Colours"

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
  Red = "need updating urgently",
  Yellow = "should be updated soon",
  Green = "up-to-date",
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

export default function ReposOverViewTable(props: { rankArray: any, showChart: boolean}) {
  if(props.showChart){
    let data = {
      labels: [StatusLabel.Red, StatusLabel.Yellow, StatusLabel.Green],
      datasets: [
        {
          label: "# of dependencies",
          data: [props.rankArray.red, props.rankArray.yellow, props.rankArray.green],
          backgroundColor: [
            getResolved(Colours.redVar),
            getResolved(Colours.orangeVar),
            getResolved(Colours.greenVar)
          ],
          borderWidth: 1,
        },
      ],
    };

    return <Pie data={data} redraw={false} options= {{plugins: {legend: {display: false}}}}/>;
  } else{
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
            statusLabel={StatusLabel.Red}
            iconAlt={"Red Status"}
          ></Row>
          <Row
            icon={YellowIcon}
            statusCount={props.rankArray.yellow}
            statusLabel={StatusLabel.Yellow}
            iconAlt={"Yellow Status"}
          ></Row>
          <Row
            icon={greenIcon}
            statusCount={props.rankArray.green}
            statusLabel={StatusLabel.Green}
            iconAlt={"Green Status"}
          />
        </TableBody>
      </Table>
    );
  }
}
