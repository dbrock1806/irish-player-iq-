# Irish Player IQ — Learning Mode Bugfix Build

This build focuses on accurate roster learning.

## Learning Mode
- Starts with 6 players.
- Mixes Player → Number, Number + Position → Player, and Player → Position.
- Requires 2 correct recalls in each of the three skills before a player is mastered.
- Once every player in the active pool is mastered, the pool expands by 3 players.
- Continues until the full 114-player roster is learned.
- Progress is saved locally.

## Ambiguity protection
- Jersey numbers are not unique, so Number → Player questions always show **number + position**.
- Position names are not unique, so the learning mode never asks an ambiguous **position-only → player** question.
- Player → Number shows player + position.
- Player → Position shows player + number.
- All answer choices are unique values and the correct answer is always singular.

## Learning feedback
Wrong answers reveal the correct answer and the player's class so the mistake reinforces the association.

## Class information
Every roster record includes the current class from Notre Dame's official June 2026 roster: Freshman, Sophomore, Junior, or Senior.

## Photo modes
Photo-based quiz modes are intentionally removed.
