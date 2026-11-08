---
name: inboxapp
description: Inboxapp is a shared inbox and CRM for X, LinkedIn and WhatsApp DMs. Use when the user mentions Inboxapp or wants an agent to read, answer or organize their team's DMs, to connect to the Inboxapp MCP server or API, or when it is unclear which Inboxapp skill fits.
---

# Inboxapp

Inboxapp puts a team's DMs on X (including XChat), LinkedIn and WhatsApp in one inbox, with a CRM around them: contacts, statuses, tags, notes, deal values and assignees. Every platform uses the same resources, so ask what an account can do rather than which platform it is on.

## Connect

Use the MCP server when the client supports remote MCP servers:

```text
https://mcp.inboxapp.com/mcp
```

- **Sign in.** Most clients support it. The first tool call opens Inboxapp in the browser, where the user picks the team and approves access. Messages show as sent by the agent on the user's behalf. The user can disconnect it under Settings → Integrations → Connected apps.
- **API token.** For clients that only take headers or run unattended, pass the token as `Authorization: Bearer <token>`. The user creates it under Settings → API. Never ask the user to paste a token into the chat, and never print one.

Without MCP, call the REST API at `https://inboxapp.com/api/v2` with the same token in the `Authorization` header. The token decides the team, so no path or parameter names one. Each MCP tool is one API operation, so the steps in these skills are the same either way.

Read the docs at https://docs.inboxapp.com/llms.txt for endpoints and fields. Don't guess an endpoint or a field that isn't there.

## The model

- **Account link**: one of the team's accounts on a platform. Messages are sent from one.
- **Profile**: one person's account on one platform.
- **Contact**: the team's record of a person. It groups their profiles and holds status, tags, notes, valuation and assignee.
- **Thread**: one conversation between one account link and one profile.
- **Message**, **Tag**, **Status** (a pipeline stage, at most one per contact) and **Member** (someone on the team).

Platforms differ. `platforms_list` gives each platform's capabilities and limits, an account link's `capabilities` narrow them, and a thread's `restrictions` narrow them further. Check them before an action instead of finding out from a `422`.

## What it can do

| To do this | Call |
| --- | --- |
| See what each platform supports | `platforms_list` |
| List and search conversations | `threads_list`, `threads_get` |
| Read a conversation | `messages_list` |
| Send, edit, unsend or react | `messages_send`, `messages_edit`, `messages_unsend`, `messages_react` |
| Find a contact the team knows | `contacts_list` |
| Find someone new on a platform | `people_search` |
| Update CRM state | `contacts_update`, `contacts_addTag`, `contacts_removeTag` |
| Archive, assign or delete a thread | `threads_update`, `threads_delete` |
| Manage tags and statuses | `tags_list`, `tags_create`, `statuses_list`, `statuses_create` |
| Look up the team and accounts | `team_listMembers`, `accountLinks_get` |

Collections are paged. Pass `nextCursor` back as `cursor` with the same filters, and stop once you have enough to answer.

All tokens and the MCP server share the team's rate limits: 300 requests a minute, 10,000 an hour and 100,000 a day. A `429` carries `Retry-After`. Replying in existing conversations works on every plan. Sending the first message to someone new needs the Advanced API add-on and otherwise fails with `403 planRequired`.

## Hand off

- **`triage`**: who needs a reply, what came in, or a summary of open conversations.
- **`reply`**: drafting, sending, editing, unsending or reacting to a message.
- **`pipeline`**: tags, statuses, notes, deal values, assignees, archiving and deleting.

Use the more specific skill when the request fits one. Use this one to connect, to answer what Inboxapp can do, or for a request that spans several.

## Ask before you act

A sent message reaches a real person from the user's own account. Show the draft, name the recipient and the sending account, and get a yes before `messages_send`. Confirm every edit, unsend and delete, and anything that changes several contacts or threads at once. One approved draft never covers other recipients.
