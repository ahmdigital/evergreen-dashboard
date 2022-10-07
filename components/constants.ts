import { semVerFromString } from "../src/semVer";
import getConfig from 'next/config'
const { publicRuntimeConfig: config } = getConfig();

export enum StatusType {
    RED,
    GREEN,
    YELLOW

};

export const iconAltText: {[key in StatusType]: string} = {
    [StatusType.RED]: "Highly out-of-date red status",
    [StatusType.YELLOW]: "Moderately out-of-date orange status",
    [StatusType.GREEN]: "Up-to-date green status"
}

export const statusLabel: {[key in StatusType]: string} = {
    [StatusType.RED]: "Highly out-of-date",
    [StatusType.YELLOW]: "Moderately out-of-date",
    [StatusType.GREEN]: "Up-to-date",
}



const upperLimit = semVerFromString(config.rankCutoff.major);
const lowerLimit = semVerFromString(config.rankCutoff.minor);

export const statusDefinitions: {[key in StatusType]: string} = {
    [StatusType.RED]: `Current version is behind by more than 1 major or ${upperLimit.minor} minor versions.`,
    [StatusType.YELLOW]: `Current version is behind by ${lowerLimit.minor} or ${upperLimit.minor} minor versions.`,
    [StatusType.GREEN]: `Current version is behind by less than ${lowerLimit.minor} minor versions.`,
}

export const rankToStatusType: {[ rank: number]: StatusType; } = {
    0 : StatusType.RED,
    1 : StatusType.YELLOW,
    2 : StatusType.GREEN
};
