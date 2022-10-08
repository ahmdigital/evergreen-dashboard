/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: "standalone",
	// need to include(trace) these files, because next cannot determine whether they are important
	// this option doesn't seem to work, so copy them manually in dockerfile
	// unstable_includeFiles: ["./dynamicCache.json", "./defaultDynamicCache.json"]
};
// const withTM = require("next-transpile-modules")(["evergreen-org-crawler"]);


// const config = require('config'); // in case of using node-config
const config = require('./config.json');

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

// const CustomConfigFileName = "./customConfig.json";
// const evergreenConfig = MergeCustomConfig(CustomConfigFileName);
// console.log(evergreenConfig)
module.exports = ({
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
