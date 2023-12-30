import { Program, AnchorProvider, BN } from "@project-serum/anchor";
import { TestTokenFaucet } from "./types/test_token_faucet";
import {
    connection,
    commitmentLevel,
    programId,
    programInterface,
} from "./utils/constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { MPL_TOKEN_METADATA_PROGRAM_ID as PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

export default async function createToken(
    wallet: AnchorWallet,
    ref_symbol: string,
    token_name: string,
    token_symbol: string,
    token_uri: string,
) {
    const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: commitmentLevel,
    });
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(PROGRAM_ID);
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

    /* address of onchain metadata PDA */
    const [metadataAddress] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mintPDA.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );

    try {
        /* interact with the program via rpc */
        const create_instruction = await program.methods
            .createToken(
                ref_symbol,
                token_name,
                token_symbol,
                token_uri,
                mintBump,
            )
            .accounts({
                payer: provider.wallet.publicKey,
                mintAccount: mintPDA,
                metadataAccount: metadataAddress,
                tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            })
            .transaction();

        /* sign and send the transaction */
        const tx = await provider.sendAndConfirm(create_instruction);

        console.log("Success!");
        console.log(`   Mint Address: ${mintPDA}`);
        console.log(`   Transaction Signature: ${tx}`);

        return {
            status: true,
            msg: tx
        };

    }
    catch (err) {
        console.error("Transaction error: ", err);
        return {
            status: false,
            msg: (err as Error).message
        };
    }

}
