import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { SwapSolSchema, SwapSol } from "./schema";
import { serialize } from "borsh";
import { PROGRAM_ID } from "../../components/constants/ids";
import { extendBorsh } from "../../utils/borsh";

extendBorsh();

export const withdrawSol = async (data) => {
  const senderaddress = new PublicKey(data.sender);
  const safePDA = global.pda; // Safe PDA
  const pda_data = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer(), new PublicKey(data.safe_pda).toBuffer()],
    base58publicKey
  );

  console.log(pda_data);

  const withdraw_data = await PublicKey.findProgramAddress(
    [Buffer.from(stringOfWithdraw), senderaddress.toBuffer()],
    base58publicKey
  );

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: senderaddress, //source (sender)
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(data.recipient), //destination (receiver)
        isSigner: true,
        isWritable: true,
      },
      // multi sig generated pda data //pda
      {
        pubkey: pda_data[0].toBase58(), // data stored in MultiSign right
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(data.stream_pda), // stored stream pda (PDA) right
        isSigner: false,
        isWritable: true,
      },

      {
        pubkey: new PublicKey(data.safe_pda), //(safe pda)
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: withdraw_data[0].toBase58(), //withdraw data right
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
    data: serialize(
      MultiSigWithdrawSchema,
      new MultiSigWithdraw({ amount: data.amount })
    ),
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
      dispatch(
        showSuccessToaster(
          "Transaction has been sent",
          "Confirmation is in progress.",
          signature
        )
      );
      const finality = "confirmed";
      const response = await connection.confirmTransaction(signature, finality);

      if (!response.value.err) {
        showSuccessToaster("Withdraw Success", "Your transaction is success");
      }
      return true;
    } catch (e) {
      console.warn(e);
      return {
        transactionhash: null,
      };
    }
  };
  return true;
};
