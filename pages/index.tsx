import cachedData from "../cachedData.json";
import { Page } from "../components/Page";
import {JSObjectFromJSON} from "../src/dataProcessing";

export default function Home() {
    //Converts the raw loaded data into a more useable form
    //This is what all functions should use, rather than relying on any specifics of the JSON represetnation (which is not stable).
    const JSObject = JSObjectFromJSON(cachedData.npm as [any, {dep: number, dependencies: (string | number)[][]}[]] | never[])

	return <Page JSObject={JSObject} />
}
