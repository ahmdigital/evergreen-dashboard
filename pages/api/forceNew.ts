import * as fs from "fs";
import { NextApiRequest, NextApiResponse} from 'next'
import { CachePath, saveAndServerCache, waitingPromise } from "./loadNew";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	let cachedData = null

	try {
		if(waitingPromise.promise != null){
			await waitingPromise.promise
			waitingPromise.promise = null
			cachedData = JSON.parse(await fs.promises.readFile(CachePath, 'utf8'))
		} else{
			console.log("Manual refresh requested. Recreating...")
			cachedData = null
			waitingPromise.promise = new Promise(function(resolve, reject){
				waitingPromise.resolve = resolve;
			});
		}
	} catch (error) {
		console.log("Cache file does not exist. Intialising...")
	}

	await saveAndServerCache(res, cachedData);
}
