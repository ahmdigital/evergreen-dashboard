import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import styles from "../../../styles/ReposOverviewTable.module.css";
import RedIcon from "../../../components/images/redIcon.svg";
import YellowIcon from "../../../components/images/yellowIcon.svg";
import greenIcon from "../../../components/images/greenIcon.svg";
import Image from "next/image";
import { TableBody } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ChartDataLabels);

import { Colours, getResolved } from "../../../src/Colours"

type RowProps = {
  icon: any;
  iconAlt?: string;
  statusCount: number;
  statusLabel: string;
};


// TODO: MUST REVIEW  with CSS
const theme1 = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: 'var(--font-size-normal)',
          fontWeight: 'var(--font-weight-semibold)',
          marginTop: 0,
          marginBottom: 0,
          padding: '16px 10px 16px 10px',
          lineHeight: 'inherit',
        }
      }
    },
  }
})

enum StatusLabel {
  Red = "highly out-of-date",
  Yellow = "moderately out-of-date",
  Green = "up-to-date",
}

const Row = (props: RowProps) => {
  const ICON_SIZE = "40px";
  return (
    <TableRow>
      <ThemeProvider theme={theme1}>
        <TableCell className={styles.tableCellStyleIcon}>
          <Image
            src={props.icon}
            alt={props.iconAlt ? props.iconAlt : ""}
            width={ICON_SIZE}
            height={ICON_SIZE}
          ></Image>
        </TableCell>
        <TableCell className={styles.tableCellStyleCount}>
          <p className={styles.countText}>{props.statusCount} </p>
        </TableCell>
        <TableCell className={styles.statusLabel}>
          <p className={styles.countText}>{props.statusLabel}</p>
        </TableCell>
      </ThemeProvider>
    </TableRow>
  );
};

export default function ReposOverViewTable(props: { rankArray: any, showChart: boolean }) {
  if (props.showChart) {
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

    const config = {
      data: {
        labels: [StatusLabel.Red, StatusLabel.Yellow, StatusLabel.Green],
        datasets: [{
          backgroundColor: [
            getResolved(Colours.redVar),
            getResolved(Colours.orangeVar),
            getResolved(Colours.greenVar)
          ],
          data: [props.rankArray.red, props.rankArray.yellow, props.rankArray.green],
          datalabels: {
            anchor: "end" as "end"
          }
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context: any) {
                var label = context.label,
                  currentValue = context.raw,
                  total = context.chart._metasets[context.datasetIndex].total;

                var percentage = parseFloat((currentValue / total * 100).toFixed(1));

                return label + ": " + currentValue + " (" + percentage + "%)";
              }
            }
          },
          legend: {
            display: true, position: "right" as "right", labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                size: 15,
                weight: 'normal',
              },
              color: 'black',
            }
          },
          datalabels: {
            backgroundColor: function (context: any) {
              return context.dataset.backgroundColor;
            },
            borderColor: "white",
            borderRadius: 25,
            borderWidth: 2,
            color: "white",
            display: function (context: any) {
              var dataset = context.dataset;
              var count = dataset.data.length;
              var value = dataset.data[context.dataIndex];
              return value > count * 1.5;
            },
            font: {
              weight: "bold" as "bold",
            },
            padding: 6,
            formatter: Math.round
          }
        },

        responsive: true,
        maintainAspectRatio: false,
      }
    }

    return <div style={{ height: "100%", width: "100%", position: "relative", padding: "-1rem 0rem -1rem 0rem" }}>
      <Pie style={{ height: "27em" }} data={config.data} options={
        {
          ...(config.options)
        }
      } />
    </div>;
  } else {
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
