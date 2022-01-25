import { PublicKey } from "@solana/web3.js";
import { BinaryReader, BinaryWriter } from "borsh";


export const extendBorsh = () => {
  BinaryReader.prototype.readPubkey = function () {
    const reader = this;
    const array = reader.readFixedArray(32);
    return new PublicKey(array);
  };

  BinaryWriter.prototype.writePubkey = function (value) {
    const writer = this;
    // console.log(value.toString(), "Write Public Key");
    writer.writeFixedArray(value.toBuffer());
  };
};

extendBorsh();
