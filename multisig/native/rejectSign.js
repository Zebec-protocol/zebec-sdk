const {
  PublicKey,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const { RejectSchema, Reject } = require("./schema");
const { serialize } = require("borsh");
const { constants } = require("../../constants");
const { extendBorsh } = require("../../utils/borsh");
const { PROGRAM_ID } = constants;

extendBorsh();

async function rejectSigStreamMultisig(data) {
  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(data.sender),
        isSigner: true,
        isWritable: true,
      },
      {
        //  pda generated during stream
        pubkey: new PublicKey(data.pda),
        isSigner: false,
        isWritable: true,
      },
      {
        // safe create garda ko PDA
        pubkey: new PublicKey(data.safe_pda),
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: new PublicKey(PROGRAM_ID),
    data: serialize(RejectSchema, new Reject(data)),
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
    message: "Transaction Rejected",
    data: {
      ...signer_response,
    },
  };
}

module.exports.rejectmultisig = {
  rejectSigStreamMultisig,
};
