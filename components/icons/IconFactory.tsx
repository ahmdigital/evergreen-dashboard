import { Tooltip } from "@mui/material";
import { PropsWithChildren } from "react";
import styles from "../../styles/Row.module.css";
import { iconAltText, statusDefinitions, StatusType } from "../constants";
import RedIconImg from "../images/redIcon.svg";
import YellowIconImg from "../images/yellowIcon.svg";
import GreenIconImg from "../images/greenIcon.svg";
import Image, { ImageProps } from "next/image";

type IconDefProps = {
  iconDefinition: string;
};
export const IconDefinition = (props: IconDefProps) => {
  return <p className={styles.tooltipStyle}>{props.iconDefinition}</p>;
};

type IconFactoryProps = {
  toolTip: boolean;
} & IconGeneratorProps &
  IconToolTipGeneratorProps;

type IconGeneratorProps = {
  type: StatusType;
  iconSize: string;
};

export const iconImg: { [key in StatusType]: any } = {
  [StatusType.GREEN]: GreenIconImg,
  [StatusType.RED]: RedIconImg,
  [StatusType.YELLOW]: YellowIconImg,
};

type IconImgGeneratorProps = IconGeneratorProps & Partial<ImageProps>;

export const IconImgGenerator = (props: IconImgGeneratorProps) => {
  const { type, iconSize } = props;

  return (
    <Image
        src={iconImg[type]}
        alt={iconAltText[type]}
        width={iconSize}
        height={iconSize}
        layout={props.layout}
        className={props.className}
    />
  );
};

type IconToolTipGeneratorProps = {
  type: StatusType;
  toolTipLabel?: string;
};

const IconToolTipGenerator = (
  props: PropsWithChildren<IconToolTipGeneratorProps>
) => {
  const { type, toolTipLabel } = props;
  const definition = () => statusDefinitions[type];
  const title = (
    <IconDefinition
      iconDefinition={toolTipLabel ? toolTipLabel : definition()}
    />
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
