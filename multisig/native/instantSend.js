const {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} =require( "@solana/web3.js");
const { serialize } =require( "borsh");
const { extendBorsh } =require( "../../utils/borsh");
const { PROGRAM_ID } =require( "../../constants");
const { InstantStream, InstantStreamSchema, Signer } =require( "./schema");

extendBorsh();

export const instantSend = async (
  data,
) => {
  const modData = {
    sender: new PublicKey(data.sender),
    recipient: new PublicKey(data.receiver),
    amount: parseFloat(data.amount),
    signed_by: [
      new Signer({ address: new PublicKey(data.sender), counter: 0 }),
    ],
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
      pubkey: new PublicKey(data.Vault_pda), //create safe garda feri ko pda
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
  ];
  const txInstruction = new TransactionInstruction({
    keys,
    data: txData,
    programId: new PublicKey(PROGRAM_ID),
  });

  const transaction = new Transaction().add(txInstruction);


const signerTransac = async ()=>{
  try {
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;

    transaction.feePayer = publicKey;
    transaction.partialSign(pda);
    const signedTransaction = await signTransaction(transaction);

    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
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
  message: "Amount Sent",
  data: {
    ...signer_response,
  },
};
  


};
