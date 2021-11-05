const {
  TransactionInstruction,
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  Connection,
  clusterApiUrl,
  Wallet,
} = require("@solana/web3.js");
const BufferLayout = require("buffer-layout");
const spl = require("@solana/spl-token");

const getProvider = async () => {
  const isPhantomInstalled = (await window.solana) && window.solana.isPhantom;
  if (isPhantomInstalled) {
    window.solana.connect();
  } else {
    window.open("https://phantom.app/", "_blank");
  }
};

//function to Init transaction

async function initTransaction(data) {
  const { sender, receiver } = data;
  let base58publicKey = new PublicKey(
    "9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp"
  );
  const senderaddress = new PublicKey(sender);  
  const recepientaddress = new PublicKey(data.receiver);
  let validProgramAddress_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );
  const validProgramAddress = validProgramAddress_pub[0].toBase58();

  //sender and receiver address

  let sender_recipient_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer(), recepientaddress.toBuffer()],
    base58publicKey
  );

  const senderPda = sender_recipient_pub[0].toBase58();

  const PROGRAM_ID = "9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp"; // Zebec program id
  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(sender),
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(receiver), //recipient
        isSigner: false,
        isWritable: true,
      },
      {
        // master pda to store fund
        pubkey: validProgramAddress,
        isSigner: false,
        isWritable: true,
      },
      // pda to store data //sender and recepient
      {
        pubkey: senderPda,
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
    data: encodeInstructionData(data),
  });
  const transaction = new Transaction().add(instruction);
  const connection = new Connection(clusterApiUrl("devnet"));
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
      return false;
    }
  };
  signerTransac();
}

function encodeInstructionData(data) {
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

// function to withdraw transaction

async function withdrawTransaction(data) {
  const { sender, receiver } = data;
  let base58publicKey = new PublicKey(
    "9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp"
  );
  const senderaddress = new PublicKey(sender);
  const recepientaddress = new PublicKey(data.receiver);
  let validProgramAddress_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );
  const validProgramAddress = validProgramAddress_pub[0].toBase58();

  //sender and receiver address

  let sender_recipient_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer(), recepientaddress.toBuffer()],
    base58publicKey
  );

  const senderPda = sender_recipient_pub[0].toBase58();
  const PROGRAM_ID = "9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp";
  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(sender),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(receiver), //recipient
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
        // data storage pda
        pubkey: senderPda,
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
    data: encodeWithdrawInstructionData(data),
  });
  const transaction = new Transaction().add(instruction);
  const connection = new Connection(clusterApiUrl("devnet"));
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
      return signature;
    } catch (e) {
      console.warn(e);
      return false;
    }
  };
  signerTransac();
}

function encodeWithdrawInstructionData(data) {
  console.log(data);
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

//function to cancel transaction

async function cancelTransaction(data) {
  const { sender, receiver } = data;
  let base58publicKey = new PublicKey(
    "9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp"
  );
  const senderaddress = new PublicKey(sender);
  const recepientaddress = new PublicKey(data.receiver);
  let validProgramAddress_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );
  const validProgramAddress = validProgramAddress_pub[0].toBase58();

  //sender and receiver address

  let sender_recipient_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer(), recepientaddress.toBuffer()],
    base58publicKey
  );

  const senderPda = sender_recipient_pub[0].toBase58();
  const PROGRAM_ID = "9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp";
  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(sender),
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(receiver), //recipient
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
        // data storage pda
        pubkey: senderPda,
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
    data: encodeCancelInstructionData(data),
  });
  const transaction = new Transaction().add(instruction);
  const connection = new Connection(clusterApiUrl("devnet"));
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
      return signature;
    } catch (e) {
      console.warn(e);
      return false;
    }
  };
  signerTransac();
}

function encodeCancelInstructionData(data) {
  console.log(data);
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

// function to pause transaction

async function pauseTransaction(data) {
  const { sender, receiver } = data;
  let base58publicKey = new PublicKey(
    "9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp"
  );
  const senderaddress = new PublicKey(data.sender);
  const recepientaddress = new PublicKey(data.receiver);

  //sender and receiver address

  let sender_recipient_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer(), recepientaddress.toBuffer()],
    base58publicKey
  );

  const senderPda = sender_recipient_pub[0].toBase58();
  const PROGRAM_ID = "9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp";
  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(sender),
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(receiver),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: senderPda,
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
    data: encodePauseInstructionData(data),
  });
  const transaction = new Transaction().add(instruction);
  const connection = new Connection(clusterApiUrl("devnet"));
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
      return signature;
    } catch (e) {
      console.warn(e);
      return false;
    }
  };
  signerTransac();
}

function encodePauseInstructionData(data) {
  console.log(data);
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

//function to resume transaction

async function resumeTransaction(data) {
  const { sender, receiver } = data;
  let base58publicKey = new PublicKey(
    "9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp"
  );
  const senderaddress = new PublicKey(data.sender);
  const recepientaddress = new PublicKey(data.receiver);

  //sender and receiver address

  let sender_recipient_pub = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer(), recepientaddress.toBuffer()],
    base58publicKey
  );
  const senderPda = sender_recipient_pub[0].toBase58();
  const PROGRAM_ID = "9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp";
  const instruction = new TransactionInstruction({
    keys:[
      {
        pubkey: new PublicKey(sender),
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(receiver),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: senderPda,
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
    data: encodeResumeInstructionData(data),
  });
  const transaction = new Transaction().add(instruction);
  const connection = new Connection(clusterApiUrl("devnet"));
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
      return signature;
    } catch (e) {
      console.warn(e);
      return false;
    }
  };
  signerTransac();
}

function encodeResumeInstructionData(data) {
  console.log(data);
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

module.exports.getProvider = getProvider;
module.exports.initTransaction = initTransaction;
module.exports.withdrawTransaction = withdrawTransaction;
module.exports.cancelTransaction = cancelTransaction;
module.exports.pauseTransaction = pauseTransaction;
module.exports.resumeTransaction = resumeTransaction;

