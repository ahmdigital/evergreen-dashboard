import React from "react";
import makeCollapsibleTable from "../components/CollapsibleTable";
import {
  semVerFromString,
  ID,
  JSObjectFromJSON,
  jsonToTreeView,
  depsToJSXList,
} from "../components/dataProcessing";
import Row from "../components/Row";
import cachedData from "../cachedData.json";

const home = () => {
  const dummyData = () => {
    let dummyDepMap = new Map();

    dummyDepMap.set(1 as ID, {
      name: "@octokit/core",
      version: "3.6.0",
      link: "https://github.com/octokit/core.js/tree/master",
      internal: true,
      archived: false,
    });
    dummyDepMap.set(2 as ID, {
      name: "@octokit/app",
      version: "12.0.5",
      link: "https://github.com/octokit/app.js/tree/master",
      internal: true,
      archived: false,
    });
    dummyDepMap.set(2 as ID, {
      name: "@octokit/core",
      version: "3.6.0",
      link: "https://github.com/octokit/core.js/tree/master",
      internal: true,
      archived: false,
    });
    let dummyDepsArray = [
      {
        id: 1 as ID,
        dependencies: [
          {
            id: 2 as ID,
            version: semVerFromString("^3.5.1"),
          },
        ],
      },
      {
        id: 2 as ID,
        dependencies: [
          {
            id: 1 as ID,
            version: semVerFromString("^0.5.3"),
          },
        ],
      },
    ];

    let dummyJSObject = {
      depMap: dummyDepMap,
      deps: dummyDepsArray,
    };

    return dummyJSObject;
  };

  const JSObject = JSObjectFromJSON(cachedData[0], cachedData[1]);
  console.log('Printing JSObject')
  console.log(JSObject)

  // Modifying depsToJSXList
  // const findDeps = () => {
  //   for (const data in JSObject.deps) {
  //     const dependencyData = dependencyMap[data.id]
  //     const dependencyData = JS
  //   }
  // };
  // findDeps()

  return (
    <>
      <div>{makeCollapsibleTable(dummyData())}</div>
    </>
  );
};

export default home;
