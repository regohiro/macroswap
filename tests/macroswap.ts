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
import { airdrop, getBalance, mintWrapTransfer, wrap } from "./utils";
import { Macroswap } from "../target/types/macroswap";

describe("MacroSwap Test", () => {
  const provider = anchor.Provider.local();
  const { connection } = provider;
  anchor.setProvider(provider);

  //Program
  const program = anchor.workspace.Macroswap as Program<Macroswap>;

  //Mint accounts
  let macroMint: Token = null;
  let macroMintAccount: PublicKey = null;
  const wsolMintAccount: PublicKey = NATIVE_MINT;

  //Token accounts
  let poolMacro: PublicKey = null;
  let poolWsol: PublicKey = null;
  let poolOwner: PublicKey = null;

  //Admin accounts
  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();

  //User accounts
  const alice = Keypair.generate();

  //Other accounts / settings
  const macroswapAccount = Keypair.generate();
  let bumps: {
    poolMacro: number;
    poolWsol: number;
    poolOwner: number;
  } = null;

  const rate = 10;

  before(async () => {
    //Airdrop 10SOL (10^10 lamports) to payer
    await airdrop(provider, payer.publicKey, 10 ** 10);

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

    //Find PDA and its bump for macro token account (pool)
    const [poolMacroPda, poolMacroBump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("pool_macro"))],
      program.programId
    );
    //Find PDA and its bump for wsol token account (pool)
    const [poolWsolPda, poolWsolBump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("pool_wsol"))],
      program.programId
    );
    //Find PDA and its bump for token accounts authority
    const [poolOwnerPda, poolOwnerBump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("pool_owner"))],
      program.programId
    );

    poolMacro = poolMacroPda;
    poolWsol = poolWsolPda;
    poolOwner = poolOwnerPda;
    bumps = {
      poolMacro: poolMacroBump,
      poolWsol: poolWsolBump,
      poolOwner: poolOwnerBump,
    };
  });

  describe("Initialization", () => {
    it("Initializes MacroSwap program", async () => {
      const tx = await program.rpc.initialize(bumps, new BN(rate), {
        accounts: {
          user: provider.wallet.publicKey,
          macroMint: macroMintAccount,
          poolMacro,
          wsolMint: wsolMintAccount,
          poolWsol,
          macroswapAccount: macroswapAccount.publicKey,
          poolOwner,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [macroswapAccount],
      });

      await connection.confirmTransaction(tx, "confirmed");
    });

    it("Has the correct setttings", async () => {
      const _macroswapAccount = await program.account.macroSwapAccount.fetch(macroswapAccount.publicKey);
      expect(_macroswapAccount.rate.toNumber()).to.eq(10);
      expect(_macroswapAccount.poolOwner.toBase58()).to.eq(poolOwner.toBase58());
    });
  
    it("Funds the program", async () => {
      //Fund 1,000,000 macro tokens to program
      const macroAmount = 1_000_000 * 10 ** 9;
      await macroMint.mintTo(
        poolMacro,
        mintAuthority.publicKey,
        [mintAuthority],
        macroAmount
      );
  
      //Mint 1,000 SOL
      const wsolAmount = 1_000 * 10 ** 9;
      await mintWrapTransfer(provider, poolWsol, wsolAmount, payer);
  
      expect(await getBalance(provider, poolMacro)).to.eq(macroAmount);
      expect(await getBalance(provider, poolWsol)).to.eq(wsolAmount);
    });
  })

  describe("Basic tests", () => {
    const wsolAmount = 1000000000;
    const macroAmount = wsolAmount * rate;

    let aliceWsolAccount: PublicKey = null;
    let aliceMacroAccount: PublicKey = null;

    it("Alice buys tokens", async () => {
      await airdrop(provider, payer.publicKey, wsolAmount);
      aliceWsolAccount = await wrap(
        provider,
        alice.publicKey,
        wsolAmount,
        payer
      );
      aliceMacroAccount = await macroMint.createAccount(alice.publicKey);
  
      const tx = await program.rpc.buyToken(new BN(macroAmount), {
        accounts: {
          user: alice.publicKey,
          userWsol: aliceWsolAccount,
          userMacro: aliceMacroAccount,
          poolWsol,
          poolMacro,
          poolOwner,
          macroswapAccount: macroswapAccount.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [alice],
      });
      await connection.confirmTransaction(tx, "confirmed");
  
      expect(await getBalance(provider, aliceWsolAccount)).to.eq(0);
      expect(await getBalance(provider, aliceMacroAccount)).to.eq(macroAmount);
    });

    it("Alice sells tokens", async () => {
      const transferAmount = (new BN(macroAmount)).div(new BN(2));
      const tx = await program.rpc.sellToken(transferAmount, {
        accounts: {
          user: alice.publicKey,
          userWsol: aliceWsolAccount,
          userMacro: aliceMacroAccount,
          poolWsol,
          poolMacro,
          poolOwner,
          macroswapAccount: macroswapAccount.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [alice]
      })
      await connection.confirmTransaction(tx, "confirmed");

      expect(await getBalance(provider, aliceWsolAccount)).to.eq(wsolAmount/2);
      expect(await getBalance(provider, aliceMacroAccount)).to.eq(macroAmount/2);
    })

    it("Alice unwraps wsol", async () => {
      const wsol = new Token(connection, NATIVE_MINT, TOKEN_PROGRAM_ID, payer);
      await wsol.closeAccount(aliceWsolAccount, alice.publicKey, alice.publicKey, [alice]);
      const balance = await connection.getBalance(alice.publicKey);

      expect(balance).to.gte(wsolAmount/2);
    });
  });
});
