use anchor_lang::prelude::*;

#[error]
pub enum ErrorCode {
  #[msg("Insufficient WSOL")]
  LowWSol,
  #[msg("Insufficient Macro tokens")]
  LowMacro,
}
