import Head from 'next/head';
import Layout from '../components/layout'
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

function getDepColour(usedVersion, currentVersion) {
	const used = semVerFromString(usedVersion);
	const current = semVerFromString(currentVersion);
	if (used.major + 2 < current.major) {
		return [Colours.red, Colours.redBorder, 0];
	} else if (used.major < current.major || used.minor + 5 < current.minor) {
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
		const str = dependencyData[0] + ": " + data[1] + ' -> ' + dependencyData[1];
		const [colour, borderColour, rank] = getDepColour(data[1], dependencyData[1]);
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
	if(internalDeps.length > 0){
		sortedDeps.push(<li>Internal:</li>)
		for (const [rank, depList] of internalDeps) {
			sortedDeps.push(depList);
		}
	}
	if(externalDeps.length > 0){
		sortedDeps.push(<li>External:</li>)
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
		const str = dependencyData[0] + ": " + data[1];
		const [colour, borderColour, rank] = getDepColour(data[1], version);
		const dep = (
			<li key={str}>
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

	const minRank = deps[0][0]

	return [sortedDeps, minRank];
};

function repoToJSXList(name, dependencies, dependencyMap) {
	const [deps, rank] = depsToJSXList(dependencies, dependencyMap);
	const [colour, borderColour] = rankToDepColour(rank);
	let ret;
	if (deps.length != 0) {
		ret = (
			<li key={name}>
				<div style={{backgroundColor: colour, padding: 5, border: borderColour}}>
					<span className={styles.caret}>{name}</span>
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
					<ul>{name}</ul>
				</div>
			</li>
		);
	}
	return [ret, rank];
};

function repoToInverseJSXList(id, dependencies, dependencyMap) {
	const [name, version] = dependencyMap[id]
	const [deps, rank] = depsToInverseJSXList(version, dependencies, dependencyMap);
	const [colour, borderColour] = rankToDepColour(rank);
	let ret = (
		<li key={name}>
			<div style={{backgroundColor: colour, padding: 5, border: borderColour}}>
				<span className={styles.caret}>{name + ", " + deps.length + " user"+ (deps.length == 1 ? "" : "s") +" (" + version + ")"}</span>
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
		const [repoList, rank] = repoToJSXList(cachedData[0][data.dep][0], data.dependencies, cachedData[0]);
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

function jsonToInverseTreeView(cachedData){
	//Populate internal dependencies, which is used for sorting at lower levels
	for (const data of cachedData[1]) {
		internalDependencies.add(data.dep);
	}

	let inverseDeps = new Map()
	for (const data of cachedData[1]) {
		for(const [depId, depVersion] of data.dependencies){
			if(!inverseDeps.has(depId)){ inverseDeps.set(depId, []) }
			inverseDeps.get(depId).push([data.dep, depVersion])
		}
	}

	let repos = []
	for (const [key, value] of inverseDeps) {
		repos.push(repoToInverseJSXList(key, value, cachedData[0]))
	}

	repos.sort()
	let sortedRepos = []
	for (const data of repos) {
		sortedRepos.push(data[1])
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

export default function Home() {
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
				<h1 className="title" style={{padding: 10}}>
					evergreen
				</h1>
				<Layout>
					<div style={{justifyContent: "center", height: "max-content", width: "calc(100vw - 64px)", border: ".5rem solid #000",  borderBottom: "none", padding: 10}}>
						{jsonToTreeView(cachedData)}
					</div>
				</Layout>
				<Layout>
				<div style={{justifyContent: "center", height: "max-content", width: "calc(100vw - 32px - 0.25rem)", border: ".25rem solid #000"}}></div>
				</Layout>
				<Layout>
					<div style={{justifyContent: "center", height: "max-content", width: "calc(100vw - 64px)", border: ".5rem solid #000",  borderTop: "none", padding: 10}}>
						{jsonToInverseTreeView(cachedData)}
					</div>
				</Layout>
			</main>
		</div>
	);

	return res;
}
