import React from 'react'
import { json } from 'stream/consumers';
import styles from '../components/treeView.module.css';
import { Colours } from './Colours';

let internalDependencies = new Set<ID>();

//TODO: (Entire file) Split the JSX from the structure creation

export type SemVer = {
	major: number;
	minor: number;
	bug: number;
	rest: string;
	skipMinor: boolean;
	skipBug: boolean;
};

export function semVerToString(semVer: SemVer): string{
	let res: string = ""
	if(semVer.skipMinor){
		res += '^'
	} else if(semVer.skipBug){
		res += '~'
	}
	res += semVer.major + "." + semVer.minor + "." + semVer.bug
	if(semVer.rest !== ""){
		res += "-" + semVer.rest
	}
	return res
}

export function semVerFromString(semVer: string): SemVer {
	let skipMinor = false
	let skipBug = false
	if (semVer[0] == '^') {
		semVer = semVer.substring(1);
		skipMinor = true
		skipBug = true
	} else if (semVer[0] == '~') {
		semVer = semVer.substring(1)
		skipBug = true
	}
	const parts = semVer.split(".", 3)
	if(parts.length < 3){
		return {
			major: 0,
			minor: 0,
			bug: 0,
			rest: "",
			skipMinor: skipMinor,
			skipBug: skipBug
		}
	}

	const bugAndRest = parts[2].split("-")
	return {
		major: parseInt(parts[0]),
		minor: parseInt(parts[1]),
		bug: parseInt(bugAndRest[0]),
		rest: bugAndRest[1] ? bugAndRest[1] : "",
		skipMinor: skipMinor,
		skipBug: skipBug
	}
}

function externalLinkJSX(data: any): JSX.Element {
	return <span style={{ float: "right" }}>(<a target="_blank" href={data.link}>GitHub</a>)</span>
}

export function findRank(used: SemVer, current: SemVer): number {
	if (used.major < current.major) {
		return 0;
	} else if (used.minor + 5 < current.minor) {
		return 1;
	}
	return 2;
}

function getDepColour(used: SemVer, current: SemVer): [string, string, number] {
	if (used.major < current.major) {
		return [Colours.red, Colours.redBorder, 0];
	} else if (used.minor + 5 < current.minor) {
		return [Colours.orange, Colours.orangeBorder, 1];
	}
	return [Colours.green, Colours.greenBorder, 2];
}

export function rankToDepColour(rank: number): [string, string, number] {
	if (rank == 0) {
		return [Colours.red, Colours.redBorder, 0];
	} else if (rank == 1) {
		return [Colours.orange, Colours.orangeBorder, 1];
	}
	return [Colours.green, Colours.greenBorder, 2];
}

function depsToJSXList(dependencies, dependencyMap: DependencyMap) {
	let internalDeps = [];
	let externalDeps = [];
	for (const data of dependencies) {
		const dependencyData = dependencyMap.get(data.id)
		const str = dependencyData.name + ": " + data.version + ' -> ' + dependencyData.version
		const [colour, borderColour, rank] = getDepColour(data.version, dependencyData.version);
		const dep = (
			<li key={str}>
				<div style={{ backgroundColor: colour, padding: 5, border: borderColour }}>
					{str}
				</div>
			</li>
		);
		if (internalDependencies.has(data[0])) {
			internalDeps.push([rank, dep]);
		} else {
			externalDeps.push([rank, dep]);
		}
	}

	//Sort based on rank, so more out of date repositiories appear near the top
	internalDeps.sort();
	externalDeps.sort();
	let sortedDeps = [];
	if (internalDeps.length > 0) {
		sortedDeps.push(<li key="Internal">Internal:</li>);
		for (const [rank, depList] of internalDeps) {
			sortedDeps.push(depList);
		}
	}
	if (externalDeps.length > 0) {
		sortedDeps.push(<li key="External">External:</li>);
		for (const [rank, depList] of externalDeps) {
			sortedDeps.push(depList);
		}
	}

	//As we sorted based on rank, the minimum rank is at the first index
	const minRankInternal = internalDeps && internalDeps[0] ? internalDeps[0][0] : 2;
	const minRankExternal = externalDeps && externalDeps[0] ? externalDeps[0][0] : 2;
	const minRank = minRankInternal < minRankExternal ? minRankInternal : minRankExternal;
	console.log(internalDeps)

	return [sortedDeps, minRank];
};

