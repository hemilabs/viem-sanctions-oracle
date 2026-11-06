import { type Address, type Chain } from "viem";
import { mainnet } from "viem/chains";

export const sanctionsOracleAddresses: Partial<Record<Chain["id"], Address>> = {
  [mainnet.id]: "0x574Ad490fE8087B580DB227a8Ca7EfB7C19Dc8C4",
};
