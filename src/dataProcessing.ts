import { SemVer, semVerFromString } from "./semVer";

export type ID = number & { __brand: "ID" };
export type DependencyMapElement = {
  name: string;
  version: SemVer;
  lastUpdated: string;
  link: string;
  internal: boolean;
  archived: boolean;
};
export type DependencyMap = Map<ID, DependencyMapElement>;
export type DependencyListSingleDep = { id: ID; version: SemVer };
export type DependencyListElement = {
  id: ID;
  dependencies: DependencyListSingleDep[];
  users: DependencyListSingleDep[];
};
export type DependencyList = DependencyListElement[];
export type AuxData = {crawlStart: string; orgName: string; orgLink: string; error?: string}
export type DependencyData = { aux: AuxData, depMap: DependencyMap; deps: DependencyList };
export type PartialDependencyData = { depMap: DependencyMap; deps: DependencyList };

// Parameter: jsonData JSON cachesdata format
// Return:
export function JSObjectFromJSON(
  jsonData:
    | [any, { dep: number; dependencies: (string | number)[][] }[]]
    | never[]
): PartialDependencyData {
  if (!jsonData || jsonData.length == 0) {
    return {
      depMap: new Map(),
      deps: [],
    };
  }

  // CREATING NEW DEPENDENCY MAP
  let betterMap: DependencyMap = new Map();
  for (const id in Object.keys(jsonData[0])) {
    const data = jsonData[0][id];
    const semVerVer = semVerFromString(data.version as string);
    betterMap.set(parseInt(id) as ID, {
      name: data.name,
      version: semVerVer,
      lastUpdated: data.lastUpdated,
      link: data.link,
      internal: data.internal,
      archived: data.archived,
    });
  }

  //Inverted dependencies
  let inverseDeps = new Map<ID, DependencyListSingleDep[]>();
  for (const data of jsonData[1]) {
    const mainID = data.dep as ID;
    for (const dep of data.dependencies) {
      const depID = dep[0] as ID;
      const depVer = semVerFromString(dep[1] as string);
      if (!inverseDeps.has(depID)) {
        inverseDeps.set(depID, []);
      }
      inverseDeps.get(depID)?.push({ id: mainID, version: depVer });
    }
  }

  // DEPENDENCIES
  let newArray: DependencyList = [];
  for (const element of jsonData[1]) {
    const dependenciesArray = element.dependencies;

    let newDependenciesArray: DependencyListSingleDep[] = [];
    for (const i of dependenciesArray) {
      const depID = i[0] as ID;
      const depVer = semVerFromString(i[1] as string);
      newDependenciesArray.push({
        id: depID,
        version: depVer,
      });
    }

    newArray.push({
      id: element.dep as ID,
      dependencies: newDependenciesArray,
      users: inverseDeps.get(element.dep as ID) ?? [],
    });
  }

  return {
    depMap: betterMap,
    deps: newArray,
  };
}
