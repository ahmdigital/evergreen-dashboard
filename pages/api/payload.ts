import { NextApiRequest, NextApiResponse } from "next";
import { handleGitHubWebhookPushEvents, handleGitHubWebhookRepositoryEvents } from "../../node_modules/evergreen-org-crawler/src/webhooks/github";

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
	if (Object.values(acceptedEventTypes).includes(eventType as acceptedEventTypes) && req.body != null) {
		try {
			if (req.body.organization.login ==
				process.env.NEXT_PUBLIC_TARGET_ORGANISATION) {
				// Resolve as quickly as possible
				res.status(200).end()

				// skip any push event not targeting the main branch
				// This is temporary, until we delegate this to crawler lib
				if (eventType == acceptedEventTypes.PUSH && req.body.ref != req.body.repository.default_branch) {
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
				// TODO, investigate whether the order of incoming requests is respected when asynchronous processing,
				// Given r3,r2,r1 ordered whichever came first, r1 will crawl first and r2 and r3 will wait, but after
				// r1 is finished what guarantee is there that r2 will execute next,
				// because it might get executed with this order r2,r3,r1,
				// basically we should use a buffer here to enforce orders
				// A better way is to cancel current promise and abruptly stop the crawling whenever an
				// a new event shows up, because the current crawling will be invalidated by the new one
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
}
