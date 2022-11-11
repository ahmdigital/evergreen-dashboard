import { Tooltip } from "@mui/material";
import { PropsWithChildren } from "react";
import styles from "../../styles/Row.module.css";
import { iconAltText, statusDefinitionsDeps, StatusType } from "../constants";
import RedIconImg from "../images/redLight.svg";
import YellowIconImg from "../images/yellowLight.svg";
import GreenIconImg from "../images/greenLight.svg";
import { ImageProps } from "next/image";

type IconFactoryProps = {
  toolTip: boolean;
} & IconGeneratorProps &
IconToolTipGeneratorProps;

type IconGeneratorProps = {
  type: StatusType;
  iconSize: string;
};

export const iconImg: { [_key in StatusType]: any } = {
  [StatusType.GREEN]: GreenIconImg,
  [StatusType.RED]: RedIconImg,
  [StatusType.YELLOW]: YellowIconImg,
};

type IconImgGeneratorProps = IconGeneratorProps & Partial<ImageProps>;

const iconColour = {
  [StatusType.GREEN] : "var(--rank-green)",
  [StatusType.RED] : "var(--rank-red)",
  [StatusType.YELLOW] : "var(--rank-orange)"
};

export const IconImgGenerator = (props: IconImgGeneratorProps) => {
  const { type, iconSize } = props;
  const displayedIcon = iconImg[type]({
    fill: iconColour[type],
    alt: iconAltText[type],
    width: iconSize,
    height: iconSize,
    layout: props.layout
  });
  return <>{displayedIcon}</>;
};

type IconToolTipGeneratorProps = {
  type: StatusType;
  toolTipLabel?: string;
};

const IconToolTipGenerator = (
  props: PropsWithChildren<IconToolTipGeneratorProps>
) => {
  const { type, toolTipLabel } = props;
  const definition = () => statusDefinitionsDeps[type];
  const title = (
    <p className={styles.tooltipStyle}>
      {toolTipLabel ? toolTipLabel : definition()}
    </p>
  );

  return (
    <Tooltip arrow title={title}>
      <div className={styles.iconContainer}>{props.children}</div>
    </Tooltip>
  );
};

export const LightStatusIconFactory = (props: IconFactoryProps) => {
  const { type, toolTip, iconSize, toolTipLabel } = props;
  const iconImg = <IconImgGenerator type={type} iconSize={iconSize} />;
  if (toolTip) {
    return (
      <IconToolTipGenerator type={type} toolTipLabel={toolTipLabel}>
        {iconImg}
      </IconToolTipGenerator>
    );
  } else {
    return iconImg;
  }
};
