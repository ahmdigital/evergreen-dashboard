import * as fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse} from 'next'

import { getJsonStructure } from "repocrawler/src/index"
import config from "repocrawler/config.json"

// Cache files are stored inside ./next folder
const CachePath = path.resolve("./dynamicCache.json")

//TODO: Move to config file
const timeUntilRefresh = 5 * 60 * 1000 // 5 minutes in milliseconds

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName];
}

async function createData(request: "npm" | "PyPI" | "RubyGems" | null = null){
	const requestToAPI = {
		npm: "NPM",
		PyPI: "PYPI",
		RubyGems: "RUBYGEMS"
	}
	
	let api = null
	if(request != null){
		api = [getProperty(requestToAPI, request)]
	}

	const accessToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN!
	return getJsonStructure(accessToken, config, api)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	let cachedData = null

	const current = Date.now().valueOf()

	try {
		var stats = fs.statSync(CachePath);
		var mtimeMs = stats.mtimeMs;

		cachedData = JSON.parse(fs.readFileSync(CachePath, 'utf8'))

		const dif = current - mtimeMs

		//console.log("Now: " + current + "\nLast Edit: " + mtimeMs + "Dif: " + dif)

		if(dif > timeUntilRefresh){
			console.log("Cache file is too old. Recreating...")
			cachedData = null
		}
	} catch (error) {
		console.log("Cache file does not exist. Intialising...")
	}

	if(cachedData == null){
		// cachedData = {
		// 	now: current,
		// 	lastEdit: mtimeMs,
		// 	dif: (current - mtimeMs)
		// }

		const data = await createData()
		console.log(data)

		// Store data in cache files
		// this always rewrites/overwrites the previous file
		try {
			fs.writeFileSync(CachePath, data)
			console.log("Recreated cache")
		} catch (error) {
			console.log("Failed to create cache. ", error)
		}

		cachedData = JSON.parse(data)
	} else{
		console.log("Served cache")
	}

	res.status(200).json(cachedData)
}