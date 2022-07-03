const {
  TransactionInstruction,
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
} = require("@solana/web3.js");
const { constants } = require("../../constants");
const { extendBorsh } = require("../../utils/borsh");
const { base58publicKey, PROGRAM_ID, connection, stringofwithdraw , FEEADDRESS } = constants;
const {InitSolStreamSchema,SolStream,DepositSolSchema,DepositSol,WithdrawMainSchema,WithdrawMainWallet,WithdrawStreamedSchema,WithdrawStreamed,ResumeSchema,Resume,PauseSchema,Pause,CancelSchema,Cancel} = require("./schema");
const { serialize } = require("borsh");

extendBorsh();
// Init transaction native token
async function initNativeTransaction(data) {
  const senderaddress = new PublicKey(data.sender);
  const withdraw_data = await PublicKey.findProgramAddress(
    [Buffer.from(stringofwithdraw), senderaddress.toBuffer()],
    base58publicKey
  );
  // return
  const pda = new Keypair();

  const instruction = new TransactionInstruction({
    keys: [
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
        pubkey: pda.publicKey,
        isSigner: true,
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
    data: serialize(InitSolStreamSchema,new SolStream(data)),
  });
  const transaction = new Transaction().add(instruction);

  const signerTransac = async () => {
    try {
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = window.solana.publicKey;
      transaction.partialSign(pda);
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
    message: "Stream Started.",
    data: {
      ...signer_response,
      pda: pda.publicKey.toBase58(),
    },
  };
}



//native token deposit
async function depositNativeToken(data) {
  const senderaddress = new PublicKey(data.sender);
  const validProgramAddress_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );
  const validProgramAddress = validProgramAddress_pub[0].toBase58();

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(data.sender),
        isSigner: true,
        isWritable: true,
      },
      {
        // master pda to store fund
        pubkey: validProgramAddress,
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
    data: serialize(DepositSolSchema, new DepositSol(data)),
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
      return {
        transactionhash: signature,
      };
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
    message: "Deposit Successful.",
    data: {
      ...signer_response,
    },
  };
}



// withdraw native token deposit
async function withdrawNativeTokenDeposit(data) {
  const senderaddress = new PublicKey(data.sender);
  const validProgramAddress_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );
  const validProgramAddress = validProgramAddress_pub[0].toBase58();

  const withdraw_data = await PublicKey.findProgramAddress(
    [Buffer.from(stringofwithdraw), senderaddress.toBuffer()],
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
        // master pda to store fund
        pubkey: validProgramAddress,
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
    data: serialize(WithdrawMainSchema,new WithdrawMainWallet(data)),
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
    data: { ...signer_response },
    status: "success",
    message: "Withdraw Successful.",
  };
}



//withdraw transaction native token
async function withdrawNativeTransaction(data) {
  const senderaddress = new PublicKey(data.sender);
  const validProgramAddress_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );

  const validProgramAddress = validProgramAddress_pub[0].toBase58();

  const withdraw_data = await PublicKey.findProgramAddress(
    [Buffer.from(stringofwithdraw), senderaddress.toBuffer()],
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
        pubkey: new PublicKey(data.receiver), //recipient
        isSigner: true,
        isWritable: true,
      },
      {
        // master pda
        pubkey: validProgramAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        // pda from database
        pubkey: data.pda,
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
      {
        pubkey: new PublicKey(FEEADDRESS),
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: new PublicKey(PROGRAM_ID),
    data: serialize(WithdrawStreamedSchema,new WithdrawStreamed(data)),
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
      return { transactionhash: signature };
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
    data: { ...signer_response },
    status: "success",
    message: "Withdraw Successful.",
  };
}



//cancel native token transaction native token

async function cancelNativeTransaction(data) {
  const senderaddress = new PublicKey(data.sender);
  const validProgramAddress_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );
  const withdraw_data = await PublicKey.findProgramAddress(
    [Buffer.from(stringofwithdraw), senderaddress.toBuffer()],
    base58publicKey
  );
  const validProgramAddress = validProgramAddress_pub[0].toBase58();
  

  const instruction = new TransactionInstruction({
    keys: [
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
        // master pda
        pubkey: validProgramAddress,
        isSigner: false,
        isWritable: true,
      },

      {
        // data storage pda from database
        pubkey: data.pda,
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
      {
        pubkey: new PublicKey(FEEADDRESS),
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: new PublicKey(PROGRAM_ID),
    data: serialize(CancelSchema,new Cancel(data)),
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
      return {
        transactionhash: signature,
      };
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
    data: { ...signer_response },
    status: "success",
    message: "Stream Canceled",
  };
}



// pause transaction native token
async function pauseNativeTransaction(data) {
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
      // pda from database testnet
      {
        pubkey: data.pda,
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
    data: serialize(PauseSchema , new Pause(data)),
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
      return {
        transactionhash: signature,
      };
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
    data: { ...signer_response },
    status: "success",
    message: "Stream Paused",
  };
}



// resume transaction native token
async function resumeNativeTransaction(data) {
  const senderaddress = new PublicKey(data.sender);
  const recepientaddress = new PublicKey(data.receiver);

  //sender and receiver address

  const sender_recipient_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer(), recepientaddress.toBuffer()],
    base58publicKey
  );
  const senderPda = sender_recipient_pub[0].toBase58();
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
        pubkey: data.pda,
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
    data: serialize(ResumeSchema , new Resume(data)),
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
      return { transactionhash: signature };
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
    data: { ...signer_response },
    status: "success",
    message: "Stream Resumed",
  };
}



module.exports.nativeToken = {
  initNativeTransaction,
  depositNativeToken,
  withdrawNativeTokenDeposit,
  withdrawNativeTransaction,
  cancelNativeTransaction,
  pauseNativeTransaction,
  resumeNativeTransaction,
};

