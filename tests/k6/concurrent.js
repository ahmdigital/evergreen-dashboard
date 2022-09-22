/*
	This is a basic simulation of the concurrent capabilities of our APIs.
	To run this test, make sure you have k6 installed, then run the command:
	k6 run .\concurrent.js
*/

import http from "k6/http";
import { sleep } from "k6";
import exec from "k6/execution";

export const options = {
	dns:{policy:"preferIPv6"},
	stages: [
		{ duration: "5s", target: 100 },
		{ duration: "30s", target: 100 },
		{ duration: "5s", target: 10 },
		{ duration: "5s", target: 0 }
	],
};

export default function () {
	let address = "http://localhost:3000/"

	if(exec.vu.iterationInScenario > 0){
		if(exec.vu.idInTest % 2 == 0){
			http.get(address + "api/loadNew");
		} else {
			http.get(address + "api/loadLatest");
		}
	} else{
		http.get(address + "api/forceNew");
	}
	sleep(1);
}
