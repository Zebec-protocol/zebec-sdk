const {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const { SwapSolSchema, SwapSol } = require("./schema");
const { serialize } = require("borsh");
const { base58publicKey, PROGRAM_ID } = require("../../constants");
const { extendBorsh } = require("../../utils/borsh");

extendBorsh();

  async function depositNativeVault  (data)  {
  const senderaddress = new PublicKey(data.sender);
  const pda = data.multisig_pda;
  const stringOfWithdraw = "withdraw_sol";
  const stringOfSafe = "multisig_safe";
  const withdraw_data = await PublicKey.findProgramAddress(
    [Buffer.from(stringOfWithdraw), senderaddress.toBuffer()],
    base58publicKey
  );
  const multisignvault = await PublicKey.findProgramAddress(
    [Buffer.from(stringOfSafe), new PublicKey(pda).toBuffer()], // create safe garda ko pda
    base58publicKey
  );
  const masterpda = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
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
        // master pda
        pubkey: masterpda[0].toBase58(),
        isSigner: false,
        isWritable: true,
      },
      {
        // multisign vault
        pubkey: multisignvault[0].toBase58(),
        isSigner: false,
        isWritable: true,
      },
      {
        // multisign vault pda
        pubkey: new PublicKey(pda),
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
    data: serialize(SwapSolSchema, new SwapSol(data)),
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
    message: "Deposited to Vault",
    data: {
      ...signer_response,
    },
  };
};

module.exports.depositmultisig = {
  depositNativeVault,
};
