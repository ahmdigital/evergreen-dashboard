import * as fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse} from 'next'

// Was not sure which import statement to keep?
// import { getJsonStructure } from "../../../crawler/src/index"
import { getJsonStructure } from "evergreen-org-crawler/src/index"

import config from "../../config.json"

// Cache files are stored inside ./next folder
export const CachePath = path.resolve(process.env.DYNAMIC_CACHE_PATH || "./dynamicCache.json")
export const EmptyCachePath = path.resolve("./defaultDynamicCache.json")

const timeUntilRefresh = config.timeUntilRefresh * 60 * 1000 // minutes to milliseconds

export let waitingPromise: {
	promise: Promise<void> | null
	resolve:  any
} = {promise: null, resolve: null}

export function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName];
}

export async function saveAndServerCache(res: NextApiResponse, cachedData: any){
	if(cachedData == null){
		try {
			const data = await createData()

			await fs.promises.writeFile(CachePath, data)
			if(waitingPromise.resolve != null){
				waitingPromise.resolve()
				waitingPromise.promise = null
			}

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

export async function createData(request: "npm" | "PyPI" | "RubyGems" | null = null){
	const requestToAPI = {
		npm: "NPM",
		PyPI: "PYPI",
		RubyGems: "RUBYGEMS"
	}

	let api = null
	if(request != null){
		api = [getProperty(requestToAPI, request)]
	}

	const accessToken = process.env.EVERGREEN_GITHUB_TOKEN!
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
			if(waitingPromise.promise != null){
				await waitingPromise.promise
				cachedData = JSON.parse(await fs.promises.readFile(CachePath, 'utf8'))
			} else{
				console.log("Cache file is too old. Recreating...")
				cachedData = null
				waitingPromise.promise = new Promise(function(resolve, reject){
					waitingPromise.resolve = resolve;
				});
			}
		} else{
			cachedData = JSON.parse(await fs.promises.readFile(CachePath, 'utf8'))
		}

		//console.log("Now: " + current + "\nLast Edit: " + mtimeMs + "Dif: " + dif)
	} catch (error) {
		console.log("Cache file does not exist. Intialising...")
	}

	await saveAndServerCache(res, cachedData);
}
