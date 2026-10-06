---
name: pipeline
description: Keep Inboxapp contacts organized. Use when the user asks to tag a contact, change a status or pipeline stage, assign a conversation, add notes or a deal value, or archive threads.
---

# Keep contacts and threads organized

Contacts carry the CRM state: status, tags, notes, valuation and a default assignee. Threads carry what belongs to one conversation: archived, unread and their own assignee.

## Look up what exists first

Call `tags_list` and `statuses_list` before you apply either. Use the team's existing names. Create a tag or status only when the user asks for a new one, with `tags_create` or `statuses_create`. `colors_list` gives the colors they accept.

`team_listMembers` gives the member IDs that `assigneeId` takes.

## Change a contact

Find the contact with `contacts_list` by `username`, or by `platform` and `platformId`. No match returns an empty list.

- `contacts_addTag` and `contacts_removeTag` take a tag name or ID.
- `contacts_update` sets `status`, `notes`, `valuation` and `assigneeId`. Omitted fields stay as they are. `null` clears a field.

`notes` is one field. Updating it replaces the whole text. To add a line, read the contact with `contacts_get` and write back the old notes plus the new line.

## Change a thread

`threads_update` sets `archived`, `unread` and `assigneeId`. A thread's own assignee overrides the contact's default. Set it to `null` to fall back to the contact.

Archiving and marking as read also apply on the platform when the account supports it.

## Confirm changes that touch many records

One change the user asked for by name needs no extra confirmation. For anything that touches several contacts or threads, list them and the change, then wait for a yes.

## Deletes

`threads_delete` removes the conversation in Inboxapp, and on the platform when it can. `tags_delete` and `statuses_delete` remove the label from every contact that has it. Confirm each delete, and say what else it affects.

Prefer archiving a thread to deleting it unless the user said delete.
