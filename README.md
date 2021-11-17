# What is Zebec Protocol?

The Zebec Protocol is a Solana based modern day Payroll solution which allows employers to pay employees every second. Our protocol allows employers to pay team members in crypto, by second, through its continuous settlement mechanism.

The Zebec Protocol is not just limited to streamlined payments. On top of pay per second, we aim to enable real time liquidity through features such as automated dollar cost averaging, yield farming, crypto IRA, 401k accounts, free fiat off-ramp and custom debit card.

# Zebec Program

Devnet - 9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp
Mainnet - Coming Soon

# Next Zebec Update

Mainnet , USDC , USDT

# Install The Zebec Protocol js sdk

`$ npm i zebecprotocol-sdk @solana/web3.js buffer-layout @solana/spl-token`

# Import JS SDK

```javascript
import {
  getProvider,
  depositNativeToken,
  initNativeTransaction,
  withdrawNativeTransaction,
  cancelNativeTransaction,
  pauseNativeTransaction,
  resumeNativeTransaction,
  withdrawNativeTokenDeposit,
} from "zebecprotocol-sdk";
```

# Connect to Phantom Wallet.

```javascript
getProvider(); // This will connect user's wallet to phantom //For more info visit https://docs.phantom.app/
```

# Deposit Native Token (SOL)

```javascript
const depositTransac = async () => {
  const data = {
    sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9", // wallet public key
    amount: 1,
  };

  const response = await depositNativeToken(data);
};
```

# Withdraw Native Token (SOL) deposit.

```javascript
const nativeWithdraw = async () => {
  const data = {
    sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9", //wallet public key
    amount: 1,
  };
  const response = await withdrawNativeTokenDeposit(data);
};
```

# Initialize Native Token (SOL) Stream

For initializing transactions, we need to send the sender address, receiver address, amount, start time and end time in epoch timestamp.

```javascript
const sendTransac = async () => {
  const data = {
    sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
    receiver: "FuEm7UMaCYHThzKaf9DcJ7MdM4t4SALfeNnYQq46foVv",
    amount: 1,
    start: 1637182627, // epoch time stamp (unix)
    end: 1637192627,
  };
  const response = await initNativeTransaction(data); // pda should be saved.
};
```

# Pause Native Token (SOL) Stream

For Pausing streaming payment,send the sender address, and receiver's address.

```javascript
const pauseTransac = async () => {
  const data = {
    sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
    receiver: "FuEm7UMaCYHThzKaf9DcJ7MdM4t4SALfeNnYQq46foVv",
    pda: "3AicfRtVVXzkjU5L3yarWt2oMWSS32jfkPeeK5Hh9Hyz", // use saved pda returned from initNativeTransaction()
  };
  const response = await pauseNativeTransaction(data);
};
```

# Resume Native Token (SOL) Stream

For Resuming streaming payment, send the sender address, and receiver's address.

```javascript
const resumeTransac = async () => {
  const data = {
    sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
    receiver: "FuEm7UMaCYHThzKaf9DcJ7MdM4t4SALfeNnYQq46foVv",
    pda: "3AicfRtVVXzkjU5L3yarWt2oMWSS32jfkPeeK5Hh9Hyz",
  };
  const response = await resumeNativeTransaction(data);
};
```

# Cancel Native Token (SOL) Stream

For cancelling streaming payment, send the sender and receiver address, amount.

```javascript
const cancelTransac = async () => {
  const data = {
    sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
    receiver: "FuEm7UMaCYHThzKaf9DcJ7MdM4t4SALfeNnYQq46foVv",
    pda: "3AicfRtVVXzkjU5L3yarWt2oMWSS32jfkPeeK5Hh9Hyz",
  };

  const response = await cancelNativeTransaction(data);
};
```

# Withdraw Native Token (SOL) Transaction

For withdrawing from streamed payment or streaming payment, send the sender address , receiver address, and the amount.

```javascript
const withTransac = async () => {
  const data = {
    sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
    receiver: "FuEm7UMaCYHThzKaf9DcJ7MdM4t4SALfeNnYQq46foVv",
    pda: "3AicfRtVVXzkjU5L3yarWt2oMWSS32jfkPeeK5Hh9Hyz",
    amount: 0.5,
  };
  const response = await withdrawNativeTransaction(data);
};
```
