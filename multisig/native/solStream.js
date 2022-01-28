
const {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  Keypair,
} =require( "@solana/web3.js");
const { serialize } =require( "borsh");
const { extendBorsh } =require( "../../utils/borsh");

const { PROGRAM_ID } =require( "../../constants");
const { InitSolStreamSchema, Signer, SolStream } =require( "./schema");


extendBorsh();

export const startSolStream = async (
  data,
) => {
  const pda = new Keypair();

  const modData = {
    sender: new PublicKey(data.sender),
    recipient: new PublicKey(data.receiver),
    start_time: data.start,
    end_time: data.end,
    pause: 0,
    withdraw_limit: 0,
    amount: parseFloat(data.amount),
    signed_by: [
      new Signer({ address: new PublicKey(data.sender), counter: 0 }),
    ],
  };
  const value = new SolStream(modData);
  const txData = serialize(InitSolStreamSchema, value);
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
      pubkey: new PublicKey(data.vault_pda), //create safe garda feri ko pda
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: transactionPda.publicKey,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: SystemProgram.programId, //system program required to make a transfer
      isSigner: false,
      isWritable: false,
    },
  ];
  const txInstruction = new TransactionInstruction({
    keys,
    data: txData,
    programId: new PublicKey(PROGRAM_ID),
  });

  const transaction = new Transaction().add(txInstruction);


  const signerTransac = async()=>{

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
    const finality = "confirmed";
    await connection.confirmTransaction(signature, finality);
    const explorerhash = {
      transactionhash:signature,
    };
    return explorerhash;
  } catch (e) {
    console.warn(e);
    return{
      transactionhash:null,
    }
  }
}


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
  message: "Transaction Initiated",
  data: {
    ...signer_response,
  },
};


  

};
