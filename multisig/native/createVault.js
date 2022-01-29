const {
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const { SetWhiteListSchema, Signer, WhiteList } = require("./schema");
const { serialize } = require("borsh");
const { base58publicKey, PROGRAM_ID } = require("../../constants");
const { extendBorsh } = require("../../utils/borsh");

extendBorsh();

async function createVault(data) {
  const { sender, owners, min_confirmation_required } = data;
  const signers = [];
  const pda = new Keypair();
  const stringOfWithdraw = "withdraw_multisig_sol";
  const stringOfSafe = "multisig_safe";

  const multisignvault = await PublicKey.findProgramAddress(
    [Buffer.from(stringOfSafe), new PublicKey(pda.publicKey).toBuffer()], // create safe garda ko pda
    base58publicKey
  );

  const withdraw_data = await PublicKey.findProgramAddress(
    [Buffer.from(stringOfWithdraw), multisignvault[0].toBuffer()],
    base58publicKey
  );

  // Map owners
  owners.map((owner) =>
    signers.push(
      new Signer({ address: new PublicKey(owner.wallet_address), counter: 0 })
    )
  );

  const value = new WhiteList({ signers, m: min_confirmation_required });
  const txData = serialize(SetWhiteListSchema, value);

  const keys = [
    { pubkey: new PublicKey(sender), isSigner: true, isWritable: true },
    {
      pubkey: new PublicKey(pda.publicKey),
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: new PublicKey("11111111111111111111111111111111"),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: withdraw_data[0].toBase58(),
      isSigner: false,
      isWritable: true,
    },
  ];

  const txInstruction = new TransactionInstruction({
    keys,
    data: txData,
    programId: new PublicKey(PROGRAM_ID),
  });

  const transaction = new Transaction().add(txInstruction);
  const signerTransac = async () => {
    try {
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = publicKey;
      transaction.partialSign(pda);
      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      const finality = "confirmed";
      await connection.confirmTransaction(signature, finality);
      const explorerhash = {
        transactionhash: signature,
      };
      return explorerhash;
    } catch (e) {
      console.warn(e);
      return {
        transactionhash: null,
      };
    }
  };

  const signer_response = await signerTransac();
  if (signer_response.transactionhash === null) {
    return {
      status: "error",
      message: "An error has occurred.",
      data: null,
    };
  }
  return {
    status: "success",
    message: "Vault Created",
    data: {
      ...signer_response,
      Vault_pda: pda.publicKey.toBase58(),
      multisig_vault: multisignvault[0].toBase58(),
    },
  };
}

module.exports.createVault = {
  createVault,
};
