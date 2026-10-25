# Avatar: Omega

## Appearance

Not yet recorded. These fields are portable natural-language description, not
API config — fill them in from the avatar's actual look once the HeyGen
transport is authorized (`list_avatar_looks` / `heygen avatar looks list`).
Left blank deliberately rather than guessed.

- Age: <unverified>
- Gender: <unverified>
- Ethnicity: <unverified>
- Hair: <unverified>
- Build: <unverified>
- Features: <unverified>
- Style: <unverified>
- Reference: <unverified>

## Voice

- Tone: <unverified>
- Accent: <unverified>
- Energy: <unverified>
- Think: <unverified>

## HeyGen

- Group ID: <UNRESOLVED — see note below>
- Avatar ID (as supplied): a415065565284160bba1d6b9caf8d88f
- Voice ID: <UNRESOLVED — see note below>
- Voice Name: <unverified>
- Voice Designed: <unverified>
- Voice Seed: n/a
- Looks: <resolve fresh at video time>
- Last Synced: never — supplied by hand 2026-07-25, not yet validated against the API

## Open items

Both need one API call each to settle. Neither can run until the HeyGen
transport is authorized (see `.claude/skills/README.md`).

**1. Is `a415065565284160bba1d6b9caf8d88f` a group_id or a look/avatar_id?**

The skills treat **Group ID** as the stable character anchor and explicitly
warn that look_ids are ephemeral and must be re-resolved at video time —
"never hardcode look_id as the primary avatar reference." A value labelled
"Avatar ID" is ambiguous between the two. Verify with
`list_avatar_groups` / `list_avatar_looks`; if it resolves as a group, move it
to `Group ID` and drop the `Avatar ID (as supplied)` line.

**2. The supplied voice ID is an ElevenLabs ID, not a HeyGen one.**

`ewxUvnyvvOehYjKjUVKC` is an ElevenLabs voice identifier. The `Voice ID` field
here — and the `voice_id` the v3 Video Agent pipeline sends — expects a
**HeyGen** voice_id from HeyGen's own library. Passing the ElevenLabs ID
straight through is expected to fail.

Options, in order of preference:

- Connect the ElevenLabs voice inside the HeyGen account so it surfaces as a
  HeyGen voice, then record *that* id here.
- Pick the nearest match from HeyGen's library via `list_voices` / Voice
  Design (no quota consumed).
- Keep ElevenLabs for narration and composite outside HeyGen — note this needs
  `api.elevenlabs.io`, which is also blocked from Claude Code web sessions.

## Assumptions

Filed as the **user** avatar (`AVATAR-USER.md` alias) on the assumption this is
Omega's own presenter for OmegaBone, not an agent persona. If it is meant to be
the agent's face, repoint the alias to `AVATAR-AGENT.md` — the named file stays
canonical either way.
