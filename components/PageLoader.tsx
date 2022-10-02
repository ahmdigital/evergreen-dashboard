import cachedData from "../cachedData.json";
import {Page} from "./Page";
import { JSObjectFromJSON } from "../src/dataProcessing";
// import { getJsonStructure } from "evergreen-org-crawler/src/index"
import { useEffect, useState } from "react";
import LoadingSnackbar from "./FeedbackComponents/LoadingSnackbar";
import ErrorSnackbar from "./FeedbackComponents/ErrorSnackbar";
// import getConfig from 'next/config'
// const { publicRuntimeConfig: config } = getConfig()

enum Mode {
	Frontend,
	StandaloneBackend,
	IntegratedBackend
}

//TODO: Move to config file
const mode: Mode = Mode.IntegratedBackend

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
	return o[propertyName];
}

async function getDataFromAPI(api: "loadNew" | "loadLatest" | "forceNew", request: "npm" | "PyPI" | "RubyGems"){
	console.log("Start")
	let JSObject = await fetch("api/" + api)
	let retries = 10
	while(!JSObject.ok){
		//user is not authorised and should be signed in
		if (JSObject.status == 401 || JSObject.status == 403){
			const error = await JSObject.json()
			if (error?.message === "login_required"){
				window.location.href = "/signin"
			}else{
				window.location.href = `/signin?error=${encodeURIComponent(error?.message)}`
			}
		}

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

export async function forceNewVersion(request: "npm" | "PyPI" | "RubyGems"){
	return getDataFromAPI("forceNew", request)
}


async function getNewVersion(request: "npm" | "PyPI" | "RubyGems"){
	return getDataFromAPI("loadNew", request)
}

async function getCurrentVersion(request: "npm" | "PyPI" | "RubyGems"){
	return getDataFromAPI("loadLatest", request)
}

export let PageLoaderSetLoading: any = null
export let PageLoaderIsLoading: any = null
export let PageLoaderSetData: any = null
export let PageLoaderCurrentData: any = null

export let lastRequest: any = null

export function PageLoader(request: "npm" | "PyPI" | "RubyGems") {
	const requestToAPI = {
		npm: "NPM",
		PyPI: "PYPI",
		RubyGems: "RUBYGEMS"
	}
	let api = getProperty(requestToAPI, request)

	lastRequest = request

	const [data, setData] = useState(null)
	const [isLoading, setLoading] = useState(false)
	PageLoaderSetLoading = setLoading
	PageLoaderSetData = setData
	PageLoaderCurrentData = data
	PageLoaderIsLoading = isLoading

	useEffect(() => {
		setLoading(true)

		switch(mode){
			// case(Mode.Frontend): {
			// 	const accessToken = process.env.NEXT_PUBLIC_EVERGREEN_GITHUB_TOKEN!
			// 	let JSObject = getJsonStructure(
			// 		accessToken, {targetOrganisation: config.targetOrganisation, ...config}, [api]
			// 	).then(
			// 		(result: string) => JSON.parse(result) as { npm: any, PyPI: any, RubyGems: any }
			// 	).then(
			// 		(data: any) => JSObjectFromJSON(getProperty(data!, request))
			// 	)
			// 	JSObject.then((result: any) => {
			// 		setData(result as any)
			// 		setLoading(false)
			// 	})
			// } break;
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
	// Three states, loading, failed, or loaded
	if (isLoading) {
		if(mode == Mode.IntegratedBackend){
			//TODO: Support overwriting current page data rather than recreating the whole page.
			//TODO: Alternatively, copy the state (i.e. which tabs are open) to the new page
			if(data != null && (data! as {oldVersion: boolean, data: any}).oldVersion){
				return <Page JSObject={(data as {oldVersion: boolean, data: any}).data}  finalData={false}/>
			} else if( data != null && (data! as {refreshing: boolean, data: any}).refreshing){
				return <Page JSObject={(data as {refreshing: boolean, data: any}).data}  finalData={false}/>
			}
		}

		return <><LoadingSnackbar open={true}/></>
	}
	if (!data) {
		// If data is unable to load, throw error message to user
		return <><ErrorSnackbar open={true}/></>
	}

	return <Page JSObject={data} finalData={true}/>
}
