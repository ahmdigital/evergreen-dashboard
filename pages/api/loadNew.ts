import * as fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse} from 'next'

import { getJsonStructure } from "evergreen-org-crawler/src/index"
import config from "../../config.json"

// Cache files are stored inside ./next folder
const CachePath = path.resolve("./dynamicCache.json")
const EmptyCachePath = path.resolve("./defaultDynamicCache.json")

//TODO: Move to config file
const timeUntilRefresh = 5 * 60 * 1000 // 5 minutes in milliseconds

let waitingPromise: Promise<void> | null = null
let promiseResolve: any = null

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

		const dif = current - mtimeMs

		if(dif > timeUntilRefresh){
			if(waitingPromise != null){
				await waitingPromise
				cachedData = JSON.parse(await fs.promises.readFile(CachePath, 'utf8'))
			} else{
				console.log("Cache file is too old. Recreating...")
				cachedData = null
				waitingPromise = new Promise(function(resolve, reject){
					promiseResolve = resolve;
				});
			}
		} else{
			cachedData = JSON.parse(await fs.promises.readFile(CachePath, 'utf8'))
		}

		//console.log("Now: " + current + "\nLast Edit: " + mtimeMs + "Dif: " + dif)
	} catch (error) {
		console.log("Cache file does not exist. Intialising...")
	}

	if(cachedData == null){
		// cachedData = {
		// 	now: current,
		// 	lastEdit: mtimeMs,
		// 	dif: (current - mtimeMs)
		// }
		// Store data in cache files
		// this always rewrites/overwrites the previous file
		try {
			const data = await createData()
			console.log(data)

			await fs.promises.writeFile(CachePath, data)
			promiseResolve()
			waitingPromise = null
			console.log("Recreated cache")

			cachedData = JSON.parse(data)
		} catch (error) {
			console.log("Failed to create cache. ", error)

			try {
				cachedData = JSON.parse(await fs.promises.readFile(CachePath, 'utf8'))
			} catch {
				console.log("No cached file exists as a fallback; server will crash.")
				cachedData = JSON.parse(await fs.promises.readFile(EmptyCachePath, 'utf8'))
			}
		}
	} else{
		console.log("Served cache")
	}

	res.status(200).json(cachedData)
}
