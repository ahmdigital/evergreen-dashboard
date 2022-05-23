import cachedData from "../cachedData.json";
import Page from "../components/Page";
import { JSObjectFromJSON } from "../components/dataProcessing";
import { getJsonStructure } from "repocrawler/src/index"
import config from "repocrawler/config.json"
import { useEffect, useState } from "react";


const frontendOnly: boolean = true;

export default function Profile() {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)
  
    useEffect(() => {
        setLoading(true)
        // setData(getJsonStructure(accessToken, config).then(result => JSON.parse(result) as { npm: any }).then(data => JSObjectFromJSON(data!.npm as [any, { dep: number, dependencies: (string | number)[][] }[]] | never[])))
        if (frontendOnly) {
            // const accessToken = getAccessToken()
            const accessToken = "TOKEN"
            let JSObject = getJsonStructure(accessToken, config, ["PYPI"]).then(result => JSON.parse(result) as { PyPI: any }).then(data => JSObjectFromJSON(data!.PyPI as [any, { dep: number, dependencies: (string | number)[][] }[]] | never[]))
            JSObject.then((result) => {setData(result as any)})
        } else {
            // data = cachedData as { npm: any }
            let JSObject = JSObjectFromJSON((cachedData as { npm: any })!.npm as [any, { dep: number, dependencies: (string | number)[][] }[]] | never[])
            setData(JSObject as any)
        }
        setLoading(false)     
    }, [])
  
    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>
  

    return <Page JSObject={data} />
}