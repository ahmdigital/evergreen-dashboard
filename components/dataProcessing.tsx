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
	skipMinor: boolean;
	skipBug: boolean;
};

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
	const parts = semVer.split(".")
	return {
		major: parseInt(semVer[0]),
		minor: parseInt(semVer[1]),
		bug: parseInt(semVer[2]),
		skipMinor: skipMinor,
		skipBug: skipBug
	}
}

function externalLinkJSX(data: any): JSX.Element {
	return <span style={{ float: "right" }}>(<a target="_blank" href={data.link}>GitHub</a>)</span>
}

function getDepColour(used: SemVer, current: SemVer): [string, string, number] {
	if (used.major < current.major) {
		return [Colours.red, Colours.redBorder, 0];
	} else if (used.minor + 5 < current.minor) {
		return [Colours.orange, Colours.orangeBorder, 1];
	}
	return [Colours.green, Colours.greenBorder, 2];
}

function rankToDepColour(rank: number): [string, string, number] {
	if (rank == 0) {
		return [Colours.red, Colours.redBorder, 0];
	} else if (rank == 1) {
		return [Colours.orange, Colours.orangeBorder, 1];
	}
	return [Colours.green, Colours.greenBorder, 2];
}

export function depsToJSXList(dependencies: DependencyList, dependencyMap: DependencyMap) {
	let internalDeps = [];
	let externalDeps = [];
	for (const data of dependencies) {
		const dependencyData = dependencyMap[data.id]
		const str = dependencyData.name + ": " + data[1] + ' -> ' + dependencyData.version
		const [colour, borderColour, rank] = getDepColour(data[1], dependencyData.version);
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

	//return [sortedDeps, minRank];
	return [internalDeps, externalDeps]
};

function depsToInverseJSXList(version, dependencies, dependencyMap) {
	let deps = [];
	for (const data of dependencies) {
		const dependencyData = dependencyMap[data[0]];
		const str = dependencyData.name + ": " + data[1];
		const [colour, borderColour, rank] = getDepColour(data[1], version);
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

function repoToJSXList(data, dependencies, dependencyMap) {
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

function repoToInverseJSXList(id: ID, dependencies: DependencyList, dependencyMap: DependencyMap) {
	const data = dependencyMap[id];
	const [deps, rank] = depsToInverseJSXList(data.version, dependencies, dependencyMap);
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
		const [repoList, rank] = repoToJSXList(cachedData.depMap[data.id], data.dependencies, cachedData.depMap);
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

export function jsonToDualTreeView(cachedData) {
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

	let inverseDeps = new Map();
	for (const data of cachedData[1]) {
		for (const [depId, depVersion] of data.dependencies) {
			if (!inverseDeps.has(depId)) { inverseDeps.set(depId, []); }
			inverseDeps.get(depId).push([data.dep, depVersion]);
		}
	}

	for (const [key, value] of inverseDeps) {
		const data = cachedData[0][key];
		const [deps, rank] = depsToInverseJSXList(data.version, value, cachedData[0]);
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

// Parameter: jsonData JSON cachesdata format
// Return: 
export function JSObjectFromJSON(jsonData0: any, jsonData1: any):
{
	depMap: Map<ID,  {name: string, version: SemVer, link: string, internal: boolean, archived: boolean}>,
	deps: {id: ID, dependencies: {id: ID, version: SemVer}[]}[]
}{
	/*
		TODO: Give the dependency map and the dependency array proper names (currently these are index 0 and 1 respectively)
		(This is indeed the case): Look into demapping the dependencies (I think JavaScript/TypeScript will use references. If it makes copies then we have to leave demapping until right before display).
	*/

	// CREATING NEW DEPENDENCY MAP
	let betterMap = new Map<ID, any>();
	for (const key in jsonData0){
		// Obj is properties inside the key
		const obj = jsonData0[key]
		betterMap.set(+key as ID, obj)
	}
	
	// DEPENDENCIES
	let newArray = []
	for(const element of jsonData1){
		const dependenciesArray = element.dependencies
		const newDependenciesArray = [ ]
		for (const i of dependenciesArray){
			const depID  = i[0] as ID
			const depVer =  semVerFromString(i[1])
			newDependenciesArray.push({
				id: depID,
				version: depVer
			})
		}
		newArray.push({
			id: element.dep as ID,
			dependencies: newDependenciesArray
		})
	}
	
	return{
		depMap: betterMap,
		deps: newArray
	}
};

export type DependencyData = ReturnType<typeof JSObjectFromJSON>
export type DependencyMap = ReturnType<typeof JSObjectFromJSON>["depMap"]
export type DependencyList = ReturnType<typeof JSObjectFromJSON>["deps"]
