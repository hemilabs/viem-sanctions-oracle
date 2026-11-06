import { createPublicClient, http, zeroAddress } from "viem";
import { mainnet } from "viem/chains";
import { describe, expect, it } from "vitest";

import { getLastUpdateBlockTimestamp } from "../../src/public/getLastUpdateBlockTimestamp";
import { isSanctioned } from "../../src/public/isSanctioned";

const client = createPublicClient({ chain: mainnet, transport: http() });

// Listed on the OFAC SDN list as a DPRK-linked address.
const sanctionedAccount = "0x098B716B8Aaf21512996dC57EB0615e2383E2f96";

// Sinaloa Cartel addresses the deprecated Chainalysis oracle never picked up,
// which is why this package reads RedStone instead.
const laterDesignations = [
  "0xaC4cC4B68ea24BbFAAC8fD127B67Ed445ACcCE22",
  "0x038989cbb1710c72b9920dc4fa529158f463e72c",
  "0x14779CEC0B117d5194c750C55Ea1f42086631964",
  "0x32dA24Ca413F3E7B53145D4737e172C3bdF81e3e",
  "0xf2235d55b2950a0b1317469d72d07ae65b2e27cb",
  "0x4F428c11Dc82388fa5136D636e613ad923Eb700B",
] as const;

const thirtyDays = BigInt(30 * 24 * 60 * 60);

describe("isSanctioned", function () {
  it("should report a sanctioned account", async function () {
    await expect(
      isSanctioned(client, { account: sanctionedAccount }),
    ).resolves.toBe(true);
  });

  it("should report a clean account", async function () {
    await expect(isSanctioned(client, { account: zeroAddress })).resolves.toBe(
      false,
    );
  });

  it.each(laterDesignations)(
    "should report %s, designated after the Chainalysis oracle froze",
    async function (account) {
      await expect(isSanctioned(client, { account })).resolves.toBe(true);
    },
  );
});

describe("getLastUpdateBlockTimestamp", function () {
  // A canary: if the oracle stops being updated the way Chainalysis did, this
  // fails instead of the gate silently passing everyone through.
  it("should have been updated recently", async function () {
    const updatedAt = await getLastUpdateBlockTimestamp(client);
    const age = BigInt(Math.floor(Date.now() / 1000)) - updatedAt;

    expect(age).toBeLessThan(thirtyDays);
  });
});
