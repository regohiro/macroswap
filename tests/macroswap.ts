import * as anchor from "@project-serum/anchor";
import { Program, BN } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID, NATIVE_MINT } from "@solana/spl-token";
import {
  SYSVAR_RENT_PUBKEY,
  PublicKey,
  Keypair,
  SystemProgram,
} from "@solana/web3.js";
import { expect } from "chai";

const { web3 } = anchor;

describe("MacroSwap Test", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.local();
  const { connection } = provider;
  anchor.setProvider(provider);

  //Program
  const program = anchor.workspace.Macroswap as Program;

  //Mint accounts
  let macroMint: Token = null;
  let macroMintAccount: PublicKey = null;
  const wsolMintAccount: PublicKey = NATIVE_MINT;

  //Token accounts
  let poolMacro: PublicKey = null;
  let poolWsol: PublicKey = null;

  //Admin accounts
  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();

  //User accounts
  const alice = Keypair.generate();
  const bob = Keypair.generate();
  const charlie = Keypair.generate();

  //Other accounts / settings
  const macroswapAccount = Keypair.generate();
  let bumps: {
    poolMacro: number,
    poolWsol: number
  } = null;

  const rate = 10;

  before(async () => {
    //Airdrop 10SOL (10^10 lamports) to payer
    const airdropTx = await connection.requestAirdrop(
      payer.publicKey,
      10000000000
    );
    await connection.confirmTransaction(airdropTx, "confirmed");

    //Create Macro token mint account
    macroMint = await Token.createMint(
      provider.connection,
      payer,
      mintAuthority.publicKey,
      null,
      9,
      TOKEN_PROGRAM_ID
    );
    macroMintAccount = macroMint.publicKey;

    //Set PDA for macro and wsol pools
    const [_poolMacroPda, _poolMacroBump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("pool_macro"))],
      program.programId
    );

    const [_poolWsolPda, _poolWsolBump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("pool_wsol"))],
      program.programId
    );
    poolMacro = _poolMacroPda;
    poolWsol = _poolWsolPda;
    bumps = {
      poolMacro: _poolMacroBump,
      poolWsol: _poolWsolBump
    }
  });

  it("Initializes MacroSwap program", async () => {

    // console.log(bumps);
    // console.log(new BN(rate));
    // console.log(provider.wallet.publicKey);
    // console.log(macroMintAccount);
    // console.log(poolMacro);
    // console.log(wsolMintAccount);
    // console.log(poolWsol);
    // console.log(macroswapAccount);
    // console.log(SystemProgram.programId);
    // console.log(TOKEN_PROGRAM_ID);
    // console.log(SYSVAR_RENT_PUBKEY);

    await program.rpc.initialize(
      bumps,
      new BN(rate),
      {
        accounts: {
          user: provider.wallet.publicKey,
          macroMint: macroMintAccount,
          poolMacro,
          wsolMint: wsolMintAccount,
          poolWsol,
          macroswapAccount: macroswapAccount.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY
        },
        signers: [macroswapAccount]
      }
    );
    // await connection.confirmTransaction(tx, "confirmed");
  });

  it("Funds the program", async () => {});
});
