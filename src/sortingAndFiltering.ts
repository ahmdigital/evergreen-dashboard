import { ProcessedDependencyData } from "../hooks/useProcessDependencyData";
import dayjs from "dayjs";

export type SortSettings = { type: "name" | "rank" | "time" | "internal" | "external" | "total" | "users", direction: boolean }
export type Filter = { type: "" | "time", level: any, direction: boolean, showRed: boolean, showYellow: boolean, showGreen: boolean }

export function applySort(rows: ProcessedDependencyData, sortSetting: SortSettings) {
	switch (sortSetting.type) {
		case ("name"):
			rows.sort((a, b) => a.name.localeCompare(b.name))
			break
		case ("rank"):
			//Sort by name first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			break
		case ("time"):
			//Sort by name and rank first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			rows.sort((a, b) => dayjs(b.lastUpdated).diff(dayjs(a.lastUpdated)))
			break
		case ("internal"):
			//Sort by name and rank first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			rows.sort((a, b) => a.internalSubRows.length - b.internalSubRows.length)
			break
		case ("external"):
			//Sort by name and rank first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			rows.sort((a, b) => a.externalSubRows.length - b.externalSubRows.length)
			break
		case ("total"):
			//Sort by name and rank first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			rows.sort((a, b) => (a.internalSubRows.length + a.externalSubRows.length) - (b.internalSubRows.length + b.externalSubRows.length))
			break
		case ("users"):
			//Sort by name and rank first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			rows.sort((a, b) => a.userSubRows.length - b.userSubRows.length)
			break
	}

	if (!sortSetting.direction) { rows.reverse() }
}

export function rankCounts(rows: ProcessedDependencyData) {
	//Find counts of each rank
	const rankArray = { green: 0, red: 0, yellow: 0 }

	for (let i = 0; i < rows.length; i++) {
		if (rows[i].minRank == 2) {
			rankArray.green += 1
		}
		if (rows[i].minRank == 1) {
			rankArray.yellow += 1
		}
		if (rows[i].minRank == 0) {
			rankArray.red += 1
		}
	}

	return rankArray
}

export function applyFilter(row: ProcessedDependencyData[0], filter: Filter): boolean {
	switch (row.minRank) {
		case 0: if (!filter.showRed) { return false } break
		case 1: if (!filter.showYellow) { return false } break
		case 2: if (!filter.showGreen) { return false } break
	}
	switch (filter.type) {
		//case "rank":
		//return filter.direction ? (row.minRank >= filter.level) : (row.minRank <= filter.level)
		//break
		case "time":

			break
	}
	return true
}

export function searchAndFilter(rows: ProcessedDependencyData, jsxRows: JSX.Element[], filterSetting: Filter, searchTerm: string) {
	let diplayedRows = []
	for (let i = 0; i < rows.length; i++) {
		let row = rows[i]
		let jsx = jsxRows[i]

		if (
			applyFilter(row, filterSetting) && (
				searchTerm.length == 0 ||
				row.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
		) {
			diplayedRows.push(jsx)
		}
	}
	return diplayedRows
}