function depsToInverseJSXList(version: SemVer, dependencies: DependencyListSingleDep[], dependencyMap: DependencyMap) {
	let deps = [];
	for (const data of dependencies) {
		const dependencyData = dependencyMap.get(data.id);
		const str = dependencyData.name + ": " + data.version;
		const [colour, borderColour, rank] = getDepColour(data.version, version);
		const dep = (
			<li key={"inverse" + str}>
				<div style={{ backgroundColor: colour, padding: 5, border: borderColour }}>
					{str}
				</div>
			</li>
		);
		deps.push([rank, dep]);
	}

	//Sort based on rank, so more out of date repositiories appear near the top
	deps.sort();
	let sortedDeps = [];
	for (const [rank, depList] of deps) {
		sortedDeps.push(depList);
	}

	const minRank = deps[0][0];

	return [sortedDeps, minRank];
};

// LIBRARY SECTION: list all libraries and the internal and external dependencies it has/ depends on 
// INVERSE SECTION: list all libraries and what other libs/dependencies that use this dependency - the inverse tab section

function repoToJSXList(data, dependencies, dependencyMap: DependencyMap) {
	const [deps, rank] = depsToJSXList(dependencies, dependencyMap);
	const [colour, borderColour] = rankToDepColour(rank);
	const name = data.name;
	let ret;
	if (deps.length != 0) {
		ret = (
			<li key={name}>
				<div style={{ backgroundColor: colour, padding: 5, border: borderColour }}>
					<span className={styles.caret}>{name}</span>
					{externalLinkJSX(data)}
				</div>
				<ul className={styles.nested}>
					{deps}
				</ul>
			</li>
		);
	} else {
		ret = (
			<li key={name}>
				<div style={{ backgroundColor: Colours.green, padding: 5, border: Colours.greenBorder }}>
					<span style={{ margin: 0 }}>{name}</span>
					{externalLinkJSX(data)}
				</div>
			</li>
		);
	}
	return [ret, rank];
};

function repoToInverseJSXList(id: ID, dependencies, dependencyMap: DependencyMap) {
	const data = dependencyMap.get(id);
	const [deps, rank] = depsToInverseJSXList(data.version, dependencies.deps, dependencyMap);
	const [colour, borderColour] = rankToDepColour(rank);
	let ret = (
		<li key={"inverse" + data.name}>
			<div style={{ backgroundColor: colour, padding: 5, border: borderColour }}>
				<span className={styles.caret}>{data.name + ", " + deps.length + " user" + (deps.length == 1 ? "" : "s") + " (" + data.version + ")"}</span>
				{externalLinkJSX(data)}
			</div>
			<ul className={styles.nested}>
				{deps}
			</ul>
		</li>
	);
	return [rank, ret];
};
// All libraries - all repos table


export function jsonToTreeView(cachedData: DependencyData) {
	//Populate internal dependencies, which is used for sorting at lower levels
	for (const data of cachedData.deps) {
		internalDependencies.add(data.id);
	}

	let repos = [];
	let ranks = [0, 0, 0];
	for (const data of cachedData.deps) {
		const [repoList, rank] = repoToJSXList(cachedData.depMap.get(data.id), data.dependencies, cachedData.depMap);
		repos.push([rank, repoList]);
		ranks[rank] += 1;
	}
	const greenPercent = Math.round(100 * ranks[2] / (ranks[0] + ranks[1] + ranks[2]));

	//Sort based on rank, so more out of date repositiories appear near the top
	repos.sort();
	let sortedRepos = [];
	for (const [rank, repoList] of repos) {
		sortedRepos.push(repoList);
	}

	return (
		<ul className={styles.treeView}>
			<li><span className={styles.caret}>Libraries, {greenPercent}% green</span>
				<ul className={styles.nested}>
					{sortedRepos}
				</ul>
			</li>
		</ul>
	)
// Inverse deps - finds the users of a dependency/library
// goes through cache data and loops through each ID	);
}

export function jsonToInverseTreeView(cachedData: DependencyData) {
	//Populate internal dependencies, which is used for sorting at lower levels
	for (const data of cachedData.deps) {
		internalDependencies.add(data.id);
	}

	let inverseDeps = new Map<ID, any>();
	for (const data of cachedData.deps) {
		for (const v of data.dependencies) {
			if (!inverseDeps.has(v.id)) { inverseDeps.set(v.id, []); }
			inverseDeps.get(v.id).push([data.id, v.version]);
		}
	}

	let repos = [];
	for (const [key, value] of inverseDeps) {
		repos.push(repoToInverseJSXList(key, value, cachedData.depMap));
	}

	repos.sort();
	let sortedRepos = [];
	for (const data of repos) {
		sortedRepos.push(data[1]);
	}

	return (
		<ul className={styles.treeView}>
			<li><span className={styles.caret}>Inverse</span>
				<ul className={styles.nested}>
					{sortedRepos}
				</ul>
			</li>
	
	</ul>
	)
// BOTH SECTION: LIST ALL libraries and includes both Library and INVERSE View 	);
}

