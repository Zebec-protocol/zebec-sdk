const {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const {
  InstantMultiSigSign,
  Signer,
  InstantMultiSigSchema,
} = require("./schema");
const { serialize } = require("borsh");
const { constants } = require("../../constants");
const { extendBorsh } = require("../../utils/borsh");
const { PROGRAM_ID , connection } = constants;

extendBorsh();

async function signInstantStreamNative(data) {
  const txData = {
    signed_by: new Signer({ address: new PublicKey(data.sender), counter: 0 }),
  };
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
        pubkey: new PublicKey(data.multisig_vault), //create safe garda feri ko pda
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(data.vault_pda), //create safe garda feri ko pda
        isSigner: false,
        isWritable: true,
      },
      {
        //  pda generated during stream
        pubkey: new PublicKey(data.transactionPda),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: SystemProgram.programId, //system program required to make a transfer
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: new PublicKey(PROGRAM_ID),
    data: serialize(InstantMultiSigSchema, new InstantMultiSigSign(txData)),
  });
  const transaction = new Transaction().add(instruction);
  const signerTransac = async () => {
    try {
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = window.solana.publicKey;
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
    message: "Transaction Signed",
    data: {
      ...signer_response,
    },
  };
}

module.exports.signinstant = {
  signInstantStreamNative,
};
