const {
  TransactionInstruction,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} = require("@solana/web3.js");
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const {
  DepositToken,
  DepositTokenSchema,
  WithdrawMainSchema,
  WithdrawMainWallet,
  InitSolStreamSchema,
  SolStream,
  WithdrawStreamed,
  WithdrawStreamedSchema,
  Pause,
  PauseSchema,
  Resume,
  ResumeSchema,
  Cancel,
  CancelSchema,
} = require("./schema");
const { constants } = require("../../constants");
const { serialize } = require("borsh");
const {
  base58publicKey,
  PROGRAM_ID,
  connection,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKENPROGRAMID,
  ATOKEN,
  SYSTEMRENT,
  FEEADDRESS,
} = constants;

// withdraw multi token deposit
async function withdrawMultiTokenDeposit(data) {
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

  const senderaddress = new PublicKey(data.sender);

  const stringOfWithdraw = "withdraw_token";

  const tokenmint = new PublicKey(data.token);

  const sender_associated_token_address = await findAssociatedTokenAddress(
    senderaddress,
    tokenmint
  );

  const validProgramAddress = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );

  const pda_associated_token_address = await findAssociatedTokenAddress(
    validProgramAddress[0],
    tokenmint
  );

  const withdraw_data = await PublicKey.findProgramAddress(
    [
      Buffer.from(stringOfWithdraw),
      senderaddress.toBuffer(),
      tokenmint.toBuffer(),
    ],
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
        // token program id.
        pubkey: TOKENPROGRAMID,
        isSigner: false,
        isWritable: false,
      },

      {
        // This is the token program public key.
        pubkey: data.token,
        isSigner: false,
        isWritable: true,
      },

      {
        // sender associated token
        pubkey: sender_associated_token_address.toBase58(),
        isSigner: false,
        isWritable: true,
      },
      {
        // master pda
        pubkey: validProgramAddress[0].toBase58(),
        isSigner: false,
        isWritable: false,
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
        pubkey: SystemProgram.programId, //system program required to make a transfer
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: new PublicKey(PROGRAM_ID),
    data: serialize(WithdrawMainSchema, new WithdrawMainWallet(data)),
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
    message: "withdraw successful.",
  };
}

//multiple token deposit
async function depositMultiToken(data) {
  const senderaddress = new PublicKey(data.sender);
  const tokenmint = new PublicKey(data.token);
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

  const sender_associated_token_address = await findAssociatedTokenAddress(
    senderaddress,
    tokenmint
  );

  const validProgramAddress = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );

  const pda_associated_token_address = await findAssociatedTokenAddress(
    validProgramAddress[0],
    tokenmint
  );

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(data.sender),
        isSigner: true,
        isWritable: true,
      },
      {
        // pda
        pubkey: validProgramAddress[0].toBase58(),
        isSigner: false,
        isWritable: false,
      },
      {
        // token program id.
        pubkey: TOKENPROGRAMID,
        isSigner: false,
        isWritable: false,
      },
      {
        // This is the token program public key.
        pubkey: data.token,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: SYSTEMRENT,
        isSigner: false,
        isWritable: false,
      },
      {
        // sender associated token
        pubkey: sender_associated_token_address.toBase58(),
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
        pubkey: SystemProgram.programId, //system program required to make a transfer
        isSigner: false,
        isWritable: false,
      },
      {
        // master associated token id
        pubkey: ATOKEN,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: new PublicKey(PROGRAM_ID),
    data: serialize(DepositTokenSchema, new DepositToken(data)),
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
    message: "Deposit Token Successful.",
  };
}

//init multi token
async function MultiTokenStream(data) {
  async function pda_seed_token(data) {
    const senderaddress = new PublicKey(data.sender);
    const tokenmint = new PublicKey(data.token);
    const base58publicKey = new PublicKey(PROGRAM_ID); // program address
    const stringOfWithdraw = "withdraw_token";

    const withdraw_data = await PublicKey.findProgramAddress(
      [
        Buffer.from(stringOfWithdraw),
        senderaddress.toBuffer(),
        tokenmint.toBuffer(),
      ],
      base58publicKey
    );

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
          // pda data storage //pda for database
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
          // token program id.
          pubkey: TOKENPROGRAMID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: SystemProgram.programId, //system program required to make a transfer
          isSigner: false,
          isWritable: false,
        },
        // token id
        {
          pubkey: data.token,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: new PublicKey(PROGRAM_ID),
      data: serialize(InitSolStreamSchema, new SolStream(data)),
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
        const signature = await connection.sendRawTransaction(
          signed.serialize()
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
      data: { ...signer_response, pda: pda.publicKey.toBase58() },
      status: "success",
      message: "Stream started",
    };
  }

  const response = await pda_seed_token(data);

  return response;
}

