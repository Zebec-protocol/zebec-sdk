const { LAMPORTS_PER_SOL } = require("@solana/web3.js");

export class SolStream {
  constructor(args) {
    this.instruction = 3;
    this.start_time = args.start_time;
    this.end_time = args.end_time;
    this.amount = (args.amount * LAMPORTS_PER_SOL).toString();
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
        ["amount", "u64"],
      ],
    },
  ],
]);

export class DepositToken {
  constructor(args) {
    this.instruction = 11;
    this.amount = (args.amount * LAMPORTS_PER_SOL).toString();
  }
}

export const DepositTokenSchema = new Map([
  [
    DepositToken,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["amount", "u64"],
      ],
    },
  ],
]);

export class Cancel {
  constructor(args) {
    this.instruction = 8;
  }
}

export const CancelSchema = new Map([
  [
    Cancel,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
      ],
    },
  ],
]);

export class Pause {
  constructor(args) {
    this.instruction = 9;
  }
}

export const PauseSchema = new Map([
  [
    Pause,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
      ],
    },
  ],
]);

export class Resume {
  constructor(args) {
    this.instruction = 10;
  }
}

export const ResumeSchema = new Map([
  [
    Resume,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
      ],
    },
  ],
]);

export class WithdrawStreamed {
  constructor(args) {
    this.instruction = 6;
    this.amount = (args.amount * LAMPORTS_PER_SOL).toString();
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

export class WithdrawMainWallet {
  constructor(args) {
    this.instruction = 15;
    this.amount = (args.amount * LAMPORTS_PER_SOL).toString();
  }
}

export const WithdrawMainSchema = new Map([
  [
    WithdrawMainWallet,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["amount", "u64"],
      ],
    },
  ],
]);