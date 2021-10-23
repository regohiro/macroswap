use anchor_lang::prelude::*;

#[account]
pub struct MacroSwapAccount {
  pub rate: u64,           // 8
  pub authority: Pubkey,   // 32
  
  pub bumps: PoolBumps,    // 2
  pub macro_mint: Pubkey,  // 32
  pub wsol_mint: Pubkey,   // 32
  pub pool_macro: Pubkey,  // 32
  pub pool_wsol: Pubkey,   // 32
  pub pool_owner: Pubkey   // 32
}

#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone)]
pub struct PoolBumps {
  pub pool_macro: u8, // 1
  pub pool_wsol: u8,  // 1
  pub pool_owner: u8  // 1
}

impl MacroSwapAccount {
  pub const LEN: usize = 8 + 32 + 3 + 5 * 32;
}