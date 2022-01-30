const {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const { constants } = require("../../constants");
const { serialize } = require("borsh");
const { extendBorsh } = require("../../utils/borsh");
const { WithdrawStreamed, WithdrawStreamedSchema } = require("./schema");
const { base58publicKey, FEEADDRESS, PROGRAM_ID } = constants;

extendBorsh();
async function withdrawStreamMultiSig(data) {
  const stringOfWithdraw = "withdraw_multisig_sol";
  const withdraw_data = await PublicKey.findProgramAddress(
    [
      Buffer.from(stringOfWithdraw),
      new PublicKey(data.multisig_vault).toBuffer(),
    ],
    base58publicKey
  );

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(data.sender),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(data.receiver),
        isSigner: true,
        isWritable: true,
      },

      {
        pubkey: new PublicKey(data.multisig_vault), // vault pda
        isSigner: false,
        isWritable: true,
      },

      {
        pubkey: new PublicKey(data.transactionPda),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(data.vault_pda), //create safe garda feri ko pda
        isSigner: false,
        isWritable: true,
      },

      {
        pubkey: withdraw_data[0].toBase58(),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: SystemProgram.programId, //system program required to make a transfer
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: new PublicKey(FEEADDRESS),
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: new PublicKey(PROGRAM_ID),
    data: serialize(WithdrawStreamedSchema, new WithdrawStreamed(data)),
  });
  const transaction = new Transaction().add(instruction);

  const signerTransac = async () => {
    try {
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = publicKey;
      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      const finality = "confirmed";
      const response = await connection.confirmTransaction(signature, finality);
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
    message: "Withdrawn",
    data: {
      ...signer_response,
    },
  };
}

module.exports.withdrawmultisig = {
  withdrawStreamMultiSig,
};
