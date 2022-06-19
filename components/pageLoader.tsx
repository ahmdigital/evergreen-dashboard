import cachedData from "../cachedData.json";
import Page from "./Page";
import { JSObjectFromJSON } from "../src/dataProcessing";
import { getJsonStructure } from "evergreen-org-crawler/src/index"
import config from "evergreen-org-crawler/config.json"
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

enum Mode{
	Frontend,
	StandaloneBackend,
	IntegratedBackend
}

//TODO: Move to config file
const mode: Mode = Mode.IntegratedBackend

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
	return o[propertyName];
}

async function getDataFromAPI(api: "loadNew" | "loadLatest", request: "npm" | "PyPI" | "RubyGems"){
	console.log("Start")
	let JSObject = await fetch("api/" + api)
	let retries = 10
	while(!JSObject.ok){
		JSObject = await fetch("api/" + api)
		--retries
		if(retries == 0){
			throw new Error("Failed to fetch")
		}
	}
	console.log(JSObject)
	const data = await JSObject.json()
	const result = JSObjectFromJSON(getProperty(data! as { npm: any, PyPI: any, RubyGems: any }, request))
	console.log("End")
	return result
}

async function getNewVersion(request: "npm" | "PyPI" | "RubyGems"){
	return getDataFromAPI("loadNew", request)
}

async function getCurrentVersion(request: "npm" | "PyPI" | "RubyGems"){
	return getDataFromAPI("loadLatest", request)
}

export default function PageLoader(request: "npm" | "PyPI" | "RubyGems") {
	const requestToAPI = {
		npm: "NPM",
		PyPI: "PYPI",
		RubyGems: "RUBYGEMS"
	}
	let api = getProperty(requestToAPI, request)


	const [data, setData] = useState(null)
	const [isLoading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)

		switch(mode){
			case(Mode.Frontend): {
				const accessToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN!
				let JSObject = getJsonStructure(
					accessToken, config, [api]
				).then(
					result => JSON.parse(result) as { npm: any, PyPI: any, RubyGems: any }
				).then(
					data => JSObjectFromJSON(getProperty(data!, request))
				)
				JSObject.then((result) => {
					setData(result as any)
					setLoading(false)
				})
			} break;
			case(Mode.StandaloneBackend): {
				const data = getProperty((cachedData as { npm: any, PyPI: any, RubyGems: any })!, request)
				let JSObject = JSObjectFromJSON(data)
				setData(JSObject as any)
				setLoading(false)
			} break;
			case(Mode.IntegratedBackend): {
				getCurrentVersion(request).then((result) => {
					setData({oldVersion: true, data: result as any} as any)
				}).then(async () => {
					await getNewVersion(request).then(async (result) => {
						setData(result as any)
						setLoading(false)
					})
				})
			} break;
		}
	}, [])

	if (isLoading) {
		if(mode == Mode.IntegratedBackend){
			//TODO: Support overwriting current page data rather than recreating the whole page.
			//TODO: Alternatively, copy the state (i.e. which tabs are open) to the new page
			if(data != null && (data! as {oldVersion: boolean, data: any}).oldVersion){
				return <Page JSObject={(data as {oldVersion: boolean, data: any}).data}  finalData={false}/>
			}
		}

		return <Box sx={{ display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh' }}>
			<CircularProgress />
		</Box>
	}
	if (!data) { return <p>Failed to load data!</p> }

	return <Page JSObject={data} finalData={true}/>
}
