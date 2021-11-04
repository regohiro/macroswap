import * as anchor from "@project-serum/anchor";
import { Program, Provider } from "@project-serum/anchor";
import { NATIVE_MINT, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { airdrop } from "../tests/utils";
import { IDL } from "../target/types/macroswap";

const main = async () => {
  const rpcURL = process.env.RPC_URL || "";
  const provider = Provider.local(rpcURL, {
    preflightCommitment: 'max',
    skipPreflight: true
  });

  anchor.setProvider(provider);
  const { connection } = provider;

  const programId = process.env.PROGRAM_ID || "";
  const program = new Program(IDL, programId, provider);

  const secretKey = new Uint8Array(
    process.env.SECRET_KEY.split(",").map((i) => Number(i))
  );
  const mintAuthority = Keypair.fromSecretKey(secretKey);
  const payer = Keypair.fromSecretKey(secretKey);
  const macroswapAccount = Keypair.generate();

  await airdrop(provider, payer.publicKey, 2 * 10 ** 9);

  const macroMint = await Token.createMint(
    provider.connection,
    payer,
    mintAuthority.publicKey,
    null,
    9,
    TOKEN_PROGRAM_ID
  );

  const [poolMacroPda, poolMacroBump] = await PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode("pool_macro"))],
    program.programId
  );
  const [poolWsolPda, poolWsolBump] = await PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode("pool_wsol"))],
    program.programId
  );
  const [poolOwnerPda, poolOwnerBump] = await PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode("pool_owner"))],
    program.programId
  );

  const poolMacro = poolMacroPda;
  const poolWsol = poolWsolPda;
  const poolOwner = poolOwnerPda;
  const bumps = {
    poolMacro: poolMacroBump,
    poolWsol: poolWsolBump,
    poolOwner: poolOwnerBump,
  };

  const rate = 100;

  const tx = await program.rpc.initialize(bumps, new anchor.BN(rate), {
    accounts: {
      user: provider.wallet.publicKey,
      macroMint: macroMint.publicKey,
      poolMacro,
      wsolMint: NATIVE_MINT,
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

  const macroAmount = 1_000_000 * 10 ** 9;
  await macroMint.mintTo(
    poolMacro,
    mintAuthority.publicKey,
    [mintAuthority],
    macroAmount
  );

  console.log("pool_wsol: " + poolWsol.toString());
  console.log("pool_macro: " + poolMacro.toString());
  console.log("pool_owner: " + poolOwner.toString());
  console.log("macro_mint: " + macroMint.publicKey.toString());
  console.log("macroswap_account: " + macroswapAccount.publicKey.toString());
};

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
