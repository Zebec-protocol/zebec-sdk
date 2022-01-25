import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export class SolStream {
  constructor(args) {
    this.instruction = 0;
    this.start_time = args.start_time;
    this.end_time = args.end_time;
    this.amount = args.amount * LAMPORTS_PER_SOL;
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

export class DepositSol {
  constructor(args) {
    this.instruction = 7;
    this.amount = args.amount * LAMPORTS_PER_SOL;
  }
}

export const DepositSolSchema = new Map([
  [
    DepositSol,
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
    this.instruction = 2;
    this.start_time = args.start_time;
    this.end_time = args.end_time;
    this.amount = args.amount * LAMPORTS_PER_SOL;
  }
}

export const CancelSchema = new Map([
  [
    Cancel,
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

export class Pause {
  constructor(args) {
    this.instruction = 4;
    this.amount = args.amount * LAMPORTS_PER_SOL;
  }
}

export const PauseSchema = new Map([
  [
    Pause,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["amount", "u64"],
      ],
    },
  ],
]);

export class Resume {
  constructor(args) {
    this.instruction = 5;
    this.amount = args.amount * LAMPORTS_PER_SOL;
  }
}

export const ResumeSchema = new Map([
  [
    Resume,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["amount", "u64"],
      ],
    },
  ],
]);

export class WithdrawStreamed {
  constructor(args) {
    this.instruction = 1;
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

export class WithdrawMainWallet {
  constructor(args) {
    this.instruction = 14;
    this.amount = args.amount * LAMPORTS_PER_SOL;
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
