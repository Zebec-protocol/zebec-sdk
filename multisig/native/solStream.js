const {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  Keypair,
} = require("@solana/web3.js");
const { serialize } = require("borsh");
const { extendBorsh } = require("../../utils/borsh");
const { constants } = require("../../constants");
const { InitSolStreamSchema, Signer, SolStream } = require("./schema");
const { PROGRAM_ID, connection } = constants;

extendBorsh();

async function initStreamMultiSig(data) {
  const pda = new Keypair();

  const modData = {
    sender: new PublicKey(data.sender),
    recipient: new PublicKey(data.receiver),
    start_time: data.start_time,
    end_time: data.end_time,
    pause: 0,
    withdraw_limit: 0,
    amount: parseFloat(data.amount),
    signed_by: [
      new Signer({ address: new PublicKey(data.sender), counter: 0 }),
    ],
  };
  const value = new SolStream(modData);
  const txData = serialize(InitSolStreamSchema, value);
  const keys = [
    {
      pubkey: new PublicKey(data.sender),
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(data.receiver), //recipient
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(data.vault_pda), //create safe garda feri ko pda
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: pda.publicKey,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: SystemProgram.programId, //system program required to make a transfer
      isSigner: false,
      isWritable: false,
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

      transaction.feePayer = window.solana.publicKey;
      transaction.partialSign(pda);
      const signedTransaction = await window.solana.signTransaction(transaction);

      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
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
    message: "Transaction Initiated",
    data: {
      ...signer_response,
      pda:pda.publicKey.toString(),
    },
  };
}

module.exports.initmultisig = {
  initStreamMultiSig,
};
