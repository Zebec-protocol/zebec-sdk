# What is Zebec Protocol?

The Zebec Protocol is a Solana based modern day Payroll solution which allows employers to pay employees every second. Our protocol allows employers to pay team members in crypto, by second, through its continuous settlement mechanism. 

The Zebec Protocol is not just limited to streamlined payments. On top of pay per second, we aim to enable real time liquidity through features such as automated dollar cost averaging, yield farming, crypto IRA,  401k accounts, free fiat off-ramp and custom visa debit card.

# Zebec Program

Devnet - 9Ayh2hS3k5fTn6V9Ks7NishUp5Jz19iosK3tYPAcNhsp
Mainnet - Coming Soon

# Install The Zebec Protocol js sdk 

`$ npm i zebecprotocol-sdk @solana/web3.js buffer-layout @solana/spl-token`

# Import JS SDK

```javascript
import { getProvider , initTransaction , withdrawTransaction ,cancelTransaction,pauseTransaction,resumeTransaction } from "zebecprotocol-sdk"
```

# Connect to Phantom Wallet.

```javascript
getProvider() // This will connect user's wallet to phantom //For more info visit https://docs.phantom.app/
```

# Initialize Stream

For initializing transactions, we need to send the sender address, receiver address, amount, start time and end time in epoch timestamp.
```javascript
const initTransac=()=>{
    const data = {
      sender: 'HWERzRzAUKpt1yCDBRUz1sxUGiGUkGpc9Y1CP7M1Dvpo',
      receiver: 'J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9',
      amount: 1,
      start: 1633111075,
      end: 1633906872,
    };

    sendTransaction(data);
  }
```

# Pause Stream

For Pausing streaming payment,send the sender address, and receiver's address.

```javascript
  const pauseTransac = () =>{
    const data = {
      sender: "HWERzRzAUKpt1yCDBRUz1sxUGiGUkGpc9Y1CP7M1Dvpo",
      receiver: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
    }
    pauseTransaction(data);
  }
```

# Resume Stream

For Resuming streaming payment, send the sender address, and receiver's address.

```javascript
  const resumeTransac = () =>{
    const data = {
      sender: "HWERzRzAUKpt1yCDBRUz1sxUGiGUkGpc9Y1CP7M1Dvpo",
      receiver: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
    }
    resumeTransaction(data);
  }
  ```
# Cancel Transaction
For cancelling streaming payment, send the sender and receiver address, amount.

```javascript
 const cancelTransac=()=>{
    const data = {
      sender: "HWERzRzAUKpt1yCDBRUz1sxUGiGUkGpc9Y1CP7M1Dvpo",
      receiver: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
      amount: 1,
    }
    cancelTransaction(data);
  }
  ```
 # Withdraw Transaction

For withdrawing from streamed payment or streaming payment, send the sender address , receiver address, and the amount.

```javascript
  const withdrawTransac=()=>{
    const data = {
      sender: "HWERzRzAUKpt1yCDBRUz1sxUGiGUkGpc9Y1CP7M1Dvpo",
      receiver: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9",
      amount: 1,
    }
    withdrawTransaction(data);
  }
  ```

