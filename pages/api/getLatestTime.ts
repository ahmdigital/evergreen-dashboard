import * as fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse} from 'next'
import { checkAuthorisation } from "../../src/authenticationMiddleware";

// Cache files are stored inside ./next folder
const CachePath = path.resolve("./dynamicCache.json")

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const isAuthorised = await checkAuthorisation(req, res)
	if(!isAuthorised){
		return
	}

	let cachedData = null

	try {
		cachedData = JSON.parse(fs.readFileSync(CachePath, 'utf8'))
	} catch (error) {
		console.log("Cache file does not exist.")

		cachedData = {aux: {}, npm: [], PyPI: [], RubyGems: []}
	}

	res.status(200).json({aux: cachedData.aux})
}
