const {
  TransactionInstruction,
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
} = require("@solana/web3.js");
const BufferLayout = require("buffer-layout");
const spl = require("@solana/spl-token");
const { constants } = require("./constants");

const { base58publicKey, PROGRAM_ID, connection, stringofwithdraw } = constants;

// Init transaction native token
async function initNativeTransaction(data) {
  const senderaddress = new PublicKey(data.sender);
  let withdraw_data = await PublicKey.findProgramAddress(
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
    data: encodeInitNativeInstructionData(data),
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

function encodeInitNativeInstructionData(data) {
  const { amount, start, end } = data;
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.blob(8, "start_time"),
    BufferLayout.blob(8, "end_time"),
    BufferLayout.nu64("amount"),
  ]);

  const encoded = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 0,
      start_time: new spl.u64(start).toBuffer(),
      end_time: new spl.u64(end).toBuffer(),
      amount: Math.trunc(amount * LAMPORTS_PER_SOL),
    },
    encoded
  );

  return encoded;
}

//native token deposit
async function depositNativeToken(data) {
  const senderaddress = new PublicKey(data.sender);
  let validProgramAddress_pub = await PublicKey.findProgramAddress(
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
    data: encodeNativeInstructionData(data),
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

function encodeNativeInstructionData(data) {
  const { amount } = data;
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.nu64("amount"),
  ]);
  const encoded = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 7,
      amount: Math.trunc(amount * LAMPORTS_PER_SOL),
    },
    encoded
  );

  return encoded;
}

// withdraw native token deposit
async function withdrawNativeTokenDeposit(data) {
  const senderaddress = new PublicKey(data.sender);
  let validProgramAddress_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );
  const validProgramAddress = validProgramAddress_pub[0].toBase58();

  let withdraw_data = await PublicKey.findProgramAddress(
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
    data: encodeNativeWithdrawDepositInstructionData(data),
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

function encodeNativeWithdrawDepositInstructionData(data) {
  const { amount } = data;
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.nu64("amount"),
  ]);
  const encoded = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 14,
      amount: Math.trunc(amount * LAMPORTS_PER_SOL),
    },
    encoded
  );

  return encoded;
}

//withdraw transaction native token
async function withdrawNativeTransaction(data) {
  const senderaddress = new PublicKey(data.sender);
  let validProgramAddress_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );

  const validProgramAddress = validProgramAddress_pub[0].toBase58();

  let withdraw_data = await PublicKey.findProgramAddress(
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
    ],
    programId: new PublicKey(PROGRAM_ID),
    data: encodeWithdrawNativeInstructionData(data),
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

function encodeWithdrawNativeInstructionData(data) {
  const { amount } = data;
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.nu64("amount"),
  ]);

  const encoded = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 1,
      amount: Math.trunc(amount * LAMPORTS_PER_SOL),
    },
    encoded
  );
  return encoded;
}

//cancel native token transaction native token

async function cancelNativeTransaction(data) {
  const senderaddress = new PublicKey(data.sender);
  let validProgramAddress_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );
  let withdraw_data = await PublicKey.findProgramAddress(
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
    ],
    programId: new PublicKey(PROGRAM_ID),
    data: encodeCancelNativeInstructionData(data),
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

function encodeCancelNativeInstructionData(data) {
  const { amount, start, end } = data;
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.blob(8, "start_time"),
    BufferLayout.blob(8, "end_time"),
    BufferLayout.nu64("amount"),
  ]);

  const encoded = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 2,
      start: start,
      end: end,
      amount: Math.trunc(amount * LAMPORTS_PER_SOL),
    },
    encoded
  );
  return encoded;
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
    data: encodePauseNativeInstructionData(data),
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

function encodePauseNativeInstructionData(data) {
  const { amount } = data;
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.nu64("amount"),
  ]);

  const encoded = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 4,
      amount: Math.trunc(amount * LAMPORTS_PER_SOL),
    },
    encoded
  );
  return encoded;
}

// resume transaction native token
async function resumeNativeTransaction(data) {
  const senderaddress = new PublicKey(data.sender);
  const recepientaddress = new PublicKey(data.receiver);

  //sender and receiver address

  let sender_recipient_pub = await PublicKey.findProgramAddress(
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
    data: encodeResumeNativeInstructionData(data),
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

function encodeResumeNativeInstructionData(data) {
  const { amount } = data;
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.nu64("amount"),
  ]);

  const encoded = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 5,
      amount: Math.trunc(amount * LAMPORTS_PER_SOL),
    },
    encoded
  );
  return encoded;
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

