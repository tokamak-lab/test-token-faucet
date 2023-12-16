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

  const [mintPDA, mintBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    program.programId
  );

  const metadata = {
    name: "Solana Gold",
    symbol: "GOLDSOL",
    uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
  };

  it("Create a token!", async () => {
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintPDA.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const transactionSignature = await program.methods
    .createToken(metadata.name, metadata.symbol, metadata.uri, mintBump)
    .accounts({
      payer: payer.publicKey,
      mintAccount: mintPDA,
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

  it("Mint 1 Token!", async () => {
    // Derive the associated token address account for the mint and payer.
    const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
      mintPDA,
      payer.publicKey
    );

    // Amount of tokens to mint.
    const amount = new anchor.BN(100);

    const transactionSignature = await program.methods
      .mintToken(amount, mintBump)
      .accounts({
        payer: payer.publicKey,
        mintAccount: mintPDA,
        associatedTokenAccount: associatedTokenAccountAddress,
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
