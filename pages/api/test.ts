import * as fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse} from 'next'

import { getJsonStructure } from "repocrawler/src/index"
import config from "repocrawler/config.json"

// Cache files are stored inside ./next folder
const CachePath = path.resolve("./dynamicCache.json")

const timeUntilRefresh = 5 * 60 * 1000 // 5 minutes in milliseconds

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName];
}

async function createData(request: "npm" | "PyPI" | "RubyGems"){
	const requestToAPI = {
		npm: "NPM",
		PyPI: "PYPI",
		RubyGems: "RUBYGEMS"
	}
	let api = getProperty(requestToAPI, request)

	const accessToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN!
	return getJsonStructure(accessToken, config, [api])
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

		cachedData = await createData("PyPI")
		console.log(cachedData)

		// Store data in cache files
		// this always rewrites/overwrites the previous file
		try {
			fs.writeFileSync(CachePath, cachedData)
			console.log("Recreated cache")
		} catch (error) {
			console.log("Failed to create cache. ", error)
		}
	} else{
		console.log("Served cache")
	}

	res.status(200).json({ text: cachedData })
}