export function jsonToDualTreeView(cachedData: DependencyData) {
	//Populate internal dependencies, which is used for sorting at lower levels
	let depTree = new Map();
	for (const data of cachedData[1]) {
		internalDependencies.add(data.dep);
		depTree.set(data.dep,
			{
				up: [],
				down: []
			}
		);
	}

	let inverseDeps = new Map<ID, DependencyListSingleDep[]>();
	for (const data of cachedData.deps) {
		for (const dep of data.dependencies) {
			if (!inverseDeps.has(dep.id)) { inverseDeps.set(dep.id, []); }
			inverseDeps.get(dep.id).push({id: data.id, version: dep.version});
		}
	}

	for (const [key, value] of inverseDeps) {
		const data = cachedData.depMap.get(key);
		const [deps, rank] = depsToInverseJSXList(data.version, value, cachedData.depMap);
		if (!depTree.has(key)) {
			depTree.set(key,
				{
					up: [],
					down: []
				}
			);
		}
		depTree.get(key).up = deps;
		//reposI.push(repoToInverseJSXList(key, value, cachedData[0]))
	}

	for (const data of cachedData[1]) {
		const [deps, rank] = depsToJSXList(data.dependencies, cachedData[0]);
		if (!depTree.has(data.dep)) {
			depTree.set(data.dep,
				{
					up: [],
					down: []
				}
			);
		}
		depTree.get(data.dep).down = deps;
	}

	let htmlDepTree = [];
	for (const [key, val] of depTree) {
		const data = cachedData[0][key]
		const name = data.name;
		//<div style={{backgroundColor: colour, padding: 5, border: borderColour}}>
		htmlDepTree.push(
			<li key={"depTree" + name}>
				<div>
					<span className={styles.caret}>{name}</span>
					{externalLinkJSX(data)}
				</div>
				<ul className={styles.nested}>
					<div style={{ display: "flex", padding: "10px" }}>
						<div style={{ width: "calc(45vw - 64px)" }}>
							{val.down}
						</div>
						<div style={{ width: "64px" }}></div>
						<div style={{ width: "calc(45vw - 64px)" }}>
							<li key="Users">Users:</li>
							{val.up}
						</div>
					</div>
				</ul>
			</li>
		)
	}

	return (
		<ul className={styles.treeView}>
			<li><span className={styles.caret}>Both</span>
				<ul className={styles.nested}>
					{htmlDepTree}
				</ul>
			</li>
		</ul>
	);
}

export type ID = number & { __brand: "ID"}

export type DependencyMapElement = {name: string, version: SemVer, link: string, internal: boolean, archived: boolean}
export type DependencyMap = Map<ID, DependencyMapElement>
export type DependencyListSingleDep = {id: ID, version: SemVer}
export type DependencyListElement = {id: ID, dependencies: DependencyListSingleDep[], users: DependencyListSingleDep[]}
export type DependencyList = DependencyListElement[]
export type DependencyData = {depMap: DependencyMap, deps: DependencyList}

// Parameter: jsonData JSON cachesdata format
// Return: 
export function JSObjectFromJSON(jsonData0: any, jsonData1: {dep: number, dependencies: (string | number)[][]}[]): DependencyData{

	// CREATING NEW DEPENDENCY MAP
	let betterMap: DependencyMap = new Map();
	for(const id in Object.keys(jsonData0)){
		const data = jsonData0[id]
		const semVerVer = semVerFromString(data.version as string)
		betterMap.set(
			parseInt(id) as ID,
			{
				name: data.name,
				version: semVerVer,
				link: data.link,
				internal: data.internal,
				archived: data.archived
			}
		)
	}

	//Inverted dependencies
	let inverseDeps = new Map<ID, DependencyListSingleDep[]>();
	for (const data of jsonData1) {
		const mainID  = data.dep as ID
		for (const dep of data.dependencies) {
			const depID  = dep[0] as ID
			const depVer =  semVerFromString(dep[1] as string)
			if (!inverseDeps.has(depID)) { inverseDeps.set(depID, []); }
			inverseDeps.get(depID).push({id: mainID, version: depVer});
		}
	}
	
	// DEPENDENCIES
	let newArray: DependencyList = []
	for(const element of jsonData1){
		const dependenciesArray = element.dependencies

		
		let newDependenciesArray: DependencyListSingleDep[] = []
		for (const i of dependenciesArray){
			const depID  = i[0] as ID
			const depVer =  semVerFromString(i[1] as string)
			newDependenciesArray.push({
				id: depID,
				version: depVer
			})
		}
		
		newArray.push({
			id: element.dep as ID,
			dependencies: newDependenciesArray,
			users: inverseDeps.get(element.dep as ID) ?? []
		})
	}
	
	return{
		depMap: betterMap,
		deps: newArray
	}
};
