# Vendored skills

## HeyGen Skills (`heygen-avatar`, `heygen-video`, `heygen-translate`)

Vendored from [heygen-com/skills](https://github.com/heygen-com/skills) — **v3.2.0**
(commit `1bd5e4d`). MIT licensed; see `HEYGEN-LICENSE`.

Checked in rather than installed to `~/.claude/skills/` so they persist across
Claude Code web sessions, whose containers are ephemeral.

### Transport / auth

The skills route API calls through one of three transports and auto-detect at
runtime (see the mode-detection ladder in each `SKILL.md`):

1. OpenClaw plugin — not applicable here
2. HeyGen CLI, if `HEYGEN_API_KEY` is set and `heygen --version` exits 0
3. HeyGen MCP, if no API key is set and `mcp__heygen__*` tools are visible
4. HeyGen CLI fallback

**Setting `HEYGEN_API_KEY` short-circuits MCP detection.** Leave it unset if you
want MCP (OAuth) billing against your HeyGen plan credits instead of API credits.

Never commit the key. `.env` is already gitignored; prefer an env var in your
shell profile.

### Known blocker in Claude Code web sessions

Every HeyGen host is refused by the remote container's egress policy:

    static.heygen.ai  403   (CLI installer)
    api.heygen.com    403
    mcp.heygen.com    403
    app.heygen.com    403

So the CLI transport cannot be installed or used from a web session. Options:

- **Run locally.** Claude Code on your own machine has no such restriction.
- **Add the HeyGen MCP as a custom connector on claude.ai**
  (`https://mcp.heygen.com/mcp/v1/`). Connector traffic is brokered by Claude's
  infrastructure rather than the container's HTTP proxy, so the egress block
  does not apply. This is the only way to use the skills from a web session.

Note: "HyperFrames by HeyGen" in the connector directory is a *different*
product (animated slides / motion graphics from HTML). It does not provide the
`mcp__heygen__*` avatar and video tools these skills require.

### Upstream bugs worked around

The repo's `./setup` script is unusable as shipped:

- It guards on a root `SKILL.md` and exits 1 if absent — but `CLAUDE.md`
  states the repo deliberately has no root `SKILL.md`, so it always exits.
- Its `SKILLS` array lists only `heygen-avatar` and `heygen-video`, omitting
  `heygen-translate`.

Vendoring sidesteps both — no symlink step is needed for project-level skills.

### Updating

    git clone --depth 1 https://github.com/heygen-com/skills.git /tmp/heygen-skills
    rsync -a --delete /tmp/heygen-skills/heygen-{avatar,video,translate} .claude/skills/

Re-read the changed `SKILL.md` afterwards — the mode-detection ladder gains new
transports from time to time.
