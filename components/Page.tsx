import React, { useState } from "react";
import { InverseSubRow } from "./InverseSubRow";
import { SubRow } from "./SubRow";
import { useProcessDependencyData } from "../hooks/useProcessDependencyData";
import Row from "./Row";
import Layout from "./Layout";
import Head from "next/head";
import DependenciesContainer from "../components/DependenciesContainer";
import HeaderContainer from "./HeaderContainer";
import SummaryContainer from "./SummaryContainer";
import { DependencyData } from "../src/dataProcessing";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export type PageProps = {
  JSObject: DependencyData;
  finalData: boolean;
};

export function Page(props: PageProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const rows = useProcessDependencyData(props.JSObject);
  const rankArray = { green: 0, red: 0, yellow: 0 };
  const diplayedRows = [];

  let loadingWheel: any = null;
  if (!props.finalData) {
    loadingWheel = (
      <Box
        sx={{
          display: "inline-block",
          float: "right",
          justifyContent: "center",
          alignItems: "center",
          width: "10vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  //Sort alphabetically by name
  rows.sort((a, b) => a.name.localeCompare(b.name));

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
      searchTerm.length == 0 ||
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
      // &&checkImageFilterType(currentResult) === true
    ) {
      diplayedRows.push(jsx);
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
          <SummaryContainer rankArray={rankArray} loadingWheel={loadingWheel}/>
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
