import React, { useState } from "react";
import { CollapsibleTable } from "./CollapsibleTable";
import { InverseSubRow } from "./InverseSubRow";
import { SubRow } from "./SubRow";
import styles from "../components/treeView.module.css";
import { useProcessDependencyData } from "../hooks/useProcessDependencyData";
import Row from "./Row";
import { Layout } from "./Layout";
import Head from "next/head";
import DependenciesContainer from "../components/DependenciesContainer";
import HeaderContainer from "./HeaderContainer";
import SummaryContainer from "./SummaryContainer";
import { DependencyData } from "../src/dataProcessing";

export type PageProps = {
  JSObject: DependencyData;
};

export function Page(props: PageProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const rows = useProcessDependencyData(props.JSObject);
  const rankArray = { green: 0, red: 0, yellow: 0 };
  const diplayedRows = [];

  const jsxRows = rows.map((row) => (
    <Row
      key={row.name}
      rank={row.minRank}
      row={row}
      subRows={{
        internal: row.internalSubRows.map((i) => (
          <SubRow key={i.name} dependency={i} />
        )),
        external: row.externalSubRows.map((i) => (
          <SubRow key={i.name} dependency={i} />
        )),
        user: row.userSubRows.map((i) => (
          <InverseSubRow key={i.name} user={i} />
        )),
        final: row.userSubRows.length === 0,
      }}
    />
  ));

  for (let i = 0; i < rows.length; i++) {
    if (rows[i].minRank == 2) {
      rankArray.green += 1;
    }
    if (rows[i].minRank == 1) {
      rankArray.yellow += 1;
    }
    if (rows[i].minRank == 0) {
      rankArray.red += 1;
    }
  }

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    let jsx = jsxRows[i];

    if (
      (searchTerm.length == 0 ||
        row.name.toLowerCase().includes(searchTerm.toLowerCase())) 
      // &&checkImageFilterType(currentResult) === true
    ){
      diplayedRows.push(jsx)
    }

  }

  return (
    <div className="container">
      <Head>
        <title>Evergreen dashboard</title>
      </Head>
      <main style={{ padding: 0 }}>
        <Layout>
          <HeaderContainer />
          <SummaryContainer rankArray={rankArray}/>
          <DependenciesContainer
            JSObject={props.JSObject}
            rows={diplayedRows}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
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
