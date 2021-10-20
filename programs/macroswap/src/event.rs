use anchor_lang::prelude::*;

#[event]
pub struct BuyTokenEvent {
  pub amount: u64,
  pub user: Pubkey,
}

#[event]
pub struct SellTokenEvent {
  pub amount: u64,
  pub user: Pubkey,
}
