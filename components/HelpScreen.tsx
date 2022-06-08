import closeIcon from "./images/closeIcon.png";
import legend from "./images/legend.png";
import styles from "./HelpScreen.module.css";
import Image from "next/image";

export type HelpScreenProps = {
	closeHelp: (_value: boolean | ((_prev: boolean) => boolean)) => void
}

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
          <h1>Light Status Legend</h1>
        </div>
        <div className={styles.legend}>
          <Image className={styles.legend} alt="legend" src={legend} />
        </div>
      </div>
    </div>
  );
};
