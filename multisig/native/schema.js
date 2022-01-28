const { LAMPORTS_PER_SOL, PublicKey } =require("@solana/web3.js");

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
    this.instruction = 20;
    this.start_time = args.start_time;
    this.end_time = args.end_time;
    this.paused = args.paused;
    this.withdraw_limit = args.withdraw_limit;
    this.amount = args.amount * LAMPORTS_PER_SOL;
    this.sender = args.sender;
    this.recipient = args.recipient;
    this.signed_by = args.signed_by;
    this.multisig_safe = new PublicKey(
      "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9"
    );
    this.can_cancel = true;
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
        ["signed_by", [Signer]],
        ["multisig_safe", "pubkey"],
        ["can_cancel", "u8"],
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
    this.instruction = 17;
    this.amount = args.amount * LAMPORTS_PER_SOL;
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
    this.instruction = 19;
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
    this.instruction = 22;
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
    this.instruction = 23;
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
    this.instruction = 24;
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
    this.instruction = 25;
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
    this.instruction = 21;
    this.amount = args.amount * LAMPORTS_PER_SOL;
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

export class InstantStream {
  constructor(args) {
    this.instruction = 33;
    this.amount = args.amount * LAMPORTS_PER_SOL;
    this.sender = args.sender;
    this.recipient = args.recipient;
    this.signed_by = args.signed_by;
    this.multisig_safe = new PublicKey(
      "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9"
    );
  }
}

export const InstantStreamSchema = new Map([
  [
    InstantStream,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["sender", "pubkey"],
        ["recipient", "pubkey"],
        ["signed_by", [Signer]],
        ["multisig_safe", "pubkey"],
        ["amount", "u64"],
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

export class InstantMultiSigSign {
  constructor(args) {
    this.instruction = 34;
    this.signed_by = args.signed_by;
  }
}

export const InstantMultiSigSchema = new Map([
  [
    InstantMultiSigSign,
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

export class RejectInstantStream {
  constructor() {
    this.instruction = 37;
  }
}

export const RejectInstantStreamSchema = new Map([
  [
    RejectInstantStream,
    {
      kind: "struct",
      fields: [["instruction", "u8"]],
    },
  ],
]);
