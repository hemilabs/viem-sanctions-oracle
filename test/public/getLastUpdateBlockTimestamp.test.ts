import { type PublicClient } from "viem";
import { readContract } from "viem/actions";
import { base, mainnet } from "viem/chains";
import { describe, expect, it, vi } from "vitest";

import { getLastUpdateBlockTimestamp } from "../../src/public/getLastUpdateBlockTimestamp";

vi.mock("viem/actions", () => ({
  readContract: vi.fn(),
}));

const oracle = "0x574Ad490fE8087B580DB227a8Ca7EfB7C19Dc8C4";

// @ts-expect-error - We only create a minimal client for testing purposes
const client: PublicClient = { chain: mainnet };

describe("getLastUpdateBlockTimestamp", function () {
  it("should throw an error if the client is not defined", async function () {
    // @ts-expect-error - Testing invalid input
    await expect(getLastUpdateBlockTimestamp(undefined)).rejects.toThrow(
      "Client is not defined",
    );
  });

  it("should throw an error if no oracle is known for the chain", async function () {
    // @ts-expect-error - We only create a minimal client for testing purposes
    const unsupported: PublicClient = { chain: base };

    await expect(getLastUpdateBlockTimestamp(unsupported)).rejects.toThrow(
      `No known sanctions oracle on chain ${base.id}`,
    );
  });

  it("should read the oracle known for the chain", async function () {
    await getLastUpdateBlockTimestamp(client);

    expect(readContract).toHaveBeenCalledWith(client, {
      abi: expect.anything(),
      address: oracle,
      functionName: "getLastUpdateBlockTimestamp",
    });
  });

  it("should return whatever the oracle reports", async function () {
    vi.mocked(readContract).mockResolvedValue(BigInt(1762128000));

    await expect(getLastUpdateBlockTimestamp(client)).resolves.toBe(
      BigInt(1762128000),
    );
  });

  it("should handle no parameters gracefully", async function () {
    await expect(getLastUpdateBlockTimestamp(client)).resolves.not.toThrow();
  });
});
