# What is Zebec Protocol?

The Zebec Protocol is a Solana based modern day Payroll solution which allows employers to pay employees every second. Our protocol allows employers to pay team members in crypto, by second, through its continuous settlement mechanism. 

The Zebec Protocol is not just limited to streamlined payments. On top of pay per second, we aim to enable real time liquidity through features such as automated dollar cost averaging, yield farming, crypto IRA,  401k accounts, free fiat off-ramp and custom visa debit card.

# Zebec Program

Devnet - 9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp
Mainnet - Coming Soon

# Next Zebec Update

Mainnet - Coming Soon
USDC , USDT


# Install The Zebec Protocol js sdk 

`$ npm i zebecprotocol-sdk @solana/web3.js buffer-layout @solana/spl-token`

# Import JS SDK

```javascript

import { getProvider,
  depositNativeToken,
  initNativeTransaction,
  withdrawNativeTransaction,
  cancelNativeTransaction,
  pauseNativeTransaction,
  resumeNativeTransaction,
  withdrawNativeTokenDeposit
   } from "zebecprotocol-sdk"

const spl = require("@solana/spl-token");

```

# Connect to Phantom Wallet.

```javascript
getProvider() // This will connect user's wallet to phantom //For more info visit https://docs.phantom.app/
```

# Deposit Native Token (SOL)

```javascript
 const data = {
      sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9", // sender defines owner wallet address from where token is deducted.
      amount: 1,
    };
    depositNativeToken(data);
```

# Deposit Native Token (SOL)

```javascript
 const data = {
      sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9", // sender defines owner wallet address from where token is deducted.
      amount: 1,
    };
    depositNativeToken(data);
```

# Withdraw Native Token (SOL) deposit.

```javascript
  const data = {
      sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
      amount: 1,
    };
    withdrawNativeTokenDeposit(data);
```


# Initialize Native Token (SOL) Stream

For initializing transactions, we need to send the sender address, receiver address, amount, start time and end time in epoch timestamp.
```javascript


    const sendTransac  =  async () => {
    const data = {
      sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
      receiver: "FuEm7UMaCYHThzKaf9DcJ7MdM4t4SALfeNnYQq46foVv",
      amount: 1,
      start: 1636824350,
      end: 1636824450,
    };
  const response = await initNativeTransaction(data); // returns pda (pda is needed for withdraw)
  console.log(response);
  };
  
  
```

# Pause Native Token (SOL) Stream

For Pausing streaming payment,send the sender address, and receiver's address.

```javascript
  const data = {
      sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
      receiver: "FuEm7UMaCYHThzKaf9DcJ7MdM4t4SALfeNnYQq46foVv",
      pda: "DYxGDVghXiDLz6p1QbUnqEMrkxR8fJEZrRLEfWhmY42T", 
    };
    pauseNativeTransaction(data);
```

# Resume Native Token (SOL) Stream

For Resuming streaming payment, send the sender address, and receiver's address.

```javascript
  const data = {
      sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
      receiver: "FuEm7UMaCYHThzKaf9DcJ7MdM4t4SALfeNnYQq46foVv",
      pda: "DYxGDVghXiDLz6p1QbUnqEMrkxR8fJEZrRLEfWhmY42T",
    };
    resumeNativeTransaction(data);
  ```
# Cancel Native Token (SOL) Stream
For cancelling streaming payment, send the sender and receiver address, amount.

```javascript
 const data = {
      sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
      receiver: "FuEm7UMaCYHThzKaf9DcJ7MdM4t4SALfeNnYQq46foVv",
      pda: "DYxGDVghXiDLz6p1QbUnqEMrkxR8fJEZrRLEfWhmY42T",
    };
    cancelNativeTransaction(data);
  ```
 # Withdraw Native Token (SOL) Transaction

For withdrawing from streamed payment or streaming payment, send the sender address , receiver address, and the amount.

```javascript
  const data = {
      sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
      receiver: "FuEm7UMaCYHThzKaf9DcJ7MdM4t4SALfeNnYQq46foVv",
      pda: "GsaSaHqcjA6cYPTk9BuwSfVo5ffC4mKrXGiUPxErrzQN",
      amount: 0.5,
    };
    withdrawNativeTransaction(data);
  ```

