'use client'

import { useMemo, useState } from 'react'
import { keccak256, toBytes, type Address, type Hex } from 'viem'
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { KEY_NOTES_VAULT_CONTRACT_ADDRESS, keyNotesVaultAbi } from '@/lib/contracts'

export const noteStatusLabels = ['draft', 'sealed', 'revealed', 'archived'] as const

export type NoteStatusLabel = (typeof noteStatusLabels)[number]

export type ChainNote = {
  owner: Address
  noteHash: Hex
  status: NoteStatusLabel
}

function getErrorText(error: unknown, fallback: string) {
  if (!error) return ''

  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error && 'message' in error
        ? String(error.message)
        : ''

  if (/user rejected|user denied|rejected transaction|denied transaction/i.test(message)) {
    return '已取消钱包签名。'
  }

  if (/not found|notefound|0xdc0b7363|returned data|could not be decoded|revert/i.test(message)) {
    return '没有读取到这个 noteId，请确认它已经在当前合约中创建。'
  }

  return fallback
}

function toNoteHash(input: string) {
  return keccak256(toBytes(input.trim()))
}

export function useKeyNotesVault() {
  const { address, isConnected } = useAccount()
  const [noteIdInput, setNoteIdInput] = useState('')
  const { data: txHash, error: writeError, isPending: isWritePending, writeContract } = useWriteContract()
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed
  } = useWaitForTransactionReceipt({
    hash: txHash
  })

  const noteId = useMemo(() => {
    if (!noteIdInput) return undefined
    const parsed = BigInt(noteIdInput || '0')
    return parsed > BigInt(0) ? parsed : undefined
  }, [noteIdInput])

  const {
    data: noteData,
    error: readError,
    isLoading: isReading,
    refetch: refetchNote
  } = useReadContract({
    abi: keyNotesVaultAbi,
    address: KEY_NOTES_VAULT_CONTRACT_ADDRESS,
    functionName: 'getNote',
    args: noteId ? [noteId] : undefined,
    query: {
      enabled: Boolean(noteId)
    }
  })

  const note = useMemo<ChainNote | undefined>(() => {
    if (!noteData) return undefined
    return {
      owner: noteData.owner,
      noteHash: noteData.noteHash,
      status: noteStatusLabels[noteData.status] ?? 'draft'
    }
  }, [noteData])

  const readErrorText = useMemo(
    () => getErrorText(readError, '读取失败，请确认 noteId 和当前网络。'),
    [readError]
  )

  const writeErrorText = useMemo(
    () => getErrorText(writeError, '交易提交失败，请检查钱包、网络和 noteId。'),
    [writeError]
  )

  function createNote(noteText: string) {
    const noteHash = toNoteHash(noteText)
    writeContract({
      abi: keyNotesVaultAbi,
      address: KEY_NOTES_VAULT_CONTRACT_ADDRESS,
      functionName: 'createNote',
      args: [noteHash]
    })
  }

  function setNoteStatus(status: Exclude<NoteStatusLabel, 'draft'>) {
    if (!noteId) return
    writeContract({
      abi: keyNotesVaultAbi,
      address: KEY_NOTES_VAULT_CONTRACT_ADDRESS,
      functionName: 'setNoteStatus',
      args: [noteId, noteStatusLabels.indexOf(status)]
    })
  }

  return {
    address,
    isConnected,
    contractAddress: KEY_NOTES_VAULT_CONTRACT_ADDRESS,
    note,
    noteId,
    noteIdInput,
    receipt,
    readErrorText,
    writeErrorText,
    txHash,
    isConfirmed,
    isConfirming,
    isReading,
    isWritePending,
    setNoteIdInput,
    createNote,
    refetchNote,
    setNoteStatus
  }
}
