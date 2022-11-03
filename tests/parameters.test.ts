import getConfig from 'next/config'
const { publicRuntimeConfig: config } = getConfig()

/*
    *****************************************************
    unit tests for checking parameter settings
    *****************************************************
*/
describe('tests for checking targetPercentage', function () {

    test('test target percentage is int type', () => {
        var targetType = typeof config.targetPercentage
        console.log("targetPercentage Type: " + (targetType));
        expect(targetType.toString()).toBe("number");
    });

    test('test target percentage <= 100', () => {
        console.log("targetPercentage: " + config.targetPercentage);
        expect(config.targetPercentage).toBeLessThanOrEqual(100);
    });

    test('test target percentage >= 0', () => {
        console.log("targetPercentage: " + config.targetPercentage);
        expect(config.targetPercentage).toBeGreaterThanOrEqual(0);
    });

});

describe('tests for checking timeUntilRefresh', function () {

    test('test timeUntilRefresh is int type', () => {
        var timeType = typeof config.timeUntilRefresh
        console.log("timeUntilRefresh Type: " + (timeType));
        expect(timeType.toString()).toBe("number");
    });

    test('test timeUntilRefresh >= 0', () => {
        console.log("timeUntilRefresh: " + config.timeUntilRefresh);
        expect(config.timeUntilRefresh).toBeGreaterThanOrEqual(10);
    });

});