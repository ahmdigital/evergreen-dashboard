import React from "react";
import makeCollapsibleTable from "../components/CollapsibleTable";
import { semVerFromString, ID } from "../components/dataProcessing";
import Row from "../components/Row";

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

  



  return (
    <div>
      {
		  makeCollapsibleTable(dummyData())
	  }
    </div>
  );
};

export default home;