// withdraw multi token
async function MultiTokenWithdraw(data) {
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

  async function pda_seed_token(data) {
    const senderaddress = new PublicKey(data.sender); // sender address
    const recipient = new PublicKey(data.receiver); // recepient address
    const base58publicKey = new PublicKey(PROGRAM_ID); // program address
    const stringOfWithdraw = "withdraw_token";
    const tokenmint = new PublicKey(data.token);
    const validProgramAddress = await PublicKey.findProgramAddress(
      [senderaddress.toBuffer()],
      base58publicKey
    );

    const receiver_associated_token_address = await findAssociatedTokenAddress(
      recipient,
      tokenmint
    );

    const pda_associated_token_address = await findAssociatedTokenAddress(
      validProgramAddress[0],
      tokenmint
    );

    const fee_associated_token_address = await findAssociatedTokenAddress(
      new PublicKey(FEEADDRESS),
      tokenmint
    );

    const withdraw_data = await PublicKey.findProgramAddress(
      [
        Buffer.from(stringOfWithdraw),
        senderaddress.toBuffer(),
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
          pubkey: new PublicKey(data.receiver), //recipient
          isSigner: true,
          isWritable: true,
        },
        {
          // master pda
          pubkey: validProgramAddress[0].toBase58(),
          isSigner: false,
          isWritable: true,
        },
        {
          //pda from database
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
          // token program id.
          pubkey: TOKENPROGRAMID,
          isSigner: false,
          isWritable: false,
        },
        {
          // This is the token program public key.
          pubkey: data.token,
          isSigner: false,
          isWritable: true,
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
          // receiver associated token id
          pubkey: receiver_associated_token_address.toBase58(),
          isSigner: false,
          isWritable: true,
        },

        {
          // spl associated token program
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
          // fee associated token id
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
        transaction.feePayer = window.solana.publicKey;
        const signed = await window.solana.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signed.serialize()
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
      data: { ...signer_response },
      status: "success",
      message: "Withdrawn",
    };
  }
  const response = await pda_seed_token(data);
  // main(data);
  return response;
}

// pause multi token
async function MultiTokenPause(data) {
  async function pda_seed_token(data) {
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
      data: serialize(PauseSchema, new Pause(data)),
    });
    const transaction = new Transaction().add(instruction);
    const signerTransac = async () => {
      try {
        transaction.recentBlockhash = (
          await connection.getRecentBlockhash()
        ).blockhash;
        transaction.feePayer = window.solana.publicKey;
        const signed = await window.solana.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signed.serialize()
        );

        const finality = "confirmed";
        await connection.confirmTransaction(signature, finality);
        const explorerhash = {
          transactionhash: signature,
        };

        return explorerhash;
      } catch (e) {
        console.warn(e);
        return { transactionhash: null };
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
  const response = await pda_seed_token(data);
  return response;
}

// resume multi token
async function MultiTokenResume(data) {
  async function pda_seed_token(data) {
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
      data: serialize(ResumeSchema, new Resume(data)),
    });
    const transaction = new Transaction().add(instruction);
    const signerTransac = async () => {
      try {
        transaction.recentBlockhash = (
          await connection.getRecentBlockhash()
        ).blockhash;
        transaction.feePayer = window.solana.publicKey;
        const signed = await window.solana.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signed.serialize()
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
        message: "An error has occurred",
        data: null,
      };
    }
    return {
      data: { ...signer_response },
      status: "success",
      message: "Stream Resumed",
    };
  }
  const response = await pda_seed_token(data);
  return response;
}

//cancel multi token

async function MultiTokenCancel(data) {
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

  async function pda_seed_token(data) {
    let address = new PublicKey(data.sender); // sender address
    let recipient = new PublicKey(data.receiver); // recepient address
    const tokenmint = new PublicKey(data.token);
    const stringOfWithdraw = "withdraw_token";
    const withdraw_data = await PublicKey.findProgramAddress(
      [Buffer.from(stringOfWithdraw), address.toBuffer(), tokenmint.toBuffer()],
      base58publicKey
    );
    let validProgramAddress = await PublicKey.findProgramAddress(
      [address.toBuffer()],
      base58publicKey
    );

    const receiver_associated_token_address = await findAssociatedTokenAddress(
      recipient,
      tokenmint
    );

    const pda_associated_token_address = await findAssociatedTokenAddress(
      validProgramAddress[0],
      tokenmint
    );

    const fee_associated_token_address = await findAssociatedTokenAddress(
      new PublicKey(FEEADDRESS),
      tokenmint
    );

    const instruction = new TransactionInstruction({
      keys: [
        {
          //sender
          pubkey: new PublicKey(data.sender),
          isSigner: true,
          isWritable: true,
        },
        {
          // receiver
          pubkey: new PublicKey(data.receiver),
          isSigner: false,
          isWritable: true,
        },
        {
          // master pda
          pubkey: validProgramAddress[0].toBase58(),
          isSigner: false,
          isWritable: false,
        },

        //  pda from database
        {
          pubkey: data.pda, // token account of pda
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
          // This is the token program public key.
          pubkey: data.token,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SYSTEMRENT,
          isSigner: false,
          isWritable: false,
        },
        {
          // receiver associated token id
          pubkey: receiver_associated_token_address,
          isSigner: false,
          isWritable: true,
        },
        {
          // pda associated token id
          pubkey: pda_associated_token_address,
          isSigner: false,
          isWritable: true,
        },
        {
          // associated token id
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
          // fee associated token id
          pubkey: fee_associated_token_address.toBase58(),
          isSigner: false,
          isWritable: true,
        },
      ],
      programId: new PublicKey(PROGRAM_ID),
      data: serialize(CancelSchema, new Cancel(data)),
    });
    const transaction = new Transaction().add(instruction);
    const signerTransac = async () => {
      try {
        transaction.recentBlockhash = (
          await connection.getRecentBlockhash()
        ).blockhash;
        transaction.feePayer = window.solana.publicKey;
        const signed = await window.solana.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signed.serialize()
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
      data: { ...signer_response },
      status: "success",
      message: "Stream canceled",
    };
  }
  const response = await pda_seed_token(data);
  return response;
  // main(data);
}

module.exports.multiToken = {
  MultiTokenCancel,
  MultiTokenResume,
  MultiTokenPause,
  MultiTokenWithdraw,
  MultiTokenStream,
  depositMultiToken,
  withdrawMultiTokenDeposit,
};
