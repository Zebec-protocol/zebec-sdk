const  { PublicKey } = require("@solana/web3.js");
const { BinaryReader, BinaryWriter } = require("borsh");

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
