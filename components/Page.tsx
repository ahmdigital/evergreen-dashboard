import React, { useEffect, useState } from "react";
import makeCollapsibleTable from "./CollapsibleTable";
import Head from "next/head";
import Layout from "./layout";
import styles from "../components/treeView.module.css";
import { DependencyData } from "./dataProcessing";
import HelpScreen from "./HelpScreen";
import helpIcon from "./images/helpIcon.png";
import Image from "next/image";

export type PageProps = {
  JSObject: DependencyData;
};

export function Page(props: PageProps) {
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  return (
    <div className="container">
      <Head>
        <title>Evergreen dashboard</title>
      </Head>
      <main style={{ padding: 0 }}>
        <Layout>
          <div className={styles.topBarStyle}>
		  <div className={styles.help}>
              <Image
                className={styles.helpBtn}
                width="40"
                height="40"
                alt="help"
                src={helpIcon}
                onClick={() => {
                  setOpenHelp(true);
                }}
              />
              {openHelp && <HelpScreen closeHelp={setOpenHelp} />}
            </div>
            <h1
              className="title"
              style={{
                padding: "0 32px",
                fontWeight: 600,
                color: "var(--colour-font)",
              }}
            >
              evergreen
            </h1>
           
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
