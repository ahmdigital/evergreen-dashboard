import { Tooltip } from "@mui/material";
import RedIconImg from "../images/redLight.svg";
import YellowIconImg from "../images/yellowLight.svg";
import GreenIconImg from "../images/greenLight.svg";
import {
  rankToStatusType,
  statusDefinitionsDeps,
  statusDefinitionsRepos,
  statusLabel,
} from "../constants";

type StatusIconProps = {
  rank: number;
  variant?: "small" | "medium";
};

export function StatusIcon(props: StatusIconProps) {
  // Setting the status
  const statusType = rankToStatusType[props.rank];
  const statusText = statusLabel[statusType];
  const iconDefinition = () => {
    if (props.variant != undefined && props.variant === "small") {
      return statusDefinitionsDeps[statusType];
    } else {
      return statusDefinitionsRepos[statusType];
    }
  };

  // Declaring all icon outputs
  const outDatedIcon = (
    <RedIconImg
      layout="fixed"
      alt={statusText}
      width={props?.variant === "small" ? "33px" : "40px"}
      height={props?.variant === "small" ? "33px" : "40px"}
      fill={"var(--rank-red)"}
    />
  );
  const midDatedIcon = (
    <YellowIconImg
      layout="fixed"
      alt={statusText}
      width={props?.variant === "small" ? "33px" : "40px"}
      height={props?.variant === "small" ? "33px" : "40px"}
      fill={"var(--rank-orange)"}
    />
  );
  const upDatedIcon = (
    <GreenIconImg
      layout="fixed"
      alt={statusText}
      width={props?.variant === "small" ? "33px" : "40px"}
      height={props?.variant === "small" ? "33px" : "40px"}
      fill={"var(--rank-green)"}
    />
  );
  var displayedIcon = outDatedIcon;

  // Choose what to display based on type
  if (statusType == 2) {
    displayedIcon = midDatedIcon;
  } else if (statusType == 1) {
    displayedIcon = upDatedIcon;
  }

  return (
    <Tooltip
      arrow
      title={
        <p
          style={{
            fontSize: "var(--font-size-normal)",
            fontFamily: "var(--primary-font-family)",
          }}
        >
          {iconDefinition()}
        </p>
      }
    >
      <div
        style={{
          display: "grid",
          maxWidth: "100%",
          maxHeight: "100%",
          alignItems: "center",
        }}
      >
        {displayedIcon}
      </div>
    </Tooltip>
  );
}
