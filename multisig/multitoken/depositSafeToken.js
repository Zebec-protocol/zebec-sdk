const {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const {
  ATOKEN,
  base58publicKey,
  FEEADDRESS,
  PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  SYSTEMRENT,
  TOKENPROGRAMID,
} = require("../../constants");
const { serialize } = require("borsh");
const { extendBorsh } = require("../../utils/borsh");
const { SwapSolSchema, SwapSol } = require("./schema");
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");

extendBorsh();

export const depositToken = async (
  data,
  connection,
  publicKey,
  signTransaction,
  dispatch
) => {
  const senderaddress = new PublicKey(data.sender);
  const stringOfWithdraw = "withdraw_token";
  const tokenmint = new PublicKey(data.token);
  const withdraw_data = await PublicKey.findProgramAddress(
    [
      Buffer.from(stringOfWithdraw),
      senderaddress.toBuffer(),
      tokenmint.toBuffer(),
    ],
    base58publicKey
  );

  const senderassociatedaddress = await findAssociatedTokenAddress(
    senderaddress,
    new PublicKey(data.token)
  );

  const masterpda = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );
  async function findAssociatedTokenAddress(walletAddress, tokenMintAddress) {
    return (
      await PublicKey.findProgramAddress(
        [
          walletAddress.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          tokenMintAddress.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      )
    )[0];
  }

  const multisignvault = new PublicKey(data.multisig_vault);
  const token = new PublicKey(data.token);
  const pda_associated_token_address = await findAssociatedTokenAddress(
    multisignvault,
    token
  );

  const masterpdaass = new PublicKey(masterpda[0], toString);
  const masterpda_associated_token_address = await findAssociatedTokenAddress(
    masterpdaass,
    token
  );

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(data.sender),
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(data.multisig_vault),
        isSigner: false,
        isWritable: true,
      },
      {
        // multisign vault pda //create sage banawuda ko pda
        pubkey: new PublicKey(data.multisig_pda),
        isSigner: false,
        isWritable: true,
      },
      {
        // token program id.
        pubkey: TOKENPROGRAMID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: data.token,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: senderassociatedaddress.toBase58(),
        isSigner: false,
        isWritable: true,
      },
      {
        // master pda
        pubkey: masterpda[0].toBase58(),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: withdraw_data[0].toBase58(),
        isSigner: false,
        isWritable: true,
      },
      {
        // pda associated token id
        pubkey: pda_associated_token_address.toBase58(),
        isSigner: false,
        isWritable: true,
      },
      {
        // master pda associated token id
        pubkey: masterpda_associated_token_address.toBase58(),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: SYSTEMRENT,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: ATOKEN,
        isSigner: false,
        isWritable: false,
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
      message: "An error has occurred",
      data: null,
    };
  }
  return {
    data: { ...signer_response },
    status: "success",
    message: "Deposited",
  };
};
