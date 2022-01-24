import {
  WalletConnectionError,
  WalletDisconnectionError,
  WalletNotConnectedError,
  WalletPublicKeyError,
  WalletSignTransactionError,
  WalletTimeoutError,
  WalletWindowClosedError,
} from "@solana/wallet-adapter-base";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";
import { serialize } from "borsh";
import { extendBorsh } from "../../utils/borsh";
import {
  showSuccessToaster,
  showErrorToaster,
} from "../../store/actions/toasterAction";
import { FEEADDRESS, PROGRAM_ID } from "../../components/constants/ids";
import { InstantStream, InstantStreamSchema } from "./schema";
import {
  saveOutgoingStreamFromSafe,
  saveOutgoingStreamFromSafeError,
} from "../../store/actions/sendMoneyFromSafeAction";

extendBorsh();

export const instantSend = async (
  data,
  connection,
  publicKey,
  signTransaction,
  dispatch
) => {
  const pda = new Keypair();
  const modData = {
    sender: new PublicKey(data.sender),
    recipient: new PublicKey(data.receiver),
    amount: parseFloat(data.amount),
  };
  const txData = serialize(InstantStreamSchema, new InstantStream(modData));
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
      pubkey: new PublicKey(data.multisig_vault), //create safe garda feri ko pda
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(data.safe_pda), //create safe garda feri ko pda
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
    {
      pubkey: new PublicKey(FEEADDRESS),
      isSigner: false,
      isWritable: true,
    },
  ];
  const txInstruction = new TransactionInstruction({
    keys,
    data: txData,
    programId: new PublicKey(PROGRAM_ID),
  });

  const transaction = new Transaction().add(txInstruction);
  try {
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;

    transaction.feePayer = publicKey;
    transaction.partialSign(pda);
    const signedTransaction = await signTransaction(transaction);

    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );
    const backendData = {
      ...data,
      transaction_id: signature,
      pda: pda.publicKey.toBase58(),
    };
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
      dispatch(saveOutgoingStreamFromSafe(backendData, signature));
    }
  } catch (e) {
    if (
      e instanceof
      (WalletSignTransactionError ||
        WalletWindowClosedError ||
        WalletConnectionError ||
        WalletDisconnectionError ||
        WalletPublicKeyError ||
        WalletTimeoutError ||
        WalletNotConnectedError)
    ) {
      dispatch(showErrorToaster("Transaction Failed", e.message));
    } else {
      dispatch(showErrorToaster("Transaction Failed", e.message.split(":")[0]));
    }
    dispatch(saveOutgoingStreamFromSafeError());
  }
};
