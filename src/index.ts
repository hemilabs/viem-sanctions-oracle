import { type Client } from "viem";

import { getLastUpdateBlockTimestamp } from "./public/getLastUpdateBlockTimestamp.js";
import { isSanctioned } from "./public/isSanctioned.js";

export { sanctionsOracleAbi } from "./abi.js";
export { sanctionsOracleAddresses } from "./constants.js";

export const sanctionsPublicActions = () => (client: Client) => ({
  getLastUpdateBlockTimestamp: (
    parameters?: Parameters<typeof getLastUpdateBlockTimestamp>[1],
  ) => getLastUpdateBlockTimestamp(client, parameters),
  isSanctioned: (parameters: Parameters<typeof isSanctioned>[1]) =>
    isSanctioned(client, parameters),
});
