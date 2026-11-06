# viem-sanctions-oracle

Viem extensions for on-chain sanctions oracles

[![NPM version](https://img.shields.io/npm/v/viem-sanctions-oracle)](https://www.npmjs.com/package/viem-sanctions-oracle) [![Package size](https://img.shields.io/bundlephobia/minzip/viem-sanctions-oracle)](https://bundlephobia.com/package/viem-sanctions-oracle) [![Follow Hemi on X](https://img.shields.io/twitter/url?url=https%3A%2F%2Fx.com%2Fhemi_xyz&style=flat&logo=x&label=%40hemi_xyz&labelColor=%23ff6c15&color=%230a0a0a)](https://x.com/intent/follow?screen_name=hemi_xyz)

## Installation

Install `viem` and `viem-sanctions-oracle` as dependencies:

```sh
npm install viem viem-sanctions-oracle
```

## Methods

This package reads the [RedStone Sanctions Oracle](https://redstone.finance/blog/redstone-sanctions-oracle-institutional-aml-compliance-tool), a smart contract that reports whether an address appears on sanctions lists such as the OFAC SDN list.

The oracle is a singleton per chain, so the contract address is resolved from the client's chain rather than passed in. Ethereum mainnet is the only deployment today, and the addresses are exported as `sanctionsOracleAddresses`. Every method takes an optional `address` to point at a different oracle, which is useful on a chain this package doesn't know about yet or if governance swaps the contract.

The older Chainalysis oracle at `0x40C57923924B5c5c5455c48D93317139ADDaC8fb` is [deprecated](https://go.chainalysis.com/chainalysis-oracle-docs.html) and stopped being updated on March 18, 2026, so it misses anything designated since. Its `isSanctioned` still answers if you point `address` at it, but the rest of this package's interface doesn't exist there.

Screening an address only tells you what the oracle reports. It is not a substitute for a compliance program, and it does not stop anyone from interacting with a contract directly.

### `getLastUpdateBlockTimestamp`

Returns the block timestamp of the oracle's last update, so you can decide how stale is too stale.

```ts
getLastUpdateBlockTimestamp(client, { address });
```

- **client**: `Client` — from viem, with a chain the oracle supports — (required)
- **address**: `Address` — oracle contract, defaults to the one known for the client's chain (optional)

**Example:**

```ts
import { getLastUpdateBlockTimestamp } from "viem-sanctions-oracle/actions";
const updatedAt = await getLastUpdateBlockTimestamp(client);
```

### `isSanctioned`

Returns whether an address is on the sanctions lists the oracle tracks.

```ts
isSanctioned(client, { account, address });
```

- **client**: `Client` — from viem, with a chain the oracle supports — (required)
- **account**: `Address` — the address to screen (required)
- **address**: `Address` — oracle contract, defaults to the one known for the client's chain (optional)

**Example:**

```ts
import { isSanctioned } from "viem-sanctions-oracle/actions";
const sanctioned = await isSanctioned(client, {
  account: "0x1234567891234567891234567891234567891234",
});
```
