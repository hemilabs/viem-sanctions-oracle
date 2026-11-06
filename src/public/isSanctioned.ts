import { type Address, type Client, isAddress } from "viem";
import { readContract } from "viem/actions";

import { sanctionsOracleAbi } from "../abi.js";
import { resolveOracleAddress } from "../validation.js";

export const isSanctioned = async function (
  client: Client,
  parameters: { account: Address; address?: Address },
) {
  const { account, address } = parameters ?? {};
  const oracle = resolveOracleAddress(client, address);

  if (!isAddress(account)) {
    throw new Error("Invalid account address");
  }

  return readContract(client, {
    abi: sanctionsOracleAbi,
    address: oracle,
    args: [account],
    functionName: "isSanctioned",
  });
};
