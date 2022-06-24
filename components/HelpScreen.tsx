import closeIcon from "./images/closeIcon.png";
// import legend from "./images/legend.png";
import statusLegend from "./images/helpLegend.svg";
import styles from "./HelpScreen.module.css";
import Image from "next/image";

export type HelpScreenProps = {
  closeHelp: (_value: boolean | ((_prev: boolean) => boolean)) => void;
};

export default function HelpScreen(props: HelpScreenProps) {
  return (
    <div className={styles.modalBg}>
      <div className={styles.modalContainer}>
        <div
          className={styles.closeHelpScreen}
          onClick={() => {
            props.closeHelp(false);
          }}
        >
          <Image
            className={styles.closeBtn}
            width="40"
            height="40"
            alt="help"
            src={closeIcon}
          />
        </div>
        <div className={styles.title}>
          <h2>Light Status Legend</h2>
        </div>
        <div className={styles.legend}>
          <Image
            className={styles.legend}
            width="400"
            height="380"
            alt="legend"
            src={statusLegend}
          />
        </div>
      </div>
    </div>
  );
}
