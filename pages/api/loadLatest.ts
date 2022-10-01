import * as fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse} from 'next'
import getConfig from 'next/config'
const { publicRuntimeConfig: config } = getConfig()
import { checkAuthorisation } from "../../src/authenticationMiddleware";

// Cache files are stored inside ./next folder
const CachePath = path.resolve(process.env.DYNAMIC_CACHE_DIR ?? "", "./dynamicCache.json")

const timeUntilRefresh = config.timeUntilRefresh * 60 * 1000 // minutes to milliseconds

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const isAuthorised = await checkAuthorisation(req, res)
	if(!isAuthorised){
		return
	}

	let cachedData = null

	const current = Date.now().valueOf()

	try {
		var stats = fs.statSync(CachePath);
		var mtimeMs = stats.mtimeMs;

		cachedData = JSON.parse(fs.readFileSync(CachePath, 'utf8'))

		const dif = current - mtimeMs

		//console.log("Now: " + current + "\nLast Edit: " + mtimeMs + "Dif: " + dif)

		if(dif > timeUntilRefresh){
			console.log("Cache file is too old.")
		}
	} catch (error) {
		console.log("Cache file does not exist.")

		cachedData = {npm: [], PyPI: [], RubyGems: []}
	}

	res.status(200).json(cachedData)
}
