const {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const { base58publicKey, PROGRAM_ID } = require("../../constants");
const { serialize } = require("borsh");
const { extendBorsh } = require("../../utils/borsh");
const { MultiSigSign, MultiSigSchema } = require("./schema");

extendBorsh();

async function signTransactionToken (
  data,
) {
  const txData = {
    signed_by: new Signer({ address: new PublicKey(data.sender), counter: 0 }),
  };
  const vault = new PublicKey(data.multisig_vault);
  const tokenmint = new PublicKey(data.token);
  const stringOfWithdraw = "withdraw_multisig_sol";
  const withdraw_data = await PublicKey.findProgramAddress(
    [Buffer.from(stringOfWithdraw), vault.toBuffer(), tokenmint.toBuffer()],
    base58publicKey
  );

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(data.sender),
        isSigner: true,
        isWritable: true,
      },
      {
        //  pda generated during stream
        pubkey: new PublicKey(data.transactionPda),
        isSigner: false,
        isWritable: true,
      },
      {
        // safe create garda ko PDA
        pubkey: new PublicKey(data.vault_pda),
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
    ],
    programId: new PublicKey(PROGRAM_ID),
    data: serialize(MultiSigSchema, new MultiSigSign(txData)),
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
  }
  const signer_response = await signerTransac();
  if (signer_response.transactionhash === null) {
    return {
      status: "error",
      message: "An error has occurred",
      data: null,
    };
  }
  return {
    data: { ...signer_response , transactionPda:pda.publicKey.toString() },
    status: "success",
    message: "Transaction signed",
  };

};

module.exports.signtransactiontoken={signTransactionToken}