import RedIcon from "./images/redIcon.svg";
import YellowIcon from "./images/yellowIcon.svg";
import GreenIcon from "./images/greenIcon.svg";
import { redDef, yellowDef, greenDef } from "./HelpComponents/LightStatus";
import { Tooltip } from "@mui/material";
import Image from "next/image";

type StatusIconProps = {
	rank: number;
	variant?: 'small' | 'medium';
}

export function StatusIcon(props: StatusIconProps) {

	let statusIcon = RedIcon;
	let statusText = "highly out-of-date";
	let iconDefinition = redDef.description;

	// Setting the status
	if (props.rank == 2) {
		statusIcon = GreenIcon;
		iconDefinition = greenDef.description;
		statusText = "Up to date";
	} else if (props.rank == 1) {
		statusIcon = YellowIcon;
		iconDefinition = yellowDef.description;
		statusText = "moderately out-of-date";
	}

	return <Tooltip arrow title={
		<p style={{ fontSize: 'var(--font-size-normal)', fontFamily: 'var(--primary-font-family)' }}>
			{iconDefinition}
		</p>
	}>
		<div style={{
			display: 'grid',
			maxWidth: '100%',
			maxHeight: '100%',
			alignItems: 'center'
			}}>
			<Image
				layout="fixed"
				src={statusIcon}
				alt={statusText}
				width= {props?.variant === 'small' ? '33px' : "40px"} 
				height={props?.variant === 'small' ? '33px' : "40px"}
			/>
		</div>
	</Tooltip>
}