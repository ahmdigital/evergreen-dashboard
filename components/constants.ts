import { semVerFromString } from "../src/semVer";
import getConfig from 'next/config'
const { publicRuntimeConfig: config } = getConfig();

export enum StatusType {
    RED,
    GREEN,
    YELLOW
}

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

export const statusDefinitionsDeps: {[key in StatusType]: string} = {
    [StatusType.RED]: `Current version is more than 1 major or ${upperLimit.minor} minor versions behind.`,
    [StatusType.YELLOW]: `Current version is ${lowerLimit.minor} - ${upperLimit.minor} minor versions behind.`,
    [StatusType.GREEN]: `Current version is up-to-date or less than ${lowerLimit.minor} minor versions behind.`,
}

export const statusDefinitionsRepos: {[key in StatusType]: string} = {
    [StatusType.RED]: `Repository has dependencies that are more than 1 major or ${upperLimit.minor} minor versions behind.`,
    [StatusType.YELLOW]: `Repository has dependencies that are ${lowerLimit.minor} - ${upperLimit.minor} minor versions behind.`,
    [StatusType.GREEN]: `Repository has dependencies that are up-to-date or less than ${lowerLimit.minor} minor versions behind.`,
}
export const statusDefinitionsReposSummary: {[key in StatusType]: string} = {
    [StatusType.RED]: `Repositories with dependencies that are more than 1 major or ${upperLimit.minor} minor versions behind.`,
    [StatusType.YELLOW]: `Repositories with dependencies that are ${lowerLimit.minor} - ${upperLimit.minor} minor versions behind.`,
    [StatusType.GREEN]: `Repositories with dependencies that are up-to-date or less than ${lowerLimit.minor} minor versions behind.`,
}
export const statusDefinitionsHelpGuide: {[key in StatusType]: string} = {
    [StatusType.RED]: statusDefinitionsRepos[StatusType.RED],
    [StatusType.YELLOW]: statusDefinitionsRepos[StatusType.YELLOW],
    [StatusType.GREEN]: statusDefinitionsRepos[StatusType.GREEN],
}
export const rankToStatusType: {[ rank: number]: StatusType; } = {
    0 : StatusType.RED,
    1 : StatusType.YELLOW,
    2 : StatusType.GREEN
}
