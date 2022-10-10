import { NextApiRequest, NextApiResponse } from "next";
import { handleGitHubWebhookPushEvents, handleGitHubWebhookRepositoryEvents } from "../../node_modules/evergreen-org-crawler/src/webhooks/github";
// import { handleGitHubWebhookPushEvents, handleGitHubWebhookRepositoryEvents } from "evergreen-org-crawler";

import getConfig from "next/config";
const { publicRuntimeConfig: config } = getConfig();

let waitingPromise: {
	promise: Promise<void> | null;
	resolve: any;
} = { promise: null, resolve: null };

enum acceptedEventTypes {
	PUSH = "push",
	REPOSITORY = "repository"
}

let alreadyOneWaiting = false

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const eventType: string = req.headers["x-github-event"] as string
	try {
		if (Object.values<string>(acceptedEventTypes).includes(eventType) && req.body != null && req.body.organization.login ==
			process.env.NEXT_PUBLIC_TARGET_ORGANISATION) {
			// Resolve as quickly as possible
			res.status(200).end()

			// skip any push event that doesn't target the default branch
			// This is temporary, until we delegate this to crawler lib
			if (eventType == acceptedEventTypes.PUSH && req.body.ref != "refs/heads/" + req.body.repository.default_branch) {
				return
			}

			if (waitingPromise.promise != null) {
				if (alreadyOneWaiting) {
					// we only have to buffer a single request at a time, running other will be repetitive work
					return
				}
				// if alreadyOneWaiting is not used, all waiting promises here will proceed to execute as soon the promise is resolved

				console.log("Someone else has the promise, I will wait for them finish");

				alreadyOneWaiting = true
				await waitingPromise.promise;
				alreadyOneWaiting = false

				// waitingPromise.promise = null;
			}
			console.log(
				"I'm now free now to call backend at the moment, And I will create a new promise"
			);
			waitingPromise.promise = new Promise(function (resolve, reject) {
				waitingPromise.resolve = resolve;
			});

			updateCache(req.body, eventType);
		}
		else {
			res.status(404).end()
		}
	} catch (error) {
		console.log(`Failed to process GitHub event cache: ${error}`);
		res.status(500).end()
	}
}

async function updateCache(payload: any, eventType: string) {
	try {
		if (eventType == acceptedEventTypes.PUSH) {
			handleGitHubWebhookPushEvents(process.env.EVERGREEN_GITHUB_TOKEN!, {
				targetOrganisation: process.env.NEXT_PUBLIC_TARGET_ORGANISATION!,
				...config
			}, payload, false
			);
		}
		else if (eventType == acceptedEventTypes.REPOSITORY) {
			handleGitHubWebhookRepositoryEvents(process.env.EVERGREEN_GITHUB_TOKEN!, {
				targetOrganisation: process.env.NEXT_PUBLIC_TARGET_ORGANISATION!,
				...config
			}, payload, false
			);

		}
		else {
			console.log(`No function to handle this type of event: ${eventType}`)
		}
	}
	catch (error) {
		console.log(`Failed to updated cache: ${error}`);
	}
	if (waitingPromise.resolve != null) {
		waitingPromise.resolve();
		waitingPromise.promise = null;
	}
	else {
		console.log("Unhandled asynchronous case, please git blame for help")
	}
}
