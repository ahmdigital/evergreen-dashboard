import { ProcessedDependencyData } from "../hooks/useProcessDependencyData";
import dayjs from "dayjs";
import { compareSemVerDelta, SemVerDelta, semVerToDelta } from "./semVer";

export type SortSettings = { type: "name" | "repo" | "status" | "time" | "internal" | "external" | "total" | "users" | "mostOutdated", direction: boolean }
export type Filter = { type: "" | "time", level: any, direction: boolean, mustHaveDependency: number, showRed: boolean, showYellow: boolean, showGreen: boolean }

function findMostOutdated(rows: ProcessedDependencyData) {
	let mostOutdated: SemVerDelta[] = []
	for (let row of rows) {
		let curMin: SemVerDelta = { major: 0, minor: 0, bug: 0, skipMinor: false, skipBug: false }
		for (let sub of row.internalSubRows) {
			let delta = semVerToDelta(sub.usedVersion, sub.version)
			if (compareSemVerDelta(curMin, delta) < 0) {
				curMin = delta
			}
		}
		for (let sub of row.externalSubRows) {
			let delta = semVerToDelta(sub.usedVersion, sub.version)
			if (compareSemVerDelta(curMin, delta) < 0) {
				curMin = delta
			}
		}
		mostOutdated.push(curMin)
	}
	return mostOutdated
}

export function applySort(rows: ProcessedDependencyData, sortSetting: SortSettings) {
	//Sort by name and rank first
	rows.sort((a, b) => a.name.localeCompare(b.name))
	rows.sort((a, b) => a.minRank - b.minRank)

	switch (sortSetting.type) {
		case ("name"):
			rows.sort((a, b) => a.name.localeCompare(b.name))

			// Sort the internal, external dependencies & users
			rows.forEach((row) => {
				row.internalSubRows.sort((a, b) => a.name.localeCompare(b.name))
			})
			rows.forEach((row) => {
				row.externalSubRows.sort((a, b) => a.name.localeCompare(b.name))
			})
			rows.forEach((row) => {
				row.userSubRows.sort((a, b) => a.name.localeCompare(b.name))
			})
			break
		case ("repo"):
			rows.sort((a, b) => a.oldName?.localeCompare(b.oldName))
			break
		case ("status"):
			rows.sort((a, b) => a.minRank - b.minRank)

			// Sort the internal, external dependencies & users
			rows.forEach((row) => {
				row.internalSubRows.sort((a, b) => a.rank - b.rank)
			})
			rows.forEach((row) => {
				row.externalSubRows.sort((a, b) => a.rank - b.rank)
			})
			rows.forEach((row) => {
				row.userSubRows.sort((a, b) => a.rank - b.rank)
			})
			break
		case ("time"):
			rows.sort((a, b) => dayjs(b.lastUpdated).diff(dayjs(a.lastUpdated)))
			break
		case ("internal"):
			rows.sort((a, b) => a.internalSubRows.length - b.internalSubRows.length)
			break
		case ("external"):
			rows.sort((a, b) => a.externalSubRows.length - b.externalSubRows.length)
			break
		case ("total"):
			rows.sort((a, b) => (a.internalSubRows.length + a.externalSubRows.length) - (b.internalSubRows.length + b.externalSubRows.length))
			break
		case ("users"):
			rows.sort((a, b) => a.userSubRows.length - b.userSubRows.length)
			break
		case ("mostOutdated"):
			let deltas = findMostOutdated(rows)
			let forSorting = []
			for (let i = 0; i < rows.length; i++) {
				forSorting.push({ "delta": deltas[i], "data": rows[i] })
			}

			forSorting.sort((a, b) => compareSemVerDelta(a.delta, b.delta))

			for (let i = 0; i < rows.length; i++) {
				rows[i] = forSorting[i].data
			}
			break
	}

	if (!sortSetting.direction) {
		rows.reverse();

		// Reverse the internal, external, and subrows
		rows.forEach((row) => {
			row.internalSubRows.reverse()
		})
		rows.forEach((row) => {
			row.externalSubRows.reverse()
		})
		rows.forEach((row) => {
			row.userSubRows.reverse()
		})
	}
}

export function rankCounts(rows: ProcessedDependencyData) {
	//Find counts of each rank
	const rankArray = { green: 0, red: 0, yellow: 0 }

	for (const row of rows) {
		if (row.minRank == 2) {
			rankArray.green += 1
		}
		if (row.minRank == 1) {
			rankArray.yellow += 1
		}
		if (row.minRank == 0) {
			rankArray.red += 1
		}
	}

	return rankArray
}

export function applyFilter(row: ProcessedDependencyData[0], filter: Filter): boolean {
	if (filter.mustHaveDependency != -1) {
		let hasDependency = false
		for (let sub of row.internalSubRows) {
			if (sub.id == filter.mustHaveDependency) {
				hasDependency = true
				break
			}
		}

		if (!hasDependency) {
			for (let sub of row.externalSubRows) {
				if (sub.id == filter.mustHaveDependency) {
					hasDependency = true
					break
				}
			}
		}

		if (!hasDependency) {
			return false
		}

	}
	switch (row.minRank) {
		case 0: if (!filter.showRed) { return false } break
		case 1: if (!filter.showYellow) { return false } break
		case 2: if (!filter.showGreen) { return false } break
	}
	switch (filter.type) {
		case "time":

			break
	}
	return true
}
