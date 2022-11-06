import {
  rankToStatusType,
  statusDefinitionsDeps,
  statusDefinitionsRepos
} from "../constants";
import { LightStatusIconFactory } from "./IconFactory";

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

  return (
    <LightStatusIconFactory
      toolTip={true}
      type={statusType}
      iconSize={props?.variant === "small" ? "33px" : "40px"}
      toolTipLabel={iconDefinition()}
    ></LightStatusIconFactory>
  );
}
