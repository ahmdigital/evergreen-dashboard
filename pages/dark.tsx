import PageLoader from "../components/pageLoader"

export default function Profile(){
	let page = PageLoader("npm")

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
