// In this example the same PDA is used as both the address of the mint account and the mint authority
// This is to demonstrate that the same PDA can be used for both the address of an account and CPI signing
use {
    anchor_lang::{
        prelude::*,
        solana_program::entrypoint::ProgramResult,
    },
    anchor_spl::{
        metadata::{create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata},
        token::{Mint, Token},
    },
    mpl_token_metadata::types::DataV2,
    mpl_token_metadata::accounts::Metadata as mpl_metadata,
};

#[derive(Accounts)]
#[instruction(ref_symbol: String)]
pub struct CreateToken<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    // Create mint account
    // Same PDA as address of the account and mint/freeze authority
    #[account(
        init,
        seeds = [b"mint", ref_symbol.as_bytes()],
        bump,
        payer = payer,
        mint::decimals = 9,
        mint::authority = mint_account.key(),
    )]
    pub mint_account: Account<'info, Mint>,

    /// CHECK: Address validated using constraint
    #[account(
        mut,
        address=mpl_metadata::find_pda(&mint_account.key()).0
    )]
    pub metadata_account: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_token(
    ctx: Context<CreateToken>,
    ref_symbol: String,
    token_name: String,
    token_symbol: String,
    token_uri: String,
    
    bump: u8,
) -> ProgramResult {
    msg!("Creating metadata account");

    // PDA signer seeds
    let signer: &[&[&[u8]]] = &[&[b"mint", ref_symbol.as_bytes(), &[bump][..]]];

    // Cross Program Invocation (CPI) signed by PDA
    // Invoking the create_metadata_account_v3 instruction on the token metadata program
    create_metadata_accounts_v3(
        CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata_account.to_account_info(),
                mint: ctx.accounts.mint_account.to_account_info(),
                mint_authority: ctx.accounts.mint_account.to_account_info(), // PDA is mint authority
                update_authority: ctx.accounts.mint_account.to_account_info(), // PDA is update authority
                payer: ctx.accounts.payer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            signer,
        ),
        
        DataV2 {
            name: token_name,
            symbol: token_symbol,
            uri: token_uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        },
        false, // Is mutable
        true,  // Update authority is signer
        None,  // Collection details
    )?;

    msg!("Token created successfully.");

    Ok(())
}
