import cachedData from "../cachedData.json";
import { createPage } from "../components/createPage";
import {JSObjectFromJSON} from "../components/dataProcessing";

export default function Home() {
    //Converts the raw loaded data into a more useable form
    //This is what all functions should use, rather than relying on any specifics of the JSON represetnation (which is not stable).
    const JSObject = JSObjectFromJSON(cachedData.npm as [any, {dep: number, dependencies: (string | number)[][]}[]] | never[])

	let page = createPage(JSObject)

	let script = <button onClick= {function callback(){
		var root = document.querySelector(":root") as {style: any} | null
		root?.style.setProperty("--table-left-edge", "#1e1e1e")
		root?.style.setProperty("--colour-black", "white")
		root?.style.setProperty("--colour-background", "black")
		root?.style.setProperty("--colour-font", "#fff")
		console.log("Test")}
	}>Dark Mode</button>
	

	return [script, page]
}