use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer, Mint};
use crate::account::*;

#[derive(Accounts)]
#[instruction(bumps: PoolBumps)]
pub struct Initialize<'info> {
  //Program initializer (owner)
  #[account(mut)]
  pub user: Signer<'info>,

  //Macro token mint account
  pub macro_mint: Account<'info, Mint>,
  //Macro token ATA (pool)
  #[account(
    init, payer = user, 
    seeds = [b"pool_macro".as_ref()], bump = bumps.pool_macro, 
    token::mint = macro_mint, token::authority = user)]
  pub pool_macro: Account<'info, TokenAccount>,

  //WSOL token mint account
  pub wsol_mint: Account<'info, Mint>,
  //WSOL token ATA (pool)
  #[account(
    init, payer = user,
    seeds = [b"pool_wsol".as_ref()], bump = bumps.pool_wsol,
    token::mint = wsol_mint, token::authority = user)]
  pub pool_wsol: Account<'info, TokenAccount>,

  //Account for storing state variables
  #[account(init, payer = user, space = 8 + MacroSwapAccount::LEN)]
  pub macroswap_account: Account<'info, MacroSwapAccount>,

  //System
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub rent: Sysvar<'info, Rent>
}

#[derive(Accounts)]
pub struct UpdateRate<'info> {
  pub authority: Signer<'info>,

  #[account(mut, has_one = authority)]
  pub macroswap_account: Account<'info, MacroSwapAccount>,
}

#[derive(Accounts)]
pub struct BuyToken<'info> {
  pub user: Signer<'info>,

  //WSOL token ATA (user)
  #[account(mut,
    constraint = user_wsol.owner == user.key(),
    constraint = user_wsol.mint == macroswap_account.wsol_mint)]
  pub user_wsol: Account<'info, TokenAccount>,
  //Macro token ATA (user)
  #[account(mut,
    constraint = user_macro.owner == user.key(),
    constraint = user_macro.mint == macroswap_account.macro_mint)]
  pub user_macro: Account<'info, TokenAccount>,
  
  //WSOL token ATA (pool)
  #[account(mut, 
    seeds = [b"pool_wsol".as_ref()], 
    bump = macroswap_account.bumps.pool_wsol)]
  pub pool_wsol: Account<'info, TokenAccount>,
  //Macro token ATA (pool)
  #[account(mut,
    seeds = [b"pool_macro".as_ref()],
    bump = macroswap_account.bumps.pool_macro)]
  pub pool_macro: Account<'info, TokenAccount>,
  pub pool_macro_pda: AccountInfo<'info>,

  pub macroswap_account: Account<'info, MacroSwapAccount>,

  //System
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SellToken<'info> {
  pub user: Signer<'info>,
  
  //WSOL token ATA (user)
  #[account(mut,
    constraint = user_wsol.owner == user.key(),
    constraint = user_wsol.mint == macroswap_account.wsol_mint)]
  pub user_wsol: Account<'info, TokenAccount>,
  //Macro token ATA (user)
  #[account(mut,
    constraint = user_macro.owner == user.key(),
    constraint = user_macro.mint == macroswap_account.macro_mint)]
  pub user_macro: Account<'info, TokenAccount>,

  //WSOL token ATA (pool)
  #[account(mut, 
    seeds = [b"pool_wsol".as_ref()], 
    bump = macroswap_account.bumps.pool_wsol)]
  pub pool_wsol: Account<'info, TokenAccount>,
  pub pool_wsol_pda: AccountInfo<'info>,
  //Macro token ATA (pool)
  #[account(mut,
    seeds = [b"pool_macro".as_ref()],
    bump = macroswap_account.bumps.pool_macro)]
  pub pool_macro: Account<'info, TokenAccount>,

  pub macroswap_account: Account<'info, MacroSwapAccount>,

  //System
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
}

impl<'a, 'b, 'c, 'info> BuyToken<'info> {
  pub fn into_transfer_to_pool_wsol_context(&self) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
    let cpi_accounts = Transfer {
      from: self.user_wsol.to_account_info().clone(),
      to: self.pool_wsol.to_account_info().clone(),
      authority: self.user.to_account_info().clone()
    };
    let cpi_program = self.token_program.to_account_info();
    CpiContext::new(cpi_program, cpi_accounts)
  }

  pub fn into_transfer_to_user_macro_context(&self) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
    let cpi_accounts = Transfer {
      from: self.pool_macro.to_account_info().clone(),
      to: self.user_macro.to_account_info().clone(),
      authority: self.pool_macro_pda.clone()
    };
    let cpi_program = self.token_program.to_account_info();
    CpiContext::new(cpi_program, cpi_accounts)
  }
}

impl<'a, 'b, 'c, 'info> SellToken<'info> {
  pub fn into_transfer_to_pool_macro_context(&self) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
    let cpi_accounts = Transfer {
      from: self.user_macro.to_account_info().clone(),
      to: self.pool_macro.to_account_info().clone(),
      authority: self.user.to_account_info().clone()
    };
    let cpi_program = self.token_program.to_account_info();
    CpiContext::new(cpi_program, cpi_accounts)
  }

  pub fn into_transfer_to_user_wsol_context(&self) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
    let cpi_accounts = Transfer {
      from: self.pool_macro.to_account_info().clone(),
      to: self.user_macro.to_account_info().clone(),
      authority: self.pool_wsol_pda.clone()
    };
    let cpi_program = self.token_program.to_account_info();
    CpiContext::new(cpi_program, cpi_accounts)
  }
}