// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title KeyNotesVault
/// @notice Low-cost Base miniapp contract for note hash status proofs.
/// @dev Store only hashes. Keep plaintext and rich metadata off-chain.
contract KeyNotesVault {
    enum NoteStatus {
        Draft,
        Sealed,
        Revealed,
        Archived
    }

    struct NoteSlot {
        address owner;
        bytes32 noteHash;
        NoteStatus status;
    }

    uint256 private _nextNoteId;
    mapping(uint256 => NoteSlot) private _notes;

    event NoteCreated(address indexed owner, uint256 indexed noteId, bytes32 noteHash);
    event NoteStatusChanged(address indexed owner, uint256 indexed noteId, NoteStatus status);

    error EmptyHash();
    error NoteNotFound();
    error NotNoteOwner();
    error InvalidStatus();

    modifier onlyNoteOwner(uint256 noteId) {
        address owner = _notes[noteId].owner;
        if (owner == address(0)) revert NoteNotFound();
        if (owner != msg.sender) revert NotNoteOwner();
        _;
    }

    function createNote(bytes32 noteHash) external returns (uint256 noteId) {
        if (noteHash == bytes32(0)) revert EmptyHash();

        noteId = ++_nextNoteId;
        _notes[noteId] = NoteSlot(msg.sender, noteHash, NoteStatus.Draft);

        emit NoteCreated(msg.sender, noteId, noteHash);
    }

    function setNoteStatus(uint256 noteId, NoteStatus status) external onlyNoteOwner(noteId) {
        if (status == NoteStatus.Draft) revert InvalidStatus();

        _notes[noteId].status = status;
        emit NoteStatusChanged(msg.sender, noteId, status);
    }

    function getNote(uint256 noteId) external view returns (NoteSlot memory note) {
        note = _notes[noteId];
        if (note.owner == address(0)) revert NoteNotFound();
    }
}
