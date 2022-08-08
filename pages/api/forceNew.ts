import * as fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse} from 'next'

// Was not sure which import statement to keep?
// import { getJsonStructure } from "../../../crawler/src/index"
import { getJsonStructure } from "evergreen-org-crawler/src/index"

import config from "../../config.json"

// Cache files are stored inside ./next folder
const CachePath = path.resolve("./dynamicCache.json")
const EmptyCachePath = path.resolve("./defaultDynamicCache.json")

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

//TODO: extract overlap between this and loadNew
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	let cachedData = null

	try {
		if(waitingPromise != null){
			await waitingPromise
			waitingPromise = null
			cachedData = JSON.parse(await fs.promises.readFile(CachePath, 'utf8'))
		} else{
			console.log("Manual refresh requested. Recreating...")
			cachedData = null
			waitingPromise = new Promise(function(resolve, reject){
				promiseResolve = resolve;
			});
		}
	} catch (error) {
		console.log("Cache file does not exist. Intialising...")
	}

	if(cachedData == null){
		try {
			const data = await createData()

			await fs.promises.writeFile(CachePath, data)
			if(promiseResolve != null){
				promiseResolve()
				waitingPromise = null
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
