export const KEY_NOTES_VAULT_CONTRACT_ADDRESS =
  '0xe36cD5135D3d7a7bf4919d78c6B4bEf298e2b379' as const

export const keyNotesVaultAbi = [
  {
    type: 'function',
    name: 'createNote',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'noteHash', type: 'bytes32' }],
    outputs: [{ name: 'noteId', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'setNoteStatus',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'noteId', type: 'uint256' },
      { name: 'status', type: 'uint8' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'getNote',
    stateMutability: 'view',
    inputs: [{ name: 'noteId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'owner', type: 'address' },
          { name: 'noteHash', type: 'bytes32' },
          { name: 'status', type: 'uint8' }
        ]
      }
    ]
  },
  {
    type: 'event',
    name: 'NoteCreated',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'noteId', type: 'uint256', indexed: true },
      { name: 'noteHash', type: 'bytes32', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'NoteStatusChanged',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'noteId', type: 'uint256', indexed: true },
      { name: 'status', type: 'uint8', indexed: false }
    ]
  }
] as const
