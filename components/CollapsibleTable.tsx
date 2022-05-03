import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Circle } from "@mui/icons-material";

import Row from "./Row";
import {
  ID,
  DependencyData,
  DependencyMap,
  DependencyListSingleDep,
} from "./dataProcessing";
import {findRank, rankToDepColour, semVerToString, SemVer} from "./semVer";

// Creates the whole table
const CollapsibleTable = (rows: JSX.Element[]) => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="collapsible table">
          <colgroup>
            <col style={{ width: "0%", backgroundColor: "#f6f6f6" }} />
            <col style={{ width: "0%" }} />
            <col style={{ width: "75%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "0%" }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

function makeSubRow(
  // Creates the collapsible rows for internal/external dependencies
  data: DependencyListSingleDep,
  rank: number,
  dependencyMap: DependencyMap
) {
  // dependencyData contains all the packages and its props (name, version, link etc)
  const dependencyData = dependencyMap.get(data.id);
  console.log(dependencyData)
  const str =
    dependencyData.name +
    ": " +
    semVerToString(data.version) +
    " -> " +
    semVerToString(dependencyData.version);
  const [colour, borderColour, colourIndex] = rankToDepColour(rank);
  const dep = (
    <TableRow>
      <col style={{ width: "0%" }} />
      <col style={{ width: "75%" }} />
      <TableCell>
        <Circle style={{ color: colour }} />
      </TableCell>
      <TableCell>{str}</TableCell>
    </TableRow>
  );
  return dep;
}

function makeInverseSubRow(
  data: DependencyListSingleDep,
  rank: number,
  dependencyMap: DependencyMap
) {
  const dependencyData = dependencyMap.get(data.id);
  const str = dependencyData.name + ": " + semVerToString(data.version);
  const [colour, borderColour, colourIndex] = rankToDepColour(rank);
  const dep = (
    <TableRow>
      <col style={{ width: "0%" }} />
      <col style={{ width: "75%" }} />
      <TableCell>
        <Circle style={{ color: colour }} />
      </TableCell>
      <TableCell>{str}</TableCell>
    </TableRow>
  );
  return dep;
}

const makeCollapsibleTable = (JSObject: DependencyData) => {
  //TODO: Rather than taking in the raw objet, take a structure that can be directly converted into JSX
  let rowList: JSX.Element[] = [];

  for (const dep of JSObject.deps) {
    const data = JSObject.depMap.get(dep.id);
    let internalSubRows: JSX.Element[] = [];
    let externalSubRows: JSX.Element[] = [];
    let userSubRows: JSX.Element[] = [];

    let minRank = 2;

    for (const i of dep.dependencies) {
      const iData = JSObject.depMap.get(i.id);
      const rank = findRank(i.version, iData.version);

      const depData = JSObject.depMap.get(i.id);
      if (depData.internal) {
        internalSubRows.push(makeSubRow(i, rank, JSObject.depMap));
      } else {
        externalSubRows.push(makeSubRow(i, rank, JSObject.depMap));
      }

      minRank = rank < minRank ? rank : minRank;
    }

    for (const i of dep.users) {
      const rank = findRank(i.version, data.version);

      userSubRows.push(makeInverseSubRow(i, rank, JSObject.depMap));
    }

    rowList.push(
      <Row
        key={data.name}
        rank={minRank}
        row={data}
        subRows={{
          internal: internalSubRows,
          external: externalSubRows,
          user: userSubRows,
          final: dep.users.length == 0,
        }}
      />
    );
  }
  return CollapsibleTable(rowList);
};

export default makeCollapsibleTable;
