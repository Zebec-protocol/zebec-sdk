const { PublicKey, Connection, clusterApiUrl } = require("@solana/web3.js");

const base58publicKey = new PublicKey(
  "AknC341xog56SrnoK6j3mUvaD1Y7tYayx1sxUGpeYWdX"
);
const PROGRAM_ID = "AknC341xog56SrnoK6j3mUvaD1Y7tYayx1sxUGpeYWdX"; // Zebec program id
const CLUSTER = "devnet";
const connection = new Connection(clusterApiUrl(CLUSTER)); // cluster
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
const wallettokenaddress = new PublicKey(
  "2ibSirDWk5P68ZKmQQSxUMtiWQFRuanpPfMfaYzxgSRv"
);

const stringofwithdraw = "withdraw_sol";

module.exports.constants = {
  base58publicKey,
  PROGRAM_ID,
  CLUSTER,
  connection,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  wallettokenaddress,
  stringofwithdraw,
};
