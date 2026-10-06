---
name: triage
description: Work through an Inboxapp inbox. Use when the user asks what needs a reply, who is waiting, what came in today, or wants a summary of open conversations.
---

# Triage the inbox

Find the threads that need attention, read enough of each to say why, and report them in order.

## Find the threads

Call `threads_list` with `expand` set to `contact` and `profile`, so each thread comes back with the person's name and CRM state.

Pick the folder from what the user asked:

- `noReply` for "who is waiting on us". These are inbox threads whose latest activity is inbound.
- `inbox`, the default, for everything open.
- `requests` for message requests nobody accepted yet.
- `all` when the user names a person or a campaign, because campaign sends archive the thread.

Narrow with `assigneeId`, `unassigned`, `tag`, `status` or `accountLinkId` when the user scopes the question. `tag` and `status` take a name or an ID. To resolve "my threads", call `team_listMembers` and match the user.

Results come back in inbox order, newest first. Read more pages by passing `nextCursor` back as `cursor` with the same filters. Stop when you have enough to answer. Do not page through the whole inbox for a summary.

## Read before you judge

The thread's activity preview is one line. When the preview does not say what the person wants, call `messages_list` on that thread and read the last few messages.

## Report

List each thread with the person's name, the account that received it, how long it has waited, and one sentence on what they need. Put the oldest unanswered first unless the user asked for another order.

Say what you did not check. If you stopped after two pages, say so.

## What triage does not do

Triage reads. It does not archive, assign, tag or reply. If the user wants those, confirm the specific threads first, then use the `reply` or `pipeline` skill.
