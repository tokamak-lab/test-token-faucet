#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use instructions::*;
pub mod instructions;

declare_id!("5cPm72ndqFdHgLqkMxGf61z4231VQW2uyLUx1X6TM71J");

#[program]
pub mod test_token_faucet {
    

    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        token_name: String,
        token_symbol: String,
        token_uri: String,
        bump: u8,
    ) -> ProgramResult {
        create::create_token(ctx, token_name, token_symbol, token_uri, bump)
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64, bump: u8) -> ProgramResult {
        mint::mint_token(ctx, amount, bump)
    }
}
