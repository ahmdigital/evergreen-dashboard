import Head from 'next/head';
import Layout from '../components/layout';
import Script from "next/script";
import styles from '../components/treeView.module.css';
import React from 'react';

import cachedData from "../cachedData.json";

const Colours = {
	green: "#cfc",
	greenBorder: "1px solid green",
	orange: "#ffc",
	orangeBorder: "1px solid orange",
	red: "#fcc",
	redBorder: "1px solid red",
};

let internalDependencies = new Set();

function semVerFromString(semVer) {
	let skipMinor = false;
	let skipBug = false;
	if (semVer[0] == '^') {
		semVer = semVer.substring(1);
		skipMinor = true;
		skipBug = true;
	} else if (semVer[0] == '~') {
		semVer = semVer.substring(1);
		skipBug = true;
	}
	semVer = semVer.split(".");
	return {
		major: parseInt(semVer[0]),
		minor: parseInt(semVer[1]),
		bug: parseInt(semVer[2]),
		skipMinor: skipMinor,
		skipBug: skipBug
	};
}

function externalLinkJSX(data){
	return <span style={{float: "right"}}>(<a target="_blank" href={data.link}>GitHub</a>)</span>
}

function getDepColour(usedVersion, currentVersion) {
	const used = semVerFromString(usedVersion);
	const current = semVerFromString(currentVersion);
	if (used.major < current.major) {
		return [Colours.red, Colours.redBorder, 0];
	} else if (used.minor + 5 < current.minor) {
		return [Colours.orange, Colours.orangeBorder, 1];
	}
	return [Colours.green, Colours.greenBorder, 2];
}

function rankToDepColour(rank) {
	if (rank == 0) {
		return [Colours.red, Colours.redBorder, 0];
	} else if (rank == 1) {
		return [Colours.orange, Colours.orangeBorder, 1];
	}
	return [Colours.green, Colours.greenBorder, 2];
}

