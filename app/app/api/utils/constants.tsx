import idl from "../idl/test_token_faucet.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

/* Constants for RPC Connection the Solana Blockchain */
export const commitmentLevel = "finalized";
export const endpoint = clusterApiUrl("devnet");
// export const endpoint = "https://greatest-omniscient-research.solana-devnet.quiknode.pro/cc1d1ce692d1602d03d62138e06253f912cca7e6/";
export const connection = new Connection(endpoint, commitmentLevel);

/* Constants for the Solana Program */
export const programId = new PublicKey("5cPm72ndqFdHgLqkMxGf61z4231VQW2uyLUx1X6TM71J");
export const programInterface = JSON.parse(JSON.stringify(idl));
