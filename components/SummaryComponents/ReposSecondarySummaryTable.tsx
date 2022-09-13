import * as React from 'react';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import styles from "./ReposSecondarySummaryTable.module.css";
import { useTheme } from '@mui/material/styles';
import { PackageData, ProcessedDependencyData } from "../../hooks/useProcessDependencyData";
import { compareSemVerDelta, SemVerDelta, semVerToDelta } from "../../src/semVer";
import { Filter } from "../../src/sortingAndFiltering";

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
function MostCommonSummaryTable(name: string, usageCounts: {name: string, id: number, count: number}[], filterTerm: Filter, setFilterTerm: any) {
	return (
		<Table>
			<TableRow>
				<TableCell className={styles.totalsCellStyle}>
					<h3>{name}</h3>
				</TableCell>
				<TableCell className={styles.totalsCellStyle}>
				</TableCell>
			</TableRow>
			{
				usageCounts.slice(0, 5).map(i => {
						return <TableRow key={i.id} sx={{ ...(filterTerm.mustHaveDependency == i.id && {background: "var(--colour-table-selected)"})}} onClick={() => setFilterTerm({...filterTerm, mustHaveDependency: filterTerm.mustHaveDependency == i.id ? -1 : i.id})}>
						<TableCell className={styles.tableCellStyle}>
							<div className={styles.textContainer}>
								{i.name}
							</div>
						</TableCell>
						<TableCell className={styles.tableCellStyle}>
							<div className={styles.countContainer}>
								{i.count}
							</div>
						</TableCell>
					</TableRow>
				})
			}
		</Table>
	);
}

/* Create a stepper contatining multiple summary tables of the data */
export default function ReposSecondarySummaryTable(props: {
	rows: ProcessedDependencyData;
	filterTerm: any;
	setFilterTerm: any;
}) {
	const theme = useTheme();
	const [activeStep, setActiveStep] = React.useState(0);

	//TODO: Move outside of function, as these can be constant
	let options = [
		MostCommonSummaryTable("Most common dependencies", countUsage(props.rows, false), props.filterTerm, props.setFilterTerm),
		MostCommonSummaryTable("Most common outdated", countUsage(props.rows, true), props.filterTerm, props.setFilterTerm)
	]

	let maxSteps = options.length;

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1)
		props.setFilterTerm({...props.filterTerm, mustHaveDependency: -1})
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1)
		props.setFilterTerm({...props.filterTerm, mustHaveDependency: -1})
	};

	return (
		<Box sx={{ flexGrow: 1, width: "100%"}}>
			{options[activeStep]}
			<MobileStepper
				steps={maxSteps}
				position="static"
				activeStep={activeStep}
				nextButton={
					<Button
						size="small"
						onClick={handleNext}
						disabled={activeStep === maxSteps - 1}
					>
						{/* Next */}
						{theme.direction === 'rtl' ? (
							<KeyboardArrowLeft />
						) : (
							<KeyboardArrowRight />
						)}
					</Button>
				}
				backButton={
					<Button size="small" onClick={handleBack} disabled={activeStep === 0}>
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