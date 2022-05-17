import closeIcon from "./images/closeIcon.png";
import legend from "./images/legend.png";
import styles from "./HelpScreen.module.css";
import Image from "next/image";

const HelpScreen = ({
  closeHelp,
}: {
  closeHelp: (value: boolean | ((prev: boolean) => boolean)) => void;
}) => {
  return (
    <div className={styles.modalBg}>
      <div className={styles.modalContainer}>
        <div
          className={styles.closeHelpScreen}
          onClick={() => {
            closeHelp(false);
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
          <Image className={styles.legend} alt="legend" src={legend} />
        </div>
      </div>
    </div>
  );
};

export default HelpScreen;
