import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { TestTokenFaucet } from "./types/test_token_faucet";
import { connection, commitmentLevel, programInterface, programId } from "./utils/constants";

export default async function mintToken(
    wallet: AnchorWallet,
    ref_symbol: string,
    amount: number,
) {
    const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: commitmentLevel,
    });

    if (!provider) return;

    /* create the program interface combining the idl, program Id, and provider */
    const program = new Program(
        programInterface,
        programId,
        provider
    ) as Program<TestTokenFaucet>;

    /* address of onchain mint PDA */
    const [mintPDA, mintBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint"), Buffer.from(ref_symbol)],
        program.programId
    );

    const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
        mintPDA,
        provider.wallet.publicKey
    );

    try {
        /* interact with the program via rpc */
        const mint_instuction = await program.methods
            .mintToken(ref_symbol, new BN(amount), mintBump)
            .accounts({
                payer: provider.wallet.publicKey,
                mintAccount: mintPDA,
                associatedTokenAccount: associatedTokenAccountAddress,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            })
            .transaction();

        /* sign and send the transaction */
        const tx = await provider.sendAndConfirm(mint_instuction);
        console.log("Success!");
        console.log(
            `   Associated Token Account Address for USDC: ${associatedTokenAccountAddress}`
        );
        console.log(`   Transaction Signature: ${tx}`);

        return { status: true, msg: tx };

    } catch (err) {
        console.error("Transaction error: ", err);
        return {
            status: false,
            msg: (err as Error).message
        };

    }
}


