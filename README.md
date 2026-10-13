# Inboxapp AI toolkit

The Inboxapp plugin for Claude, Codex, ChatGPT and Cursor. It connects an agent to your team's inbox through the Inboxapp MCP server and adds three skills for the work people do there most.

## What it does

The plugin points at one remote MCP server, `https://mcp.inboxapp.com/mcp`. It runs nothing on your machine and ships no scripts or hooks.

It works with X and LinkedIn today. Gmail, Instagram, WhatsApp, Telegram and other platforms are on the way.

Through that server an agent can:

- list and search threads, and read their messages
- send, edit, unsend and react to messages from your connected accounts
- update contacts: status, tags, notes, valuation and assignee
- archive, assign and delete threads
- manage the team's tags and statuses

The skills tell the agent how to use those tools well.

| Skill | Use it to |
| --- | --- |
| `triage` | Find the conversations that need a reply and summarize them |
| `reply` | Draft a message, show it to you, and send it once you approve |
| `pipeline` | Tag, assign, and move contacts through your statuses |

The agent asks before it sends a message or deletes anything.

## Example prompts

- Who do I need to reply to?
- What conversations have gone cold?
- Find the conversation where someone mentioned [topic].
- What did I last discuss with [person]?
- Summarize everything I know about [person] from our conversations.
- Who have I spoken to about [company/topic]?
- What follow-ups am I overdue on?
- Find people I should reconnect with.
- Draft replies to the conversations that need my attention.
- What did I tell [person] I would do?
- Find all conversations related to [project].
- Before my meeting with [person], catch me up on our relationship.

## Requirements

You need an Inboxapp account on a team with API v2 access. API v2 is in private rollout, so the server answers `404` for teams that do not have it yet.

## Install

### Claude Code

```sh
claude plugin marketplace add inboxhq/inboxapp-ai-toolkit
claude plugin install inboxapp@inboxapp
```

### Codex

```sh
codex plugin marketplace add inboxhq/inboxapp-ai-toolkit
codex plugin add inboxapp
```

### Cursor

Install from the Cursor marketplace once the plugin is listed. Until then, add the server to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "inboxapp": { "url": "https://mcp.inboxapp.com/mcp" }
  }
}
```

## Sign in

The first tool call opens Inboxapp in your browser. Sign in, pick the team the agent should work in, and give the agent a name. Messages it sends are attributed to that name inside Inboxapp.

The agent gets the same access you have in that team. You can disconnect it at any time under Settings, Integrations, Connected apps.

## Data

The plugin sends requests to `mcp.inboxapp.com` and nowhere else. Sign-in happens on `inboxapp.com`. The plugin stores no credentials in this repository or in its config files. Your client holds the OAuth token.

See the [privacy policy](https://inboxapp.com/privacy) and [terms](https://inboxapp.com/terms).

## Develop

The repository root is the plugin. Two clients read two manifest formats, so some values appear twice:

| File | Read by |
| --- | --- |
| `plugin.json`, `mcp.json` | Codex, ChatGPT, Cursor |
| `.cursor-plugin/plugin.json` | Cursor, which also needs a `logo` that `plugin.json` can't hold |
| `.claude-plugin/plugin.json`, `.mcp.json` | Claude |
| `.claude-plugin/marketplace.json` | Claude marketplace |
| `.agents/plugins/marketplace.json` | Codex marketplace |
| `skills/` | all of them |

`node scripts/check.mjs` fails when the name, version, description or server URL differ between the manifests. CI runs it together with `claude plugin validate --strict`.

To try a change locally:

```sh
claude --plugin-dir .
```

Bump `version` in both manifests on every release. Clients that pin the version keep the old copy otherwise.

## License

MIT
