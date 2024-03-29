import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import styles from "../../styles/ReposSecondarySummaryTable.module.css";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import { PackageData, ProcessedDependencyData } from "../../hooks/useProcessDependencyData";
import { compareSemVerDelta, SemVerDelta, semVerToDelta } from "../../src/semVer";
import { Filter } from "../../src/sortingAndFiltering";

import { topOfRepoBox } from "../Page"

// Customising the table styling using ThemeProvider
let baseTheme = {
	fontWeight: "var(--font-weight-semibold)",
	fontSize: "var(--font-size-normal)", //16px
	fontFamily: "var(--secondary-font-family)",
	padding: "4px",
	lineHeight: "inherit",
	"&:hover": {
		cursor: "pointer"
	}
}
export const theme = createTheme({
	components: {
		MuiTableCell: {
			styleOverrides: {
				root: baseTheme
			}
		}
	}
})

export const innerBoxTheme = createTheme({
	components: {
		MuiTableCell: {
			styleOverrides: {
				root: {
					...baseTheme,
					maxHeight: "160px", px: 2, paddingRight: "2px", paddingLeft: "2px", overflowX: "hidden", overflowY: "scroll", boxSizing: "border-box", display: "block"
				},
			}
		}
	}
})

export const innerRowTheme = createTheme({
	components: {
		MuiTableCell: {
			styleOverrides: {
				root: {
					...baseTheme,
					display: "inline-block", width: "100%"
				},
			}
		}
	}
})


/* Returns a sorted array containing the name/id of each dependecy and the number of repostiotories that use that dependency
 * The countOnlyOutdated flag allows the count to only include cases where the used dependency version is outdated.
 */
function countUsage(rows: ProcessedDependencyData, countOnlyOutdated: boolean) {
	let deps: Map<number, { name: string, count: number }> = new Map()

	const cutoff: SemVerDelta = { major: 0, minor: 0, bug: 0, skipMinor: false, skipBug: false }

	function addToDeps(sub: PackageData) {
		let delta = semVerToDelta(sub.usedVersion, sub.version)
		if (!countOnlyOutdated || compareSemVerDelta(cutoff, delta) < 0) {
			let currentCount = deps.has(sub.id) ? deps.get(sub.id)!.count : 0
			deps.set(sub.id, { name: sub.name, count: currentCount + 1 })
		}
	}

	for (let row of rows) {
		for (let sub of row.internalSubRows) { addToDeps(sub) }
		for (let sub of row.externalSubRows) { addToDeps(sub) }
	}

	let usageCounts: { name: string, id: number, count: number }[] = []

	for (let [id, data] of deps) {
		usageCounts.push({ name: data.name, id: id, count: data.count })
	}

	usageCounts.sort((a, b) => a.count - b.count)
	usageCounts.reverse()
	return usageCounts
}

/* Creates a small table of the first 5 elements of the given array. If these elements are clicked on, then that dependecny is added to the filter */
function MostCommonSummaryTable(name: string, usageCounts: { name: string, id: number, count: number }[], filterTerm: Filter, setFilterTerm: any) {
	return (
		<ThemeProvider theme={theme}>

			<Table sx={{ width: "100%", tableLayout: "fixed" }}>
				<Box sx={{ maxHeight: "160px", paddingLeft: "2px" }}>
					<TableRow>
						<TableCell className={styles.totalsCellStyle}>
							<h3>{name}</h3>
						</TableCell>
						<TableCell className={styles.totalsCellStyle}>
						</TableCell>
					</TableRow>
				</Box>
				<ThemeProvider theme={innerBoxTheme}>
					<Box sx={{ maxHeight: "145px", px: 2, paddingRight: "2px", paddingLeft: "2px", overflowX: "hidden", overflowY: "scroll", boxSizing: "border-box", display: "block" }}>
						{
							usageCounts.map(i => {
								return <div key={i.id + " containingDiv"}>
									<ThemeProvider theme={innerRowTheme}>
										<TableRow key={i.id} sx={{ display: "inline-block", width: "100%", ...(filterTerm.mustHaveDependency == i.id && { background: "var(--colour-table-selected)" }) }} onClick={() => {
											setFilterTerm({ ...filterTerm, mustHaveDependency: filterTerm.mustHaveDependency == i.id ? -1 : i.id })
											// @ts-ignore
											topOfRepoBox.data.current.scrollIntoView({ behavior: "smooth" });
											// An ignore is used here as we don't know the exact type the above will be in this file.
										}}>
											<TableCell className={styles.tableCellStyle1}>
												<div className={styles.textContainer}>
													{i.name}
												</div>
											</TableCell>
											<TableCell className={styles.tableCellStyle2}>
												<div className={styles.countContainer}>
													{i.count}
												</div>
											</TableCell>
										</TableRow>
									</ThemeProvider>
								</div>
							})
						}
					</Box>
				</ThemeProvider>
			</Table>

		</ThemeProvider>
	);
}

//TODO: There is currently a bug with the desktop view that causes this element to be recreated instead of updated
var activeStepCache = 0
var outdatedUsageCache: ReturnType<typeof countUsage> | null = null
var dependenciesUsageCache: ReturnType<typeof countUsage> | null = null

/* Create a stepper contatining multiple summary tables of the data */
export default function ReposSecondarySummaryTable(props: {
	rows: ProcessedDependencyData;
	filterTerm: any;
	setFilterTerm: any;
}) {
	const theme = useTheme();
	const [activeStep, setActiveStep] = React.useState(activeStepCache);

	if(outdatedUsageCache === null || dependenciesUsageCache === null){
		outdatedUsageCache = countUsage(props.rows, true)
		dependenciesUsageCache = countUsage(props.rows, false)
	}

	//TODO: Move outside of function (or make memo work), as these can be constant (except for the colour of the selected element)
	let options = React.useMemo(() => { return [
		MostCommonSummaryTable("Outdated", outdatedUsageCache!, props.filterTerm, props.setFilterTerm),
		MostCommonSummaryTable("Dependencies", dependenciesUsageCache!, props.filterTerm, props.setFilterTerm),
	]}, props.filterTerm)

	let maxSteps = options.length;

	const handleNext = () => {
		activeStepCache = Math.min(activeStepCache + 1, maxSteps-1)
		setActiveStep(activeStepCache)
		props.setFilterTerm({ ...props.filterTerm, mustHaveDependency: -1 })
	};

	const handleBack = () => {
		activeStepCache = Math.max(activeStepCache - 1, 0)
		setActiveStep(activeStepCache)
		props.setFilterTerm({ ...props.filterTerm, mustHaveDependency: -1 })
	};

	return (
		<Box sx={{ maxWidth: "100%" }}>
			{options[activeStep]}
			<MobileStepper
				steps={maxSteps}
				position="static"
				activeStep={activeStep}
				nextButton={
					<Button
						size="large"
						onClick={handleNext}
						disabled={activeStep === maxSteps - 1}
						aria-label='next'
						sx={{ padding: '0.65rem 0.2rem' }}
					>
						{/* Next */}
						{theme.direction === "rtl" ? (
							<KeyboardArrowLeft />
						) : (
							<KeyboardArrowRight />
						)}
					</Button>
				}
				backButton={
					<Button
						size="large"
						onClick={handleBack}
						disabled={activeStep === 0}
						aria-label='back'
						sx={{ padding: '0.65rem 0.2rem' }}
					>
						{theme.direction === 'rtl' ? (
							<KeyboardArrowRight />
						) : (
							<KeyboardArrowLeft />
						)}
						{/* Back */}
					</Button>
				}
			/>
		</Box>
	);
}
