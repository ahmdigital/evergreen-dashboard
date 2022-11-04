export const Colours = {
	greenVar: "--colour-green",
	orangeVar: "--colour-yellow" as any,
	redVar: "--colour-red" as any,
}

export function getResolved(variable: string){
	const globalStyle = getComputedStyle(document.body)
	return globalStyle.getPropertyValue(variable)
}
