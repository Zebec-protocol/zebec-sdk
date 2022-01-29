const { nativeToken } = require("./stream/nativetoken/nativeToken");
const { multiToken } = require("./stream/multitoken/multiToken");
const { createVault } = require("./multisig/native/createVault");
const { cancelStreamMultiSig } = require("./multisig/native/cancelStream");
const { depositNativeVault } = require("./multisig/native/depositVault");
const { instantSendNative } = require("./multisig/native/instantSend");
const { pauseStreamMultisig } = require("./multisig/native/pauseStream");
const {
  rejectInstantNative,
} = require("./multisig/native/rejectInstantStream");
const { rejectSigStreamMultisig } = require("./multisig/native/rejectSign");
const { resumeStreamMultisig } = require("./multisig/native/resumeStream");
const {
  signInstantStreamNative,
} = require("./multisig/native/signInstantStream");
const { signStream } = require("./multisig/native/signStream");
const { initStreamMultiSig } = require("./multisig/native/solStream");
const { withdrawStreamMultiSig } = require("./multisig/native/withdrawStream");

const {
  initNativeTransaction,
  depositNativeToken,
  withdrawNativeTokenDeposit,
  withdrawNativeTransaction,
  cancelNativeTransaction,
  pauseNativeTransaction,
  resumeNativeTransaction,
} = nativeToken;

const {
  MultiTokenCancel,
  MultiTokenResume,
  MultiTokenPause,
  MultiTokenWithdraw,
  MultiTokenStream,
  depositMultiToken,
  withdrawMultiTokenDeposit,
} = multiToken;

const { createVault } = createVault;
const { cancelStreamMultiSig } = cancelStreamMultiSig;
const { depositNativeVault } = depositNativeVault;
const { instantSendNative } = instantSendNative;
const { pauseStreamMultisig } = pauseStreamMultisig;
const { rejectInstantNative } = rejectInstantNative;
const { rejectSigStreamMultisig } = rejectSigStreamMultisig;
const { resumeStreamMultisig } = resumeStreamMultisig;
const { signInstantStreamNative } = signInstantStreamNative;
const { signStream } = signStream;
const { initStreamMultiSig } = initStreamMultiSig;
const { withdrawStreamMultiSig } = withdrawStreamMultiSig;

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

module.exports.createVault = createVault;
module.exports.cancelStreamMultiSig = cancelStreamMultiSig;
module.exports.depositNativeVault = depositNativeVault;
module.exports.instantSendNative = instantSendNative;
module.exports.pauseStreamMultisig = pauseStreamMultisig;
module.exports.rejectSigStreamMultisig = rejectSigStreamMultisig;
module.exports.resumeStreamMultisig = resumeStreamMultisig;
module.exports.signInstantStreamNative = signInstantStreamNative;
module.exports.signStream = signStream;
module.exports.initStreamMultiSig = initStreamMultiSig;
module.exports.withdrawStreamMultiSig = withdrawStreamMultiSig;
