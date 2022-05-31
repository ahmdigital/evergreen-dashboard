import { DependencyData, DependencyMapElement, ID } from "../src/dataProcessing";
import { findRank, SemVer } from "../src/semVer";

export type PackageData = DependencyMapElement & {
	rank: number;
	id: ID;
	usedVersion: SemVer;
}

export type ProcessedDependencyData = (DependencyMapElement & {
	minRank: number
	internalSubRows: PackageData[]
	externalSubRows: PackageData[]
	userSubRows: PackageData[]
})[]


export function useProcessDependencyData(JSObject: DependencyData) {	
	const rowList: ProcessedDependencyData = [];

	for (const dep of JSObject.deps) {
		const data = JSObject.depMap.get(dep.id) as DependencyMapElement

		const internalSubRows: PackageData[] = [];
		const externalSubRows: PackageData[] = [];
		const userSubRows: PackageData[] = [];

		let minRank = 2;

		for (const i of dep.dependencies) {
			const iData = JSObject.depMap.get(i.id) as DependencyMapElement
			const rank = findRank(i.version, iData.version);

			const depData = JSObject.depMap.get(i.id) as DependencyMapElement

			const subRow: PackageData = { ...iData, rank, id: i.id, usedVersion: i.version}
			depData.internal
				? internalSubRows.push(subRow)
				: externalSubRows.push(subRow)

			if (rank < minRank) {
				minRank = rank;
			}
		}

		for (const i of dep.users) {
			const rank = findRank(i.version, data.version);
			const iData = JSObject.depMap.get(i.id) as DependencyMapElement
			const subRow: PackageData = { ...iData, rank, id: i.id, usedVersion: i.version}
			userSubRows.push(subRow);
		}

		rowList.push({
			...data,
			minRank: minRank,
			internalSubRows: internalSubRows,
			externalSubRows: externalSubRows,
			userSubRows: userSubRows,
		});
	}

	return rowList;
}