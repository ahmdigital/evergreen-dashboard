import cachedData from "../cachedData.json";
import Page from "../components/Page";
import { JSObjectFromJSON } from "../components/dataProcessing";
import { getJsonStructure } from "repocrawler/src/index"
import config from "repocrawler/config.json"
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

enum Mode{
	Frontend,
	StandaloneBackend,
	IntegratedBacked
}

//TODO: Move to config file
const mode: Mode = Mode.IntegratedBacked

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
	return o[propertyName];
}

async function integratedBacked(request: "npm" | "PyPI" | "RubyGems"){
	console.log("Start")
	let JSObject = await fetch("api/test")
	while(!JSObject.ok){
		JSObject = await fetch("api/test")
	}
	console.log(JSObject)
	const data = await JSObject.json()
	const result = JSObjectFromJSON(getProperty(data! as { npm: any, PyPI: any, RubyGems: any }, request))
	console.log("End")
	return result
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
			case(Mode.IntegratedBacked): {
				// let JSObject = fetch("api/test").then((res) => res.json()).then(
				// 	data => JSObjectFromJSON(getProperty(data! as { npm: any, PyPI: any, RubyGems: any }, request))
				// ).then((result) => {
				// 	setData(result as any)
				// 	setLoading(false)
				// })
				integratedBacked(request).then((result) => {
					setData(result as any)
					setLoading(false)
				})
			} break;
			
		}
	}, [])

	if (isLoading) {
		return <Box sx={{ display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh' }}>
			<CircularProgress />
		</Box>
	}
	if (!data) { return <p>Failed to load data!</p> }


	return <Page JSObject={data} />
}