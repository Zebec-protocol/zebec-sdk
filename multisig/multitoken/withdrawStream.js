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

const { WithdrawStreamed, WithdrawStreamedSchema } = require("./schema");
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");

extendBorsh();
export async function withdrawStreamedBalanceToken(
  data,
  connection,
  signTransaction,
  publicKey,
  dispatch,
  backendData
) {
  const recipient = new PublicKey(data.receiver); // recepient address
  const stringOfWithdraw = "withdraw_multisig_sol";
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

  const tokenmint = new PublicKey(data.token);

  const receiver_associated_token_address = await findAssociatedTokenAddress(
    recipient,
    tokenmint
  );

  const pda_associated_token_address = await findAssociatedTokenAddress(
    multisignvault,
    tokenmint
  );

  const fee_associated_token_address = await findAssociatedTokenAddress(
    new PublicKey(FEEADDRESS),
    tokenmint
  );

  const withdraw_data = await PublicKey.findProgramAddress(
    [
      Buffer.from(stringOfWithdraw),
      multisignvault.toBuffer(),
      tokenmint.toBuffer(),
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
        pubkey: new PublicKey(data.safe_pda), //create safe garda feri ko pda
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(data.pda),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: withdraw_data[0].toBase58(),
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
        pubkey: SYSTEMRENT,
        isSigner: false,
        isWritable: false,
      },

      {
        // pda associated token id
        pubkey: pda_associated_token_address.toBase58(),
        isSigner: false,
        isWritable: true,
      },

      {
        // receiver associated token id //receiver
        pubkey: receiver_associated_token_address.toBase58(),
        isSigner: false,
        isWritable: true,
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
      {
        pubkey: new PublicKey(FEEADDRESS),
        isSigner: false,
        isWritable: true,
      },
      {
        // sam associated token id
        pubkey: fee_associated_token_address.toBase58(),
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
    message: "Withdrawn.",
  };
}
