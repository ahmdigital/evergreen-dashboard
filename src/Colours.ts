export const Colours = {
	green: "var(--colour-green)",
	greenVar: "--colour-green",
	greenBorder: "var(--rank-green-border)" as any,
	orange: "var(--colour-yellow)" as any,
	orangeVar: "--colour-yellow" as any,
	orangeBorder: "var(--rank-orange-border)" as any,
	red: "var(--colour-red)" as any,
	redVar: "--colour-red" as any,
	redBorder: "var(--rank-red-border)" as any,
	ahmThinBar: "#ccc" as any,
	ahmLeftTable: "#f6f6f6" as any,
	ahmBlack: "var(--colour-black)" as any,
	ahmTableLeftEdge: "var(--table-left-edge)" as any,

}

export function getResolved(variable: string){
	const globalStyle = getComputedStyle(document.body)
	return globalStyle.getPropertyValue(variable)
}
