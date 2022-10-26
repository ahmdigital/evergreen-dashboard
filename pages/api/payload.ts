import { NextApiRequest, NextApiResponse } from "next";
import {
	handleGitHubWebhookPushEvents,
	handleGitHubWebhookRepositoryEvents,
} from "evergreen-org-crawler/build/webhooks/github";
import path from "path";
import pino from "pino";
import fs from "fs";
import getConfig from "next/config";
const { publicRuntimeConfig: config } = getConfig();

const pinoStreams = [
	{
		stream: fs.createWriteStream(
			path.resolve(
				process.env.DYNAMIC_CACHE_DIR ?? "",
				"./api-payload.log",
			),
		),
	},
	{ stream: pino.destination(1) },
];
const MasterLogger = pino(
	{
		level: process.env.PINO_LOG_LEVEL || "info", // currently level doesn't work when used with multistream
		formatters: {
			level: (label: string) => {
				return { level: label };
			},
		},
	},
	pino.multistream(pinoStreams),
	// pino.destination(path.resolve(process.env.DYNAMIC_CACHE_DIR ?? "", `./logs/api-payload.log`))
);

// used to enforce sequential event processing
// without it, race conditions occur
let waitingPromise: {
	promise: Promise<void> | null;
	resolve: any;
} = { promise: null, resolve: null };

enum acceptedEventTypes {
	PUSH = "push",
	REPOSITORY = "repository",
}

let alreadyOneWaiting = false;

// This handler is used to trigger crawling whenever an event(acceptedEventTypes) is
// received from github
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const eventType: string = req.headers["x-github-event"] as string;
	try {
		MasterLogger.info(
			`Received an event on api/payload with user-agent: ${req.headers["user-agent"]}`,
		);
		const childLogger = MasterLogger.child({
			GUID: req.headers["x-github-delivery"],
		});

		if (
			Object.values(acceptedEventTypes).filter(
				(x: string) => x === eventType,
			) &&
			req.body != null &&
			req.body.organization.login ==
				process.env.NEXT_PUBLIC_TARGET_ORGANISATION
		) {
			childLogger.info({
				Webhook_GUID: req.headers["x-github-delivery"],
				EventType: eventType,
			});
			// Resolve as quickly as possible
			res.status(200).end();

			// skip any push event that doesn't target the default branch
			// TODO: delegate this condition to crawler lib
			if (
				eventType == acceptedEventTypes.PUSH &&
				req.body.ref !=
					"refs/heads/" + req.body.repository.default_branch
			) {
				childLogger.info(
					{ repository: req.body.repository.name, ref: req.body.ref },
					"Ignoring this push event because it doesn't target the default branch",
				);
				return;
			}

			if (waitingPromise.promise != null) {
				if (alreadyOneWaiting) {
					// we only have to buffer a single request at a time, running other will be repetitive work
					childLogger.info(
						{ repository: req.body.repository.name },
						"Ignoring this event because there is one is already in queue",
					);
					return;
				}
				// if alreadyOneWaiting is not used, all waiting promises here will proceed to execute as soon the promise is resolved
				childLogger.debug(
					"Someone else has the promise, I will wait for them finish",
				);

				alreadyOneWaiting = true;
				await waitingPromise.promise;
				alreadyOneWaiting = false;

				// waitingPromise.promise = null;
			}
			childLogger.debug(
				"I'm now free now to call backend at the moment, And I will create a new promise",
			);
			waitingPromise.promise = new Promise(function (resolve, _reject) {
				waitingPromise.resolve = resolve;
			});

			childLogger.info(
				{ repository: req.body.repository.name },
				"Proceeding to update cache...",
			);
			updateCache(req.body, <acceptedEventTypes>eventType, childLogger);
		} else {
			childLogger.info("Event doesn't satisfy the requirements");
			res.status(404).end();
		}
	} catch (error) {
		MasterLogger.fatal(error, "Failed to process GitHub webhook event");
		res.status(500).end();
	}
}

async function updateCache(
	payload: any,
	eventType: acceptedEventTypes,
	logger: any,
) {
	try {
		if (eventType == acceptedEventTypes.PUSH) {
			await handleGitHubWebhookPushEvents(
				process.env.EVERGREEN_GITHUB_TOKEN!,
				{
					targetOrganisation:
						process.env.NEXT_PUBLIC_TARGET_ORGANISATION!,
					...config,
				},
				payload,
				false,
			);
		} else if (eventType == acceptedEventTypes.REPOSITORY) {
			await handleGitHubWebhookRepositoryEvents(
				process.env.EVERGREEN_GITHUB_TOKEN!,
				{
					targetOrganisation:
						process.env.NEXT_PUBLIC_TARGET_ORGANISATION!,
					...config,
				},
				payload,
				false,
			);
		} else {
			logger.error(
				{ eventType: eventType },
				"No function to handle this type of event",
			);
		}
	} catch (error) {
		logger.error(error, "Failed to updated cache");
	}
	if (waitingPromise.resolve != null) {
		waitingPromise.resolve();
		waitingPromise.promise = null;
	} else {
		logger.fatal("Unhandled asynchronous case, please git blame for help");
	}
}
