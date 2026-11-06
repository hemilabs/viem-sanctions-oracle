import { type Address, type Client } from "viem";
import { readContract } from "viem/actions";

import { sanctionsOracleAbi } from "../abi.js";
import { resolveOracleAddress } from "../validation.js";

export const getLastUpdateBlockTimestamp = async function (
  client: Client,
  parameters: { address?: Address } = {},
) {
  const oracle = resolveOracleAddress(client, parameters.address);

  return readContract(client, {
    abi: sanctionsOracleAbi,
    address: oracle,
    functionName: "getLastUpdateBlockTimestamp",
  });
};
