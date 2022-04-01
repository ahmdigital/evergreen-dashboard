//import styles from '../components/treeView.module.css';

console.log(`${styles.caret}`)

var toggler = document.getElementsByClassName(styles.caret);
var i;

for (i = 0; i < toggler.length; i++) {
	toggler[i].addEventListener("click", function () {
		this.parentElement.querySelector(".nested").classList.toggle(styles.active);
		this.classList.toggle(styles.caret_down);
	});
}