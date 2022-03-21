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
const ATOKEN = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
const stringofwithdraw = "withdraw_sol";
const FEEADDRESS = "EsDV3m3xUZ7g8QKa1kFdbZT18nNz8ddGJRcTK84WDQ7k";
const TOKENPROGRAMID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const SYSTEMRENT = "SysvarRent111111111111111111111111111111111";
module.exports.constants = {
  base58publicKey,
  PROGRAM_ID,
  CLUSTER,
  connection,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  stringofwithdraw,
  FEEADDRESS,
  ATOKEN,
  TOKENPROGRAMID,
  SYSTEMRENT,
};
