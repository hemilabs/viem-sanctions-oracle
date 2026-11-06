import { type Address, type Client, isAddress } from "viem";

import { sanctionsOracleAddresses } from "./constants.js";

export const resolveOracleAddress = function (
  client: Client,
  address: Address | undefined,
) {
  if (!client) {
    throw new Error("Client is not defined");
  }
  if (address !== undefined) {
    if (!isAddress(address)) {
      throw new Error("Invalid oracle address");
    }
    return address;
  }
  if (!client.chain) {
    throw new Error("Client is missing a chain");
  }

  const resolved = sanctionsOracleAddresses[client.chain.id];
  if (!resolved) {
    throw new Error(
      `No known sanctions oracle on chain ${client.chain.id}, pass one as address`,
    );
  }
  return resolved;
};
