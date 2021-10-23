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
  pub macro_mint: Box<Account<'info, Mint>>,
  //Macro token ATA (pool)
  #[account(
    init, payer = user, 
    seeds = [b"pool_macro".as_ref()], bump = bumps.pool_macro, 
    token::mint = macro_mint, token::authority = pool_owner)]
  pub pool_macro: Box<Account<'info, TokenAccount>>,

  //WSOL token mint account
  pub wsol_mint: Box<Account<'info, Mint>>,
  //WSOL token ATA (pool)
  #[account(
    init, payer = user,
    seeds = [b"pool_wsol".as_ref()], bump = bumps.pool_wsol,
    token::mint = wsol_mint, token::authority = pool_owner)]
  pub pool_wsol: Box<Account<'info, TokenAccount>>,

  //Account for storing state variables
  #[account(init, payer = user, space = 8 + MacroSwapAccount::LEN)]
  pub macroswap_account: Box<Account<'info, MacroSwapAccount>>,
  //PDA authority account for pools
  #[account(seeds = [b"pool_owner".as_ref()], bump = bumps.pool_owner)]
  pub pool_owner: AccountInfo<'info>,

  //System
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub rent: Sysvar<'info, Rent>
}

#[derive(Accounts)]
pub struct UpdateRate<'info> {
  pub authority: Signer<'info>,

  #[account(mut, has_one = authority)]
  pub macroswap_account: Box<Account<'info, MacroSwapAccount>>,
}

#[derive(Accounts)]
pub struct BuyToken<'info> {
  pub user: Signer<'info>,

  #[account(mut,
    constraint = user_wsol.owner == user.key(),
    constraint = user_wsol.mint == macroswap_account.wsol_mint)]
  pub user_wsol: Box<Account<'info, TokenAccount>>,
  #[account(mut,
    constraint = user_macro.owner == user.key(),
    constraint = user_macro.mint == macroswap_account.macro_mint)]
  pub user_macro: Box<Account<'info, TokenAccount>>,
  
  #[account(mut, constraint = pool_wsol.key() == macroswap_account.pool_wsol)]
  pub pool_wsol: Box<Account<'info, TokenAccount>>,
  #[account(mut, constraint = pool_macro.key() == macroswap_account.pool_macro)]
  pub pool_macro: Box<Account<'info, TokenAccount>>,
  
  pub macroswap_account: Box<Account<'info, MacroSwapAccount>>,
  #[account(mut, constraint = pool_owner.key() == macroswap_account.pool_owner)]
  pub pool_owner: AccountInfo<'info>,

  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SellToken<'info> {
  pub user: Signer<'info>,
  
  #[account(mut,
    constraint = user_wsol.owner == user.key(),
    constraint = user_wsol.mint == macroswap_account.wsol_mint)]
  pub user_wsol: Account<'info, TokenAccount>,
  #[account(mut,
    constraint = user_macro.owner == user.key(),
    constraint = user_macro.mint == macroswap_account.macro_mint)]
  pub user_macro: Account<'info, TokenAccount>,

  #[account(mut, constraint = pool_wsol.key() == macroswap_account.pool_wsol)]
  pub pool_wsol: Box<Account<'info, TokenAccount>>,
  #[account(mut, constraint = pool_macro.key() == macroswap_account.pool_macro)]
  pub pool_macro: Box<Account<'info, TokenAccount>>,

  pub macroswap_account: Box<Account<'info, MacroSwapAccount>>,
  #[account(mut, constraint = pool_owner.key() == macroswap_account.pool_owner)]
  pub pool_owner: AccountInfo<'info>,

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
      authority: self.pool_owner.to_account_info().clone(),
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
      from: self.pool_wsol.to_account_info().clone(),
      to: self.user_wsol.to_account_info().clone(),
      authority: self.pool_owner.to_account_info().clone()
    };
    let cpi_program = self.token_program.to_account_info();
    CpiContext::new(cpi_program, cpi_accounts)
  }
}