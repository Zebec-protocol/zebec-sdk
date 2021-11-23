const {nativeToken} = require("./nativeToken");
const {multiToken} = require("./multiToken");

const {
  initNativeTransaction,
  depositNativeToken,
  withdrawNativeTokenDeposit,
  withdrawNativeTransaction,
  cancelNativeTransaction,
  pauseNativeTransaction,
  resumeNativeTransaction
} = nativeToken

const {
  MultiTokenCancel,
  MultiTokenResume,
  MultiTokenPause,
  MultiTokenWithdraw,
  MultiTokenStream,
  depositMultiToken,
  withdrawMultiTokenDeposit
} =multiToken

const getProvider = async () => {
  const isPhantomInstalled = (await window.solana) && window.solana.isPhantom;
  if (isPhantomInstalled) {
    window.solana.connect();
  } else {
    window.open("https://phantom.app/", "_blank");
  }
};


module.exports.getProvider = getProvider;

module.exports.depositNativeToken = depositNativeToken;
module.exports.initNativeTransaction = initNativeTransaction;
module.exports.withdrawNativeTransaction = withdrawNativeTransaction;
module.exports.cancelNativeTransaction = cancelNativeTransaction;
module.exports.pauseNativeTransaction = pauseNativeTransaction;
module.exports.resumeNativeTransaction = resumeNativeTransaction;

module.exports.depositMultiToken = depositMultiToken;
module.exports.MultiTokenStream = MultiTokenStream;
module.exports.MultiTokenWithdraw = MultiTokenWithdraw;
module.exports.MultiTokenPause = MultiTokenPause;
module.exports.MultiTokenResume = MultiTokenResume;
module.exports.MultiTokenCancel = MultiTokenCancel;

module.exports.withdrawNativeTokenDeposit = withdrawNativeTokenDeposit;
module.exports.withdrawMultiTokenDeposit = withdrawMultiTokenDeposit;
