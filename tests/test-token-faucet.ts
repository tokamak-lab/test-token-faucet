import { MPL_TOKEN_METADATA_PROGRAM_ID as PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import * as anchor from "@coral-xyz/anchor";
import { TestTokenFaucet } from "../target/types/test_token_faucet";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

describe("test-token-faucet", () => {
  // Initialize anchor testing environment
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.TestTokenFaucet as anchor.Program<TestTokenFaucet>;
  const payer = provider.wallet as anchor.Wallet;

  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(PROGRAM_ID);

  const [mintPDA_usdc, mintBump_usdc] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint"), Buffer.from("usdc")],
    program.programId
  );

  const [mintPDA_goldsol, mintBump_goldsol] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint"), Buffer.from("goldsol")],
    program.programId
  );

  const metadata = {
    name: "Solana Gold",
    symbol: "GOLDSOL",
    uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
  };

  const usdc_metadata = {
    "name": "USD Coin",
    "symbol": "USDC",
    "uri": "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json"
  }
  it("Create USDC test token!", async () => {
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintPDA_usdc.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const transactionSignature = await program.methods
    .createToken("usdc", usdc_metadata.name, usdc_metadata.symbol, usdc_metadata.uri, mintBump_usdc)
    .accounts({
      payer: payer.publicKey,
      mintAccount: mintPDA_usdc,
      metadataAccount: metadataAddress,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();

  // console.log("Success!");
  // console.log(`   Mint Address: ${mintPDA}`);
  // console.log(`   Transaction Signature: ${transactionSignature}`);
  });

  it("Create GOLDSOL token!", async () => {
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintPDA_goldsol.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const transactionSignature = await program.methods
    .createToken("goldsol", metadata.name, metadata.symbol, metadata.uri, mintBump_goldsol)
    .accounts({
      payer: payer.publicKey,
      mintAccount: mintPDA_goldsol,
      metadataAccount: metadataAddress,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();

  // console.log("Success!");
  // console.log(`   Mint Address: ${mintPDA}`);
  // console.log(`   Transaction Signature: ${transactionSignature}`);
  });

  it("Mint 100 USDC and GOLDSOL!", async () => {
    // Derive the associated token address account for the mint and payer.
    const associatedTokenAccountAddress_goldsol = getAssociatedTokenAddressSync(
      mintPDA_goldsol,
      payer.publicKey
    );

    const associatedTokenAccountAddress_usdc = getAssociatedTokenAddressSync(
      mintPDA_usdc,
      payer.publicKey
    );

    // Amount of tokens to mint.
    const amount = new anchor.BN(100);

    const transactionSignature1 = await program.methods
      .mintToken("usdc", amount, mintBump_usdc)
      .accounts({
        payer: payer.publicKey,
        mintAccount: mintPDA_usdc,
        associatedTokenAccount: associatedTokenAccountAddress_usdc,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

      const transactionSignature2 = await program.methods
      .mintToken("goldsol", amount, mintBump_goldsol)
      .accounts({
        payer: payer.publicKey,
        mintAccount: mintPDA_goldsol,
        associatedTokenAccount: associatedTokenAccountAddress_goldsol,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();


    // console.log("Success!");
    // console.log(
    //   `   Associated Token Account Address: ${associatedTokenAccountAddress}`
    // );
    // console.log(`   Transaction Signature: ${transactionSignature}`);
  });

});
