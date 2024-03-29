import getConfig from 'next/config'
const { publicRuntimeConfig: config } = getConfig()

export type SemVer = {
	major: number;
	minor: number;
	bug: number;
	rest: string;
	skipMinor: boolean;
	skipBug: boolean;
};

export type SemVerDelta = {
	major: number;
	minor: number;
	bug: number;
	skipMinor: boolean;
	skipBug: boolean;
};

export function semVerToDelta(current: SemVer, latest: SemVer): SemVerDelta{
	return {
		major: latest.major - current.major,
		minor: Math.max(latest.minor - current.minor, 0),
		bug: Math.max(latest.bug - current.bug, 0),
		skipMinor: current.skipMinor,
		skipBug: current.skipBug
	}
}

export function compareSemVerDelta(a: SemVerDelta, b: SemVerDelta): number{
	if(a.major != b.major){
		return a.major - b.major
	} else if (a.minor != b.minor){
		if(a.skipMinor == b.skipMinor){
			return a.minor - b.minor
		} else{
			let newA = a.skipMinor ? 0 : a.minor;
			let newB = b.skipMinor ? 0 : b.minor;
			return newA - newB
		}
	} else if (a.bug != b.bug){
		if(a.skipBug == b.skipBug){
			return a.bug - b.bug
		} else{
			let newA = a.skipBug ? 0 : a.bug;
			let newB = b.skipBug ? 0 : b.bug;
			return newA - newB
		}
	} else{
		return 0
	}
}

function semVerToArray(semVer: SemVer): number[]{
	return [semVer.major, semVer.minor, semVer.bug];
}

function semVerToSkipArray(semVer: SemVer): boolean[]{
	return [false, semVer.skipMinor, semVer.skipBug];
}

export function semVerToString(semVer: SemVer): string {
	let res: string = ""
	if (semVer.skipMinor) {
		res += '^'
	} else if (semVer.skipBug) {
		res += '~'
	}
	res += semVer.major + "." + semVer.minor + "." + semVer.bug
	if (semVer.rest !== "") {
		res += "-" + semVer.rest
	}
	return res
}

/*
* Converts a string to a SemVer (semantic version) object
* String should be of the form:
*		[^|=|~|(~>)] *N.N[.N[-.*]]
* TODO: https://devhints.io/semver
*/
export function semVerFromString(semVer: string): SemVer {
	let skipMinor = false
	let skipBug = false

	let rubyGemsSkipLast = false

	for(;;){
		if (semVer[0] == '^') {
			semVer = semVer.substring(1);
			skipMinor = true
			skipBug = true
		} else if (semVer[0] == '~') {
			if(semVer[1] == '>'){
				rubyGemsSkipLast = true
				semVer = semVer.substring(1)
			}
			semVer = semVer.substring(1)
			skipBug = true
		} else if (semVer[0] == '=') {
			semVer = semVer.substring(1)
		} else if (semVer[0] == '>'){
			if(semVer[1] == '>'){
				semVer = semVer.substring(1)
			}
			semVer = semVer.substring(1)
			skipMinor = true
			skipBug = true
		}else{
			break
		}
	}

	const parts = semVer.split(".", 3)

	if (parts.length == 2) {
		return {
			major: parseInt(parts[0]),
			minor: parseInt(parts[1]),
			bug: 0,
			rest: "",
			skipMinor: rubyGemsSkipLast || skipMinor,
			skipBug: true
		}
	}

	if (parts.length < 3) {
		return {
			major: 0,
			minor: 0,
			bug: 0,
			rest: "",
			skipMinor: skipMinor,
			skipBug: skipBug
		}
	}

	const bugAndRest = parts[2].split("-")
	//Handle negative number
	if(bugAndRest[0] == ""){
		bugAndRest.shift();
		bugAndRest[0] = '-' + bugAndRest[0];
	}

	return {
		major: parseInt(parts[0]),
		minor: parseInt(parts[1]),
		bug: parseInt(bugAndRest[0]),
		rest: bugAndRest[1] ? bugAndRest[1] : "",
		skipMinor: skipMinor,
		skipBug: rubyGemsSkipLast || skipBug
	}
}

function compareWithCutoff(used: SemVer, current: SemVer, allowance: SemVer, ignoreSkips: boolean = true): boolean{
	const U = semVerToArray(used);
	const S = semVerToSkipArray(used);
	const C = semVerToArray(current);
	const A = semVerToArray(allowance);

	let pass = true;
	for(let i = 0; i != U.length; ++i){
		if(A[i] == -1){ continue; }
		pass &&= (U[i] + A[i] >= C[i]) || (S[i] && ignoreSkips);
	}

	return pass;
}

export function findRank(used: SemVer, current: SemVer): number {
	//I think this is correct? This actually raises an issue, as most projects will enable downloading the newest minor version, but
	//there's no enforcement of the newest version being used, nor does it reflect what is currently deployed. Currently, ^ will lower the rank by one.
	if(!compareWithCutoff(used, current, semVerFromString(config.rankCutoff.major))){
		return 0;
	} else if(!compareWithCutoff(used, current, semVerFromString(config.rankCutoff.major), false) || !compareWithCutoff(used, current, semVerFromString(config.rankCutoff.minor))){
		return 1;
	}
	return 2;
}
