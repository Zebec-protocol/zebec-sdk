const { PublicKey, Connection, clusterApiUrl } = require("@solana/web3.js");

const base58publicKey = new PublicKey(
  "7FNWTfCo3AyRBFCvr49daqKHehdn2GjNgpjuTsqy5twk"
);
const PROGRAM_ID = "7FNWTfCo3AyRBFCvr49daqKHehdn2GjNgpjuTsqy5twk"; // Zebec program id
const CLUSTER = "devnet";
const connection = new Connection(clusterApiUrl(CLUSTER)); // cluster
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
const wallettokenaddress = new PublicKey(
  "2ibSirDWk5P68ZKmQQSxUMtiWQFRuanpPfMfaYzxgSRv"
);

let stringofwithdraw = "withdraw_sol";

module.exports.constants = {
  base58publicKey,
  PROGRAM_ID,
  CLUSTER,
  connection,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  wallettokenaddress,
  stringofwithdraw
};
