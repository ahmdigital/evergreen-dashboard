import React, { useEffect, useState } from "react";
import makeCollapsibleTable from "./CollapsibleTable";
import Head from "next/head";
import Layout from "./layout";
import styles from "../components/treeView.module.css";
import { DependencyData } from "./dataProcessing";
import DependenciesContainer from  "../components/DependenciesContainer";
import HeaderContainer from "./HeaderContainer";
import SummaryContainer from "./SummaryContainer";

export type PageProps = {
  JSObject: DependencyData;
};

export function Page(props: PageProps) {
  return (
    <div className="container">
      <Head>
        <title>Evergreen dashboard</title>
      </Head>
      <main style={{ padding: 0 }}>
        <Layout>
          <HeaderContainer />
          <SummaryContainer />
          <DependenciesContainer JSObject={props.JSObject}/>
        </Layout>
      </main>
    </div>
  );
}

// export function Page(props: PageProps) {
//   return (
//     <div className="container">
//       <Head>
//         <title>Evergreen dashboard</title>
//       </Head>
//       <main style={{ padding: 0 }}>
//         <Layout>
//           <div className={styles.topBarStyle}>
//             <h1
//               className="title"
//               style={{
//                 padding: "0 32px",
//                 fontWeight: 600,
//                 color: "var(--colour-font)",
//               }}
//             >
//               evergreen
//             </h1>
//           </div>
//         </Layout>
        
//       </main>
//     </div>
//   );
// }