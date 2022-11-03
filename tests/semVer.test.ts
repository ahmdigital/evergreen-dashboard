// testing file for the dataProcessing component
import { semVerToString, semVerFromString, findRank } from '../src/semVer';

/*
Tests:
- lowerLimit is less than upperLimit
- test semVerToDelta

*/

/*
    *****************************************************
    unit tests for ToString semantic versioning function
    *****************************************************
*/
describe('tests for semVerToString function', function () {

    test('semantic versioning strings first version', () => {
        const firstReleaseSemVer = {
            major: 1,
            minor: 0,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        }
        const semVerString = semVerToString(firstReleaseSemVer);
        console.log(semVerString);
        expect(semVerString).toBe('1.0.0');
    });

    test('semantic versioning string minor release', () => {
        const patchReleaseSemVer = {
            major: 1,
            minor: 1,
            bug: 0,
            rest: "",
            skipMinor: true,
            skipBug: true,
        }
        const semVerString = semVerToString(patchReleaseSemVer);
        console.log(semVerString);
        expect(semVerString).toBe('^1.1.0');
    });

    test('semantic versioning string bug release', () => {
        const patchReleaseSemVer = {
            major: 1,
            minor: 0,
            bug: 1,
            rest: "",
            skipMinor: false,
            skipBug: true,
        }
        const semVerString = semVerToString(patchReleaseSemVer);
        console.log(semVerString);
        expect(semVerString).toBe('~1.0.1');
    });

});

/*
    *******************************************************
    unit tests for FromString semantic versioning function
    *******************************************************
*/
describe('tests for semVerFromString function', function () {
    test('semantic versioning from string initial release', () => {
        const firstReleaseSemVerStr = '1.0.0';
        const semVer = semVerFromString(firstReleaseSemVerStr);
        console.log(semVer);
        expect(semVer).toStrictEqual({
            major: 1,
            minor: 0,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        });
    });

    test('semantic versioning from string rest component', () => {
        const restComponentSemVerStr = '0.0.0-development';
        const semVer = semVerFromString(restComponentSemVerStr);
        console.log(semVer);
        expect(semVer).toStrictEqual({
            major: 0,
            minor: 0,
            bug: 0,
            rest: "development",
            skipMinor: false,
            skipBug: false,
        });
    });

    test('semantic versioning from string minor release', () => {
        const firstReleaseSemVerStr = '^1.1.0';
        const semVer = semVerFromString(firstReleaseSemVerStr);
        console.log(semVer);
        expect(semVer).toStrictEqual({
            major: 1,
            minor: 1,
            bug: 0,
            rest: "",
            skipMinor: true,
            skipBug: true,
        });
    });

    test('semantic versioning from string patch release', () => {
        const patchReleaseSemVerStr = '^1.0.1';
        const semVer = semVerFromString(patchReleaseSemVerStr);
        console.log(semVer);
        expect(semVer).toStrictEqual({
            major: 1,
            minor: 0,
            bug: 1,
            rest: "",
            skipMinor: true,
            skipBug: true,
        });
    });

    test('semantic versioning from string bug release', () => {
        const bugReleaseSemVerStr = '~2.4.1';
        const semVer = semVerFromString(bugReleaseSemVerStr);
        console.log(semVer);
        expect(semVer).toStrictEqual({
            major: 2,
            minor: 4,
            bug: 1,
            rest: "",
            skipMinor: false,
            skipBug: true,
        });
    });

    test('semantic versioning from string bug release with space', () => {
        const bugReleaseSemVerStr = '~ 2.4.1';
        const semVer = semVerFromString(bugReleaseSemVerStr);
        console.log(semVer);
        expect(semVer).toStrictEqual({
            major: 2,
            minor: 4,
            bug: 1,
            rest: "",
            skipMinor: false,
            skipBug: true,
        });
    });

    test('semantic versioning from string patch release with equality sign', () => {
        const equalitySemVerStr = '= 2.4.1';
        const semVer = semVerFromString(equalitySemVerStr);
        console.log(semVer);
        expect(semVer).toStrictEqual({
            major: 2,
            minor: 4,
            bug: 1,
            rest: "",
            skipMinor: false,
            skipBug: false,
        });
    });
});


/*
    *******************************************************
    unit tests for findRank function
    *******************************************************
*/
describe('tests for findRank function', function () {
    // Testing for Rank 0: 1 > Majors behind
    test('Testing for rank 0 (More than 1 major behind)', () => {
        const used = {
            major: 2,
            minor: 0,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        }
        const curr = {
            major: 3,
            minor: 0,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        }
        const rank = findRank(used, curr)
        expect(rank).toStrictEqual(0)
    });

    // Testing for rank 0: red  5 > minors behind
    test('Testing for rank 0: red  5 > minors behind', () => {
        const used = {
            major: 3,
            minor: 0,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        }
        const curr = {
            major: 3,
            minor: 15,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        }
        const rank = findRank(used, curr)
        expect(rank).toStrictEqual(0);
    });

    // // Testing for rank 1: yellow =  5 minors behind
    // test('Testing for rank 1: yellow = 5 minors behind', () => {
    //     const used = {
    //         major: 3,
    //         minor: 0,
    //         bug: 0,
    //         rest: "",
    //         skipMinor: false,
    //         skipBug: false,
    //     }
    //     const curr = {
    //         major: 3,
    //         minor: 5,
    //         bug: 0,
    //         rest: "",
    //         skipMinor: false,
    //         skipBug: false,
    //     }
    //     const rank = findRank(used, curr)
    //     expect(rank).toStrictEqual(1);
    // });

    // Testing for rank 1: yellow =  6 minors behind
    test('Testing for rank 1: yellow = 6 minors behind', () => {
        const used = {
            major: 3,
            minor: 0,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        }
        const curr = {
            major: 3,
            minor: 6,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        }
        const rank = findRank(used, curr)
        expect(rank).toStrictEqual(1);
    });

    // Testing for rank 2: green = <5 minors behind
    test('Testing for rank 2: green = <5 minors behind', () => {
        const used = {
            major: 3,
            minor: 0,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        }
        const curr = {
            major: 3,
            minor: 4,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        }
        const rank = findRank(used, curr)
        expect(rank).toStrictEqual(2);
    });

     // Testing for rank 2: green = up to date
     test('Testing for rank 2: green = up to date', () => {
        const used = {
            major: 3,
            minor: 15,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        }
        const curr = {
            major: 3,
            minor: 15,
            bug: 0,
            rest: "",
            skipMinor: false,
            skipBug: false,
        }
        const rank = findRank(used, curr)
        expect(rank).toBe(2);
    });


});
