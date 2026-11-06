import { type PublicClient, zeroAddress } from "viem";
import { readContract } from "viem/actions";
import { base, mainnet } from "viem/chains";
import { describe, expect, it, vi } from "vitest";

import { isSanctioned } from "../../src/public/isSanctioned";

vi.mock("viem/actions", () => ({
  readContract: vi.fn(),
}));

const oracle = "0x574Ad490fE8087B580DB227a8Ca7EfB7C19Dc8C4";
const validParameters = { account: zeroAddress };

// @ts-expect-error - We only create a minimal client for testing purposes
const client: PublicClient = { chain: mainnet };

describe("isSanctioned", function () {
  it("should throw an error if the client is not defined", async function () {
    // @ts-expect-error - Testing invalid input
    await expect(isSanctioned(undefined, validParameters)).rejects.toThrow(
      "Client is not defined",
    );
  });

  it("should throw an error if the client has no chain", async function () {
    // @ts-expect-error - Testing invalid input
    await expect(isSanctioned({}, validParameters)).rejects.toThrow(
      "Client is missing a chain",
    );
  });

  it("should throw an error if the account address is not valid", async function () {
    const parameters = { account: "invalid_account" };
    // @ts-expect-error - Testing invalid input
    await expect(isSanctioned(client, parameters)).rejects.toThrow(
      "Invalid account address",
    );
  });

  it("should throw an error if the oracle address is not valid", async function () {
    const parameters = { ...validParameters, address: "invalid_oracle" };
    // @ts-expect-error - Testing invalid input
    await expect(isSanctioned(client, parameters)).rejects.toThrow(
      "Invalid oracle address",
    );
  });

  it("should throw an error if no oracle is known for the chain", async function () {
    // @ts-expect-error - We only create a minimal client for testing purposes
    const unsupported: PublicClient = { chain: base };

    await expect(isSanctioned(unsupported, validParameters)).rejects.toThrow(
      `No known sanctions oracle on chain ${base.id}`,
    );
    expect(readContract).not.toHaveBeenCalled();
  });

  it("should read the oracle known for the chain", async function () {
    await isSanctioned(client, validParameters);

    expect(readContract).toHaveBeenCalledWith(client, {
      abi: expect.anything(),
      address: oracle,
      args: [validParameters.account],
      functionName: "isSanctioned",
    });
  });

  it("should let the caller point at another oracle", async function () {
    // @ts-expect-error - We only create a minimal client for testing purposes
    const unsupported: PublicClient = { chain: base };

    await isSanctioned(unsupported, { ...validParameters, address: oracle });

    expect(readContract).toHaveBeenCalledWith(
      unsupported,
      expect.objectContaining({ address: oracle }),
    );
  });

  it("should return whatever the oracle reports", async function () {
    vi.mocked(readContract).mockResolvedValue(true);

    await expect(isSanctioned(client, validParameters)).resolves.toBe(true);
  });

  it("should handle empty parameters gracefully", async function () {
    // @ts-expect-error - Testing invalid input
    await expect(isSanctioned(client, {})).rejects.toThrow(
      "Invalid account address",
    );
  });

  it("should handle no parameters gracefully", async function () {
    // @ts-expect-error - Testing invalid input
    await expect(isSanctioned(client, undefined)).rejects.toThrow(
      "Invalid account address",
    );
  });
});
