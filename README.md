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
getProvider() // This will connect user's wallet to phantom
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
After sending this data to the SDK it will generate a new program-derived address (PDA) and all the funds will be locked in PDA and according to the timestamp, funds are streamlined from PDA. 

# Pause Stream

For Pausing streaming payment, the sender should send the sender address, and PDA (PDA should be the same which was received during initializing stream)

```javascript
  const pauseTransac = () =>{
    const data = {
      sender:'HWERzRzAUKpt1yCDBRUz1sxUGiGUkGpc9Y1CP7M1Dvpo',
      pda: '7Jgv17trtPYUL2nGx8Vg6YxPfGcGwdYMHrPwWD1xMVHV', //Same PDA address which was generated while initializing stream
    }
    pauseTransaction(data);
  }
```

# Resume Stream

For Resuming streaming payment, the sender should send the sender address, and PDA (PDA should be the same which was received during initializing stream)

```javascript
  const resumeTransac = () =>{
    const data = {
      sender:'HWERzRzAUKpt1yCDBRUz1sxUGiGUkGpc9Y1CP7M1Dvpo',
      pda: '7Jgv17trtPYUL2nGx8Vg6YxPfGcGwdYMHrPwWD1xMVHV', //Same PDA address which was generated while initializing stream
    }
    resumeTransaction(data);
  }
  ```
# Cancel Transaction
For cancelling streaming payment, the sender should send the sender and receiver address, amount, and PDA (PDA should be the same which was received during initializing stream)

```javascript
 const cancelTransac=()=>{
    const data = {
      sender:'HWERzRzAUKpt1yCDBRUz1sxUGiGUkGpc9Y1CP7M1Dvpo',
      receiver: 'J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9',
      amount: 1,
      pda: '7Jgv17trtPYUL2nGx8Vg6YxPfGcGwdYMHrPwWD1xMVHV', //Same PDA address which was generated while initializing stream
    }
    cancelTransaction(data);
  }
  ```
 # Withdraw Transaction

For withdrawing from streamed payment or streaming payment, the receiver should send the receiver address, amount, and PDA (PDA should be the same which was received during initializing stream)

```javascript
  const withdrawTransac=()=>{
    const data = {
      receiver: 'J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9',
      amount: 1,
      pda: '7Jgv17trtPYUL2nGx8Vg6YxPfGcGwdYMHrPwWD1xMVHV', //Same PDA address which was generated while initializing stream
    }
    withdrawTransaction(data);
  }
  ```

