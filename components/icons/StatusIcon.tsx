import { Tooltip } from "@mui/material";
import Image from "next/image";
import { iconImg } from "./IconFactory";
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
  const statusIcon = iconImg[statusType];
  const statusText = statusLabel[statusType];
  const iconDefinition = () => {
    if (props.variant === "small") {
      return statusDefinitionsDeps[statusType] }
    else{ return statusDefinitionsRepos[statusType]}
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
        <Image
          layout="fixed"
          src={statusIcon}
          alt={statusText}
          width={props?.variant === "small" ? "33px" : "40px"}
          height={props?.variant === "small" ? "33px" : "40px"}
        />
      </div>
    </Tooltip>
  );
}
