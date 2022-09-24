/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: "standalone",
};
const withTM = require("next-transpile-modules")(["evergreen-org-crawler"]);

function MergeCustomConfig(customConfigFileName) {
	const fs = require("fs");
	const DefaultConfigFileName = "./config.json";

	const DefaultConfig = JSON.parse(
		fs.readFileSync(DefaultConfigFileName, "utf-8")
	);

	let MergedConfigs = DefaultConfig;
	if (fs.existsSync(customConfigFileName)) {
		try {
			const customConfig = JSON.parse(
				fs.readFileSync(customConfigFileName, "utf-8")
			);

			// TODO: check the validity of the values in custom config
			for (const [key, value] of Object.entries(customConfig)) {
				if (!DefaultConfig[key]) {
					console.warn(
						`Ignoring invalid key "${key}" found in ${customConfigFileName}`
					);
				}
			}
			// Overwrite default configs with the custom ones
			MergedConfigs = { ...DefaultConfig, ...customConfig };
		} catch (e) {
			throw new Error(
				`Could not load custom configs from ${customConfigFileName}: ${e}`
			);
		}
	}
	return MergedConfigs;
}

const CustomConfigFileName = "./customConfig.json";
const config = MergeCustomConfig(CustomConfigFileName);

module.exports = withTM({
	publicRuntimeConfig: {
		...config
	},
	webpack5: true,
	webpack: (config) => {
		config.resolve.fallback = { fs: false };
		return config;
	},
	...nextConfig,
});
