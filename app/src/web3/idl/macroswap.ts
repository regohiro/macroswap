export type Macroswap = {
  "version": "0.0.0",
  "name": "macroswap",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "macroMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolMacro",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolWsol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "macroswapAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumps",
          "type": {
            "defined": "PoolBumps"
          }
        },
        {
          "name": "rate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyToken",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userWsol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMacro",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolWsol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolMacro",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "macroswapAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "sellToken",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userWsol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMacro",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolWsol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolMacro",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "macroswapAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateRate",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "macroswapAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rate",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "macroSwapAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rate",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "bumps",
            "type": {
              "defined": "PoolBumps"
            }
          },
          {
            "name": "macroMint",
            "type": "publicKey"
          },
          {
            "name": "wsolMint",
            "type": "publicKey"
          },
          {
            "name": "poolMacro",
            "type": "publicKey"
          },
          {
            "name": "poolWsol",
            "type": "publicKey"
          },
          {
            "name": "poolOwner",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "PoolBumps",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolMacro",
            "type": "u8"
          },
          {
            "name": "poolWsol",
            "type": "u8"
          },
          {
            "name": "poolOwner",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "BuyTokenEvent",
      "fields": [
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "SellTokenEvent",
      "fields": [
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "LowWSol",
      "msg": "Insufficient WSOL"
    },
    {
      "code": 301,
      "name": "LowMacro",
      "msg": "Insufficient Macro tokens"
    }
  ]
};

export const IDL: Macroswap = {
  "version": "0.0.0",
  "name": "macroswap",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "macroMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolMacro",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolWsol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "macroswapAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumps",
          "type": {
            "defined": "PoolBumps"
          }
        },
        {
          "name": "rate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyToken",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userWsol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMacro",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolWsol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolMacro",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "macroswapAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "sellToken",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userWsol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMacro",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolWsol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolMacro",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "macroswapAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateRate",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "macroswapAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rate",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "macroSwapAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rate",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "bumps",
            "type": {
              "defined": "PoolBumps"
            }
          },
          {
            "name": "macroMint",
            "type": "publicKey"
          },
          {
            "name": "wsolMint",
            "type": "publicKey"
          },
          {
            "name": "poolMacro",
            "type": "publicKey"
          },
          {
            "name": "poolWsol",
            "type": "publicKey"
          },
          {
            "name": "poolOwner",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "PoolBumps",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolMacro",
            "type": "u8"
          },
          {
            "name": "poolWsol",
            "type": "u8"
          },
          {
            "name": "poolOwner",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "BuyTokenEvent",
      "fields": [
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "SellTokenEvent",
      "fields": [
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "LowWSol",
      "msg": "Insufficient WSOL"
    },
    {
      "code": 301,
      "name": "LowMacro",
      "msg": "Insufficient Macro tokens"
    }
  ]
};
