import makeCollapsibleTable from "./CollapsibleTable";
import Head from "next/head";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Layout from "./layout";
import styles from "../components/treeView.module.css";
import { DependencyData } from "./dataProcessing";

export type PageProps = {
  JSObject: DependencyData;
  finalData: boolean
};

export default function Page(props: PageProps) {
	let loadingWheel: any = null;
	if(!props.finalData){
		loadingWheel = <Box sx={{ display: "inline-block", float: "right", justifyContent:'center', alignItems:'center', width: "10vh"}}>
			<CircularProgress />
		</Box>
	}

  return (
    <div className="container">
      <Head>
        <title>Evergreen dashboard</title>
      </Head>
      <main style={{ padding: 0 }}>
        <Layout>
          <div className={styles.topBarStyle}>
            <h1
              className="title"
              style={{
                padding: "0 32px",
                fontWeight: 600,
                color: "var(--colour-font)",
				width: "10vh",
				display: "inline-block"
              }}
            >
              evergreen
            </h1>
			{loadingWheel}
          </div>		  
        </Layout>
        <Layout>
          <div className={styles.barStyle}>
            {" "}
            {makeCollapsibleTable(props.JSObject)}{" "}
          </div>
        </Layout>
      </main>
    </div>
  );
}
