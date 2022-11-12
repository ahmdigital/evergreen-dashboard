import getConfig from 'next/config'
const { publicRuntimeConfig: config } = getConfig()

/*
    *********************************************************
    unit tests for checking parameter settings in config file
    - note that this ensures the config parameters are in the
      correct format for use of the application.
    *********************************************************
*/
describe('tests for checking targetPercentage', function () {

    test('test target percentage is int type', () => {
        var targetType = typeof config.targetPercentage
        //console.log("targetPercentage Type: " + (targetType));
        expect(targetType.toString()).toBe("number");
    });

    test('test target percentage <= 100', () => {
        //console.log("targetPercentage: " + config.targetPercentage);
        expect(config.targetPercentage).toBeLessThanOrEqual(100);
    });

    test('test target percentage >= 0', () => {
        //console.log("targetPercentage: " + config.targetPercentage);
        expect(config.targetPercentage).toBeGreaterThanOrEqual(0);
    });

});

describe('tests for checking timeUntilRefresh', function () {

    test('test timeUntilRefresh is int type', () => {
        var timeType = typeof config.timeUntilRefresh
        //console.log("timeUntilRefresh Type: " + (timeType));
        expect(timeType.toString()).toBe("number");
    });

    test('test timeUntilRefresh >= 0', () => {
        //console.log("timeUntilRefresh: " + config.timeUntilRefresh);
        expect(config.timeUntilRefresh).toBeGreaterThanOrEqual(10);
    });

});

describe('tests for checking URL types', function () {

    test('test npmURL is string type', () => {
        var npmURLType = typeof config.npmURL
        //console.log("timeUntilRefresh Type: " + (npmURLType));
        expect(npmURLType.toString()).toBe("string");
    });

    test('test pipURL is string type', () => {
        var pipURLType = typeof config.pipURL
        //console.log("timeUntilRefresh Type: " + (pipURLType));
        expect(pipURLType.toString()).toBe("string");
    });

    test('test rubygemsURL is string type', () => {
        var rubygemsURLType = typeof config.rubygemsURL
        //console.log("timeUntilRefresh Type: " + (rubygemsURLType));
        expect(rubygemsURLType.toString()).toBe("string");
    });
});