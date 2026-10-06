---
name: reply
description: Draft and send a message in an Inboxapp thread. Use when the user asks to reply, follow up, answer a DM, or send a message to a contact.
---

# Reply in a thread

A sent message reaches a real person from the user's own account. Show the draft and get a yes before you call `messages_send`.

## Find the thread

If the user gave a name, call `contacts_list` with `username`, or `threads_list` with `q` and `folder` set to `all`. If two threads match, ask which one. A contact can have threads on several accounts.

## Read the conversation

Call `messages_list` on the thread and read back far enough to follow it. Match the tone and language the user's side already uses. Do not invent facts, prices, dates or promises. If the reply needs something you do not know, ask the user.

## Check that the send can work

`threads_get` returns the thread's `restrictions`, and `accountLinks_get` returns the account's `capabilities` and `status`. A disconnected account or a restricted thread fails on send, so check before you draft a long message.

`platforms_list` gives each platform's `limits.characters`. Content over the limit fails with `contentRejected`. Shorten the draft or split it, and tell the user which you did.

## Confirm, then send

Show the draft and name the recipient and the sending account. Wait for the user to approve. Apply their edits and show the result again if the change was more than a word or two.

Call `messages_send` with the thread as `target` and the approved text as `content`. Set `idempotencyKey` to a fresh value for each distinct message, and reuse the same value if you retry after a timeout. A replayed key returns the original message and sends nothing new.

Set `replyToMessageId` only when the user wants to quote a specific message.

## After sending

Report what was sent and to whom. If the send failed, give the error code and what it means. Do not retry with different content unless the user asks.

## Edits, deletes and reactions

`messages_edit` and `messages_unsend` change what the other person sees. Confirm each one. `messages_unsend` takes a `scope`. `self` deletes the message for the user's account only, and `all` unsends it for everyone in the thread. Ask which one the user means.

`messages_react` adds an emoji reaction. Ask first unless the user requested that reaction.

Never send to several threads in one go because the user approved one draft. Each recipient gets their own confirmation.
