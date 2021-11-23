const {
    TransactionInstruction,
    Keypair,
    PublicKey,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction
  } = require("@solana/web3.js");
  const BufferLayout = require("buffer-layout");
  const spl = require("@solana/spl-token");
  const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
  const { constants } = require('./constants')
  
  const { base58publicKey, PROGRAM_ID, connection, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, wallettokenaddress} = constants;


// withdraw multi token deposit
async function withdrawMultiTokenDeposit(data) {
    const senderaddress = new PublicKey(data.sender);
  
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
      wallettokenaddress
    );
  
    const validProgramAddress = await PublicKey.findProgramAddress(
      [senderaddress.toBuffer()],
      base58publicKey
    );
  
    const pda_associated_token_address = await findAssociatedTokenAddress(
      validProgramAddress[0],
      wallettokenaddress
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
          pubkey: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          isSigner: false,
          isWritable: false,
        },
  
        {
          // This is the token program public key.
          pubkey: "2ibSirDWk5P68ZKmQQSxUMtiWQFRuanpPfMfaYzxgSRv",
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
      data: encodeMultiTokenwithdrawdepositInstructionData(data),
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
  
  function encodeMultiTokenwithdrawdepositInstructionData(data) {
    const { amount } = data;
    const layout = BufferLayout.struct([
      BufferLayout.u8("instruction"),
      BufferLayout.nu64("amount"),
    ]);
    const encoded = Buffer.alloc(layout.span);
    layout.encode(
      {
        instruction: 15,
        amount: Math.trunc(amount * LAMPORTS_PER_SOL),
      },
      encoded
    );
  
    return encoded;
  }
  
  //multiple token deposit
  async function depositMultiToken(data) {
    const senderaddress = new PublicKey(data.sender);
  
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
      wallettokenaddress
    );
  
    const validProgramAddress = await PublicKey.findProgramAddress(
      [senderaddress.toBuffer()],
      base58publicKey
    );
  
    const pda_associated_token_address = await findAssociatedTokenAddress(
      validProgramAddress[0],
      wallettokenaddress
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
          pubkey: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          isSigner: false,
          isWritable: false,
        },
        {
          // This is the token program public key.
          pubkey: "2ibSirDWk5P68ZKmQQSxUMtiWQFRuanpPfMfaYzxgSRv",
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: "SysvarRent111111111111111111111111111111111",
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
          // master associated token id
          pubkey: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
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
      data: encodeMultiTokenInstructionData(data),
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
      message: "Deposit Multi-Token Successful.",
    };
  }
  
  function encodeMultiTokenInstructionData(data) {
    const { amount } = data;
    const layout = BufferLayout.struct([
      BufferLayout.u8("instruction"),
      BufferLayout.nu64("amount"),
    ]);
    const encoded = Buffer.alloc(layout.span);
    layout.encode(
      {
        instruction: 11,
        amount: Math.trunc(amount * LAMPORTS_PER_SOL),
      },
      encoded
    );
  
    return encoded;
  }
  
  //init multi token
  async function MultiTokenStream(data) {
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
  
    // async function main(data) {
    //   const wallet= new PublicKey(data.sender);
    //   const wallet2 = new PublicKey(
    //     wallettokenaddress.toBase58()
    //   ); //token address
    // }
  
    async function pda_seed_token(data) {
      let address = new PublicKey(data.sender); // sender address
  
      let validProgramAddress_pub = await PublicKey.findProgramAddress(
        [address.toBuffer()],
        base58publicKey
      );
      const validProgramAddress = validProgramAddress_pub[0].toBase58();
  
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
            // master pda
            pubkey: validProgramAddress,
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
            // token program id.
            pubkey: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
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
            pubkey: "2ibSirDWk5P68ZKmQQSxUMtiWQFRuanpPfMfaYzxgSRv",
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: new PublicKey(PROGRAM_ID),
        data: encodeMultiTokenStreamInstruction(data),
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
            transactionhash: signature
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
    // main(data);
    return response;
  }
  
  function encodeMultiTokenStreamInstruction(data) {
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
        instruction: 3,
        start_time: new spl.u64(start).toBuffer(),
        end_time: new spl.u64(end).toBuffer(),
        amount: Math.trunc(amount * LAMPORTS_PER_SOL),
      },
      encoded
    );
  
    return encoded;
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
  
    // async function main(data) {
    //   const wallet= new PublicKey(data.sender);
    //   const wallet2 = new PublicKey(
    //     wallettokenaddress.toBase58()
    //   ); //token address
  
    // }
  
    async function pda_seed_token(data) {
      let address = new PublicKey(data.sender); // sender address
      let recipient = new PublicKey(data.receiver); // recepient address
  
      let validProgramAddress = await PublicKey.findProgramAddress(
        [address.toBuffer()],
        base58publicKey
      );
  
      const receiver_associated_token_address = await findAssociatedTokenAddress(
        recipient,
        wallettokenaddress
      );
  
      const pda_associated_token_address = await findAssociatedTokenAddress(
        validProgramAddress[0],
        wallettokenaddress
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
            // token program id.
            pubkey: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
            isSigner: false,
            isWritable: false,
          },
          {
            // This is the token program public key.
            pubkey: "2ibSirDWk5P68ZKmQQSxUMtiWQFRuanpPfMfaYzxgSRv",
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: "SysvarRent111111111111111111111111111111111",
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
            pubkey: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
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
        data: encodeMultiTokenWithdrawInstruction(data),
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
    return response
  }
  
  function encodeMultiTokenWithdrawInstruction(data) {
    const { amount } = data;
  
    const layout = BufferLayout.struct([
      BufferLayout.u8("instruction"),
      BufferLayout.nu64("amount"),
    ]);
  
    const encoded = Buffer.alloc(layout.span);
    layout.encode(
      {
        instruction: 6,
        amount: Math.trunc(amount * LAMPORTS_PER_SOL),
      },
      encoded
    );
  
    return encoded;
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
        data: encodeMultiTokenPauseInstruction(data),
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
  
  function encodeMultiTokenPauseInstruction(data) {
    const { amount } = data;
  
    const layout = BufferLayout.struct([
      BufferLayout.u8("instruction"),
      BufferLayout.nu64("amount"),
    ]);
  
    const encoded = Buffer.alloc(layout.span);
    layout.encode(
      {
        instruction: 9,
        amount: Math.trunc(amount * LAMPORTS_PER_SOL),
      },
      encoded
    );
  
    return encoded;
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
        data: encodeMultiTokenResumeInstruction(data),
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
  
  function encodeMultiTokenResumeInstruction(data) {
    const { amount } = data;
  
    const layout = BufferLayout.struct([
      BufferLayout.u8("instruction"),
      BufferLayout.nu64("amount"),
    ]);
  
    const encoded = Buffer.alloc(layout.span);
    layout.encode(
      {
        instruction: 10,
        amount: Math.trunc(amount * LAMPORTS_PER_SOL),
      },
      encoded
    );
  
    return encoded;
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
  
    // async function main(data) {
    //   const wallet= new PublicKey(data.sender);
    //   const wallet2 = new PublicKey(
    //     wallettokenaddress.toBase58()
    //   ); //token address
  
    // }
  
    async function pda_seed_token(data) {
      let address = new PublicKey(data.sender); // sender address
      let recipient = new PublicKey(data.receiver); // recepient address
  
      let validProgramAddress = await PublicKey.findProgramAddress(
        [address.toBuffer()],
        base58publicKey
      );
  
      const receiver_associated_token_address = await findAssociatedTokenAddress(
        recipient,
        wallettokenaddress
      );
  
      const pda_associated_token_address = await findAssociatedTokenAddress(
        validProgramAddress[0],
        wallettokenaddress
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
            // token program id.
            pubkey: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
            isSigner: false,
            isWritable: false,
          },
          {
            // This is the token program public key.
            pubkey: wallettokenaddress.toBase58(),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: "SysvarRent111111111111111111111111111111111",
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
            pubkey: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
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
        data: encodeMultiTokenCancelInstruction(data),
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
  
  function encodeMultiTokenCancelInstruction(data) {
    const { amount } = data;
  
    const layout = BufferLayout.struct([
      BufferLayout.u8("instruction"),
      BufferLayout.nu64("amount"),
    ]);
  
    const encoded = Buffer.alloc(layout.span);
    layout.encode(
      {
        instruction: 8,
        amount: Math.trunc(amount * LAMPORTS_PER_SOL),
      },
      encoded
    );
  
    return encoded;
  }

  module.exports.multiToken = {
    MultiTokenCancel,
    MultiTokenResume,
    MultiTokenPause,
    MultiTokenWithdraw,
    MultiTokenStream,
    depositMultiToken,
    withdrawMultiTokenDeposit
  }