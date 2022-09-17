import Tooltip from "@mui/material/Tooltip/Tooltip";
import refreshIcon from "components/images/refresh.svg";
import Image from "next/image";
import styles from "../styles/SummaryContainer.module.css";


type RefreshButtonProps = {
    handler?: React.MouseEventHandler<HTMLButtonElement>;
    iconSize: string;
    fontSize: string;
};

const RefreshButton = (props: RefreshButtonProps) => {

    return (
        <div className={styles.btnsContainer}>
            <Tooltip arrow title={<p className={styles.tooltipStyle}>Check for new repository updates</p>}>
                <button onClick={props.handler}>
                <Image src={refreshIcon} alt="refresh" width={props.iconSize} height={props.iconSize}></Image>
                <span className={styles.refreshWord}>Refresh</span>
                </button>
            </Tooltip>
        </div>
   )
};

export default RefreshButton;
