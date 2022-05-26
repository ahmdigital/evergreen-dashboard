import cachedData from "../cachedData.json";
import Page from "../components/Page";
import { JSObjectFromJSON } from "../components/dataProcessing";
import { getJsonStructure } from "repocrawler/src/index"
import config from "repocrawler/config.json"
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const frontendOnly: boolean = false;

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
	return o[propertyName];
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
		if (frontendOnly) {
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
		} else {
			const data = getProperty((cachedData as { npm: any, PyPI: any, RubyGems: any })!, request)
			let JSObject = JSObjectFromJSON(data)
			setData(JSObject as any)
			setLoading(false)
		}
	})

	if (isLoading) {
		return <Box sx={{ display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh' }}>
			<CircularProgress />
		</Box>
	}
	if (!data) { return <p>Failed to load data!</p> }


	return <Page JSObject={data} />
}