'use client'

import { FilePlus2, Hash, LockKeyhole, RadioTower, RefreshCw } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { KeyVaultHeader } from '@/components/KeyVaultHeader'
import { useKeyNotesVault } from '@/hooks/useKeyNotesVault'

export default function HomePage() {
  const [noteText, setNoteText] = useState('')
  const vault = useKeyNotesVault()

  function submitCreateNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!noteText.trim()) return
    vault.createNote(noteText)
    setNoteText('')
  }

  return (
    <main className="screen">
      <div className="app-shell">
        <KeyVaultHeader />
        <section className="contract-console">
          <form className="panel console-panel note-composer" onSubmit={submitCreateNote}>
            <div>
              <p className="thin-label">Create Note</p>
              <h1 className="section-title">Hash plaintext and write createNote(bytes32)</h1>
            </div>
            <textarea
              className="textarea"
              maxLength={240}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Private note text. Only its bytes32 hash is sent on-chain."
              required
              value={noteText}
            />
            <button className="button" disabled={!vault.isConnected || vault.isWritePending} type="submit">
              <FilePlus2 size={16} />
              {vault.isWritePending ? 'Opening wallet' : 'Create On-Chain Note'}
            </button>
          </form>

          <section className="panel console-panel contract-reader">
            <div className="contract-reader-head">
              <div>
                <p className="thin-label">Read Note</p>
                <h1>getNote(uint256)</h1>
              </div>
              <button className="icon-button" onClick={() => vault.refetchNote()} title="Refresh note" type="button">
                <RefreshCw size={16} />
              </button>
            </div>
            <input
              className="field"
              inputMode="numeric"
              min="1"
              onChange={(event) => vault.setNoteIdInput(event.target.value.replace(/\D/g, ''))}
              placeholder="Note id"
              type="text"
              value={vault.noteIdInput}
            />
            {vault.note ? (
              <div className="chain-note">
                <div>
                  <p className="thin-label">Owner</p>
                  <strong>{vault.note.owner}</strong>
                </div>
                <div>
                  <p className="thin-label">Status</p>
                  <strong>{vault.note.status}</strong>
                </div>
                <div>
                  <p className="thin-label">Note Hash</p>
                  <div className="proof-block">
                    <Hash size={14} />
                    {vault.note.noteHash}
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-chain-note">
                {vault.isReading ? 'Reading note from contract...' : 'Enter an existing note id.'}
              </div>
            )}
          </section>

          <aside className="panel contract-actions">
            <div className="sealed-panel-top">
              <RadioTower size={20} />
              <span>{vault.isConnected ? 'Wallet online' : 'Connect wallet to write'}</span>
            </div>
            <div className="contract-address">
              <p className="thin-label">Contract</p>
              <strong>{vault.contractAddress}</strong>
            </div>
            <button
              className="button mint action-button"
              disabled={!vault.isConnected || !vault.noteId || vault.isWritePending}
              onClick={() => vault.setNoteStatus('sealed')}
              type="button"
            >
              <LockKeyhole size={17} />
              Seal Note
            </button>
            <button
              className="button saffron action-button"
              disabled={!vault.isConnected || !vault.noteId || vault.isWritePending}
              onClick={() => vault.setNoteStatus('revealed')}
              type="button"
            >
              Reveal Note
            </button>
            <button
              className="button secondary action-button"
              disabled={!vault.isConnected || !vault.noteId || vault.isWritePending}
              onClick={() => vault.setNoteStatus('archived')}
              type="button"
            >
              Archive Note
            </button>
            {vault.txHash ? (
              <div className="proof-block">
                <Hash size={14} />
                {vault.txHash}
              </div>
            ) : null}
            {vault.isConfirming ? <div className="toast">Waiting for confirmation...</div> : null}
            {vault.isConfirmed ? <div className="toast">Transaction confirmed.</div> : null}
            {vault.readErrorText ? <div className="error-box">{vault.readErrorText}</div> : null}
            {vault.writeErrorText ? <div className="error-box">{vault.writeErrorText}</div> : null}
          </aside>
        </section>
      </div>
    </main>
  )
}