function depsToJSXList(dependencies, dependencyMap) {
	let internalDeps = [];
	let externalDeps = [];
	for (const data of dependencies) {
		const dependencyData = dependencyMap[data[0]];
		const str = dependencyData.name + ": " + data[1] + ' -> ' + dependencyData.version;
		const [colour, borderColour, rank] = getDepColour(data[1], dependencyData.version);
		const dep = (
			<li key={str}>
				<div style={{backgroundColor: colour, padding: 5, border: borderColour}}>
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

	return [sortedDeps, minRank];
};

function depsToInverseJSXList(version, dependencies, dependencyMap) {
	let deps = [];
	for (const data of dependencies) {
		const dependencyData = dependencyMap[data[0]];
		const str = dependencyData.name + ": " + data[1];
		const [colour, borderColour, rank] = getDepColour(data[1], version);
		const dep = (
			<li key={"inverse" + str}>
				<div style={{backgroundColor: colour, padding: 5, border: borderColour}}>
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

function repoToJSXList(data, dependencies, dependencyMap) {
	const [deps, rank] = depsToJSXList(dependencies, dependencyMap);
	const [colour, borderColour] = rankToDepColour(rank);
	const name = data.name;
	let ret;
	if (deps.length != 0) {
		ret = (
			<li key={name}>
				<div style={{backgroundColor: colour, padding: 5, border: borderColour}}>
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
				<div style={{backgroundColor: Colours.green, padding: 5, border: Colours.greenBorder}}>
					<span style={{margin:0}}>{name}</span>
					{externalLinkJSX(data)}
				</div>
			</li>
		);
	}
	return [ret, rank];
};

function repoToInverseJSXList(id, dependencies, dependencyMap) {
	const data = dependencyMap[id];
	const [deps, rank] = depsToInverseJSXList(data.version, dependencies, dependencyMap);
	const [colour, borderColour] = rankToDepColour(rank);
	let ret = (
		<li key={"inverse" + data.name}>
			<div style={{backgroundColor: colour, padding: 5, border: borderColour}}>
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

function jsonToTreeView(cachedData) {
	//Populate internal dependencies, which is used for sorting at lower levels
	for (const data of cachedData[1]) {
		internalDependencies.add(data.dep);
	}

	let repos = [];
	let ranks = [0, 0, 0];
	for (const data of cachedData[1]) {
		const [repoList, rank] = repoToJSXList(cachedData[0][data.dep], data.dependencies, cachedData[0]);
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
	);
}

function jsonToInverseTreeView(cachedData) {
	//Populate internal dependencies, which is used for sorting at lower levels
	for (const data of cachedData[1]) {
		internalDependencies.add(data.dep);
	}

	let inverseDeps = new Map();
	for (const data of cachedData[1]) {
		for (const [depId, depVersion] of data.dependencies) {
			if (!inverseDeps.has(depId)) {inverseDeps.set(depId, []);}
			inverseDeps.get(depId).push([data.dep, depVersion]);
		}
	}

	let repos = [];
	for (const [key, value] of inverseDeps) {
		repos.push(repoToInverseJSXList(key, value, cachedData[0]));
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
	);
}

function jsonToDualTreeView(cachedData) {
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
			if (!inverseDeps.has(depId)) {inverseDeps.set(depId, []);}
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
			depTree.set(key,
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
					<div style={{display: "flex", padding: "10px"}}>
						<div style={{width: "calc(45vw - 64px)"}}>
							{val.down}
						</div>
						<div style={{width: "64px"}}></div>
						<div style={{width: "calc(45vw - 64px)"}}>
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

function JSObjectFromJSON(jsonData){
	/*
		TODO: Convert the arrays in the map to objects (there is a task for this)
		TODO: Give the dependency map and the dependency array proper names (currently these are index 0 and 1 respectively)
		TODO: Look into demapping the dependencies (I think JavaScript/TypeScript will use references. If it makes copies then we have to leave demapping until right before display).
	*/

	return jsonData;
};

export default function Home() {
	//Converts the raw loaded data into a more useable form
	//This is what all functions should use, rather than relying on any specifics of the JSON represetnation (which is not stable).
	const JSObject = JSObjectFromJSON(cachedData)

	//Get a reference to each name, as the names are changed(autogenerated) after compilation
	const Styles = {
		caret: styles.caret,
		active: styles.active,
		nested: styles.nested,
		caret_down: styles.caret_down,
	};

	var res = (
		<div className="container">
			<Script id="toggle-treeview">{`
				var toggler = document.getElementsByClassName("${Styles.caret}")
				var i

				for (i = 0; i < toggler.length; i++) {
					toggler[i].addEventListener("click", function () {
						this.parentElement.parentElement.querySelector(".${Styles.nested}").classList.toggle("${Styles.active}");
						this.classList.toggle("${Styles.caret_down}");
					})
				}
			`}</Script>

			<Head>
				<title>Evergreen dashboard</title>
			</Head>
			<main style={{padding: 10}}>
				<h1 className="title" style={{padding: 10, fontWeight: 600}}>
					evergreen
				</h1>
				<Layout>
					<div style={{justifyContent: "center", height: "max-content", width: "calc(100vw - 64px)", border: ".5rem solid #000", borderBottom: "none", padding: 10}}>
						{jsonToTreeView(JSObject)}
					</div>
				</Layout>
				<Layout>
					<div style={{justifyContent: "center", height: "max-content", width: "calc(100vw - 32px - 0.25rem)", border: ".25rem solid #000"}}></div>
				</Layout>
				<Layout>
					<div style={{justifyContent: "center", height: "max-content", width: "calc(100vw - 64px)", border: ".5rem solid #000", borderTop: "none", borderBottom: "none", padding: 10}}>
						{jsonToInverseTreeView(JSObject)}
					</div>
				</Layout>
				<Layout>
					<div style={{justifyContent: "center", height: "max-content", width: "calc(100vw - 32px - 0.25rem)", border: ".25rem solid #000"}}></div>
				</Layout>
				<Layout>
					<div style={{justifyContent: "center", height: "max-content", width: "calc(100vw - 64px)", border: ".5rem solid #000", borderTop: "none", padding: 10}}>
						{jsonToDualTreeView(JSObject)}
					</div>
				</Layout>
			</main>
		</div>
	);

	return res;
}
