use anchor_lang::prelude::*;
use anchor_spl::token::{self};

use account::*;
use context::*;
use error::*;
use event::*;

mod account;
mod context;
mod error;
mod event;

declare_id!("FqwbZ8hJwL2uaANW61tXA7JX6KUQq4THhaeUb2AXnMPj");

#[program]
pub mod macroswap {
  use super::*;

  pub fn initialize(ctx: Context<Initialize>, bumps: PoolBumps, rate: u64) -> ProgramResult {
    msg!("INITIALIZE");

    let macroswap_account = &mut ctx.accounts.macroswap_account;

    macroswap_account.rate = rate;
    macroswap_account.authority = *ctx.accounts.user.key;
    macroswap_account.bumps = bumps;
    macroswap_account.macro_mint = ctx.accounts.macro_mint.key();
    macroswap_account.wsol_mint = ctx.accounts.wsol_mint.key();
    macroswap_account.pool_macro = ctx.accounts.pool_macro.key();
    macroswap_account.pool_wsol = ctx.accounts.pool_wsol.key();
    macroswap_account.pool_owner = ctx.accounts.pool_owner.key();

    Ok(())
  }

  pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> ProgramResult {
    msg!("BUY");

    let macroswap_account = &ctx.accounts.macroswap_account;

    //Calculate amount of WSOL user is going to pay
    let value = amount / macroswap_account.rate;

    if ctx.accounts.user_wsol.amount < value {
      return Err(ErrorCode::LowWSol.into());
    }

    //Get PDA signer seed of pool owner
    let pda_seeds = &[
      b"pool_owner".as_ref(),
      &[macroswap_account.bumps.pool_owner],
    ];

    //Transfer WSOL from user to pool
    token::transfer(ctx.accounts.into_transfer_to_pool_wsol_context(), value)?;

    //Transfer Macro from pool to user
    token::transfer(
      ctx
        .accounts
        .into_transfer_to_user_macro_context()
        .with_signer(&[pda_seeds.as_ref()]),
      amount,
    )?;

    emit!(BuyTokenEvent {
      amount,
      user: ctx.accounts.user.key()
    });

    Ok(())
  }

  pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> ProgramResult {
    msg!("SELL");

    let macroswap_account = &ctx.accounts.macroswap_account;

    if ctx.accounts.user_macro.amount < amount {
      return Err(ErrorCode::LowMacro.into());
    }

    //Calculate amount of WSOL user is going to receive
    let value = amount / macroswap_account.rate;
    //Get PDA signer seed of pool owner
    let pda_seeds = &[b"pool_owner".as_ref(), &[macroswap_account.bumps.pool_owner]];

    //Transfer Macro from user to pool
    token::transfer(ctx.accounts.into_transfer_to_pool_macro_context(), amount)?;

    //Transfer WSOL from pool to user
    token::transfer(
      ctx
        .accounts
        .into_transfer_to_user_wsol_context()
        .with_signer(&[pda_seeds.as_ref()]),
      value,
    )?;

    emit!(SellTokenEvent {
      amount,
      user: ctx.accounts.user.key()
    });

    Ok(())
  }

  pub fn update_rate(ctx: Context<UpdateRate>, rate: u64) -> ProgramResult {
    msg!("UPDATE");

    let macroswap_account = &mut ctx.accounts.macroswap_account;
    macroswap_account.rate = rate;

    Ok(())
  }
}
