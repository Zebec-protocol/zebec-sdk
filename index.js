const { nativeToken } = require("./stream/nativetoken/nativeToken");
const { multiToken } = require("./stream/multitoken/multiToken");
const { createvaultmultisig } = require("./multisig/native/createVault");
const { cancelstreamultisign } = require("./multisig/native/cancelStream");
const { depositmultisig } = require("./multisig/native/depositVault");
const { instantmultisig } = require("./multisig/native/instantSend");
const { pausemultisig } = require("./multisig/native/pauseStream");
const { rejectinstant } = require("./multisig/native/rejectInstantStream");
const { rejectmultisig } = require("./multisig/native/rejectSign");
const { resumemultisig } = require("./multisig/native/resumeStream");
const { signinstant } = require("./multisig/native/signInstantStream");
const { signmultisig } = require("./multisig/native/signStream");
const { initmultisig } = require("./multisig/native/solStream");
const { withdrawmultisig } = require("./multisig/native/withdrawStream");
const {constants} = require("./constants");

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

const { createVault } = createvaultmultisig;
const { cancelStreamMultiSig } = cancelstreamultisign;
const { depositNativeVault } = depositmultisig;
const { instantSendNative } = instantmultisig;
const { pauseStreamMultisig } = pausemultisig;
const { rejectInstantNative } = rejectinstant;
const { rejectSigStreamMultisig } = rejectmultisig;
const { resumeStreamMultisig } = resumemultisig;
const { signInstantStreamNative } = signinstant;
const { signStream } = signmultisig;
const { initStreamMultiSig } = initmultisig;
const { withdrawStreamMultiSig } = withdrawmultisig;



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
module.exports.rejectInstantNative = rejectInstantNative;
module.exports.pauseStreamMultisig = pauseStreamMultisig;
module.exports.rejectSigStreamMultisig = rejectSigStreamMultisig;
module.exports.resumeStreamMultisig = resumeStreamMultisig;
module.exports.signInstantStreamNative = signInstantStreamNative;
module.exports.signStream = signStream;
module.exports.initStreamMultiSig = initStreamMultiSig;
module.exports.withdrawStreamMultiSig = withdrawStreamMultiSig;
module.exports.constants = constants;
