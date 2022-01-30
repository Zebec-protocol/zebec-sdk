const {
  PublicKey,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const { constants } = require("../../constants");
const { serialize } = require("borsh");
const { extendBorsh } = require("../../utils/borsh");
const { Resume, ResumeSchema } = require("./schema");
const { PROGRAM_ID , connection } = constants;

extendBorsh();

async function resumeStreamMultisig(data) {
  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(data.sender),
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(data.receiver),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(data.transactionPda),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(data.vault_pda),
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: new PublicKey(PROGRAM_ID),
    data: serialize(ResumeSchema, new Resume(data)),
  });
  const transaction = new Transaction().add(instruction);

  const signerTransac = async () => {
    try {
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = widnow.solana.publicKey;
      const signed = await window.solana.signTransaction(transaction);
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
    message: "Stream Resumed",
    data: {
      ...signer_response,
    },
  };
}

module.exports.resumemultisig = {
  resumeStreamMultisig,
};
