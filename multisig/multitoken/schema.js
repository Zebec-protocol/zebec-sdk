const { PublicKey } = require("@solana/web3.js");
const { STABLE_COIN_LAPMORTS } =require("../../components/constants/ids");

export class Signer {
  constructor(args) {
    this.address = args.address;
    this.counter = args.counter;
  }
}

export class WhiteList {
  constructor(args) {
    this.instruction = 16;
    this.signers = args.signers;
    this.m = args.m;
    this.multisig_safe = new PublicKey(
      "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9"
    );
  }
}

export const SetWhiteListSchema = new Map([
  [
    WhiteList,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["signers", [Signer]],
        ["m", "u8"],
        ["multisig_safe", "pubkey"],
      ],
    },
  ],
  [
    Signer,
    {
      kind: "struct",
      fields: [
        ["address", "pubkey"],
        ["counter", "u8"],
      ],
    },
  ],
]);

export class SolStream {
  constructor(args) {
    this.instruction = 26;
    this.start_time = args.start_time;
    this.end_time = args.end_time;
    this.paused = args.paused;
    this.withdraw_limit = args.withdraw_limit;
    this.amount = args.amount * STABLE_COIN_LAPMORTS;
    this.sender = args.sender;
    this.recipient = args.recipient;
    this.token_mint = new PublicKey(
      "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9"
    );
    this.signed_by = args.signed_by;
    this.multisig_safe = new PublicKey(
      "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9"
    );
  }
}

export const InitSolStreamSchema = new Map([
  [
    SolStream,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["start_time", "u64"],
        ["end_time", "u64"],
        ["paused", "u64"],
        ["withdraw_limit", "u64"],
        ["amount", "u64"],
        ["sender", "pubkey"],
        ["recipient", "pubkey"],
        ["token_mint", "pubkey"],
        ["signed_by", [Signer]],
        ["multisig_safe", "pubkey"],
      ],
    },
  ],
  [
    Signer,
    {
      kind: "struct",
      fields: [
        ["address", "pubkey"],
        ["counter", "u8"],
      ],
    },
  ],
]);

export class SwapSol {
  constructor(args) {
    this.instruction = 18;
    this.amount = args.amount * STABLE_COIN_LAPMORTS;
  }
}

export const SwapSolSchema = new Map([
  [
    SwapSol,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["amount", "u64"],
      ],
    },
  ],
]);

export class MultiSigSign {
  constructor(args) {
    this.instruction = 32;
    this.signed_by = args.signed_by;
  }
}

export const MultiSigSchema = new Map([
  [
    MultiSigSign,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["signed_by", Signer],
      ],
    },
  ],
  [
    Signer,
    {
      kind: "struct",
      fields: [
        ["address", "pubkey"],
        ["counter", "u8"],
      ],
    },
  ],
]);

export class Cancel {
  constructor() {
    this.instruction = 28;
  }
}

export const CancelSchema = new Map([
  [
    Cancel,
    {
      kind: "struct",
      fields: [["instruction", "u8"]],
    },
  ],
]);

export class Pause {
  constructor() {
    this.instruction = 29;
  }
}

export const PauseSchema = new Map([
  [
    Pause,
    {
      kind: "struct",
      fields: [["instruction", "u8"]],
    },
  ],
]);

export class Resume {
  constructor() {
    this.instruction = 30;
  }
}

export const ResumeSchema = new Map([
  [
    Resume,
    {
      kind: "struct",
      fields: [["instruction", "u8"]],
    },
  ],
]);

export class Reject {
  constructor() {
    this.instruction = 31;
  }
}

export const RejectSchema = new Map([
  [
    Reject,
    {
      kind: "struct",
      fields: [["instruction", "u8"]],
    },
  ],
]);

export class WithdrawStreamed {
  constructor(args) {
    this.instruction = 27;
    this.amount = args.amount * STABLE_COIN_LAPMORTS;
  }
}

export const WithdrawStreamedSchema = new Map([
  [
    WithdrawStreamed,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["amount", "u64"],
      ],
    },
  ],
]);
