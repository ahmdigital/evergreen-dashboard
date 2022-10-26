import "../global.css";
import { CatchAllErrors } from "../components/ErrorBoundary";

//TODO: Download/link to fonts

export default function MyApp({ Component, pageProps }) {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	return (
		<CatchAllErrors>
			{getLayout(<Component {...pageProps} />)}
		</CatchAllErrors>
	);
}
