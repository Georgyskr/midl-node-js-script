# MIDL Node.js Example

A comprehensive Node.js application demonstrating MIDL blockchain integration with complete transaction flow including ERC20 token approvals, Runes deposits/withdrawals, and Bitcoin transaction finalization.

## What This Repository Does

This application showcases a complete MIDL blockchain transaction pipeline:

- **ERC20 Token Operations**: Approve and manage ERC20 tokens for collateral
- **Runes Protocol Integration**: Deposit and withdraw Bitcoin Runes through smart contracts
- **Cross-Chain Transactions**: Bridge between Bitcoin and EVM networks using MIDL's infrastructure
- **Transaction Management**: Create, sign, and finalize complex multi-step blockchain transactions
- **RunesRelayer Contract**: Interact with deployed smart contracts for Runes management

The app demonstrates real-world usage of MIDL's blockchain abstraction layer, making it easy to build applications that work across Bitcoin and EVM-compatible networks.

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your mnemonic phrase:
   ```
   MNEMONIC=your_actual_mnemonic_phrase_here
   ```

3. **Run the application:**
   ```bash
   pnpm dev
   ```

## Features

- 🔗 **MIDL Network Integration**: Connect to MIDL's regtest network
- 💰 **ERC20 Token Management**: Approve tokens for smart contract interactions  
- 🪙 **Runes Protocol Support**: Deposit and withdraw Bitcoin Runes
- ⚡ **Smart Contract Interaction**: Interface with RunesRelayer contracts
- 🔄 **Transaction Pipeline**: Complete approve → deposit → withdraw → finalize flow

## Architecture

```
src/
├── index.ts              # Main application with transaction flow
├── config/               # Configuration modules
│   ├── index.ts         # MIDL network configuration
│   ├── scenario.ts      # Transaction parameters
│   ├── viemPublicClient.ts   # Public client for reading
│   └── viemWalletClient.ts   # Wallet client for transactions
├── utils/
│   └── index.ts         # Utility functions for contracts
└── deployments/         # Contract deployment artifacts
```

## Usage

### Development Mode
```bash
pnpm dev
```

## Configuration

The application uses a modular configuration approach:

- **`src/config/scenario.ts`**: Transaction amounts, Rune IDs, and fee rates

## Environment Variables

- `MNEMONIC` - Your mnemonic phrase for wallet access (required)

## Available Scripts

- `pnpm dev` - Run in development mode with live TypeScript compilation
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm start` - Run the compiled application
- `pnpm test` - Run tests (to be implemented)

## How It Works

1. **Connection**: Establishes connection to MIDL regtest network
2. **Contract Reading**: Reads collateral ERC20 address from RunesRelayer contract
3. **Approval**: Creates ERC20 approve transaction for the deposit amount
4. **Deposit**: Creates Runes deposit intention with collateral backing
5. **Withdrawal**: Creates Runes withdrawal intention 
6. **Completion**: Finalizes all transactions and broadcasts to the network
7. **Confirmation**: Monitors transaction status and displays results

