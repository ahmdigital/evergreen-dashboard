import { Tooltip } from "@mui/material";
import {
  rankToStatusType,
  statusDefinitionsDeps,
  statusDefinitionsRepos
} from "../constants";
import { IconImgGenerator } from "./IconFactory";

type StatusIconProps = {
  rank: number;
  variant?: "small" | "medium";
};

export function StatusIcon(props: StatusIconProps) {
  // Setting the status
  const statusType = rankToStatusType[props.rank];

  const iconDefinition = () => {
    if (props.variant === "small") {
      return statusDefinitionsDeps[statusType];
    } else {
      return statusDefinitionsRepos[statusType];
    }
  };

  const displayedIcon = (
    <IconImgGenerator
      type={statusType}
      iconSize={props?.variant === "small" ? "33px" : "40px"}
      layout="fixed"
    ></IconImgGenerator>
  );

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
