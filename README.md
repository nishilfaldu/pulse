# Pulse

[![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-backend-EE342F?style=flat-square)](https://www.convex.dev/)
[![Status](https://img.shields.io/badge/status-unshipped_experiment-FF4444?style=flat-square)](#status)

> One quest a day. Everyone gets the same one. You can't see how anyone else
> did it until you post your own.

## The idea

Pulse gives every person on the platform the **same single task each day** — and
the feed stays locked until you complete it. The only way in is to film yourself
doing the thing and upload it. Until then, the feed is a blur behind a wall. No
lurking, no scrolling other people's attempts to copy them — you commit first,
then you get to see how everyone else interpreted the same prompt.

The friction is the point: it forces a genuine, unprimed take out of everyone
before they're influenced by the crowd.

## An honest note

I'll be straight about this one: **Pulse never shipped.** It was an idea I had in
my head and started building, and it didn't go anywhere as a product.

What I'm actually proud of — and the reason this repo is still here — is the
**design**. Some of the best-looking screens I've ever made came out of this
project, and I want to keep them around: as a portfolio of a look I like, and as
something I (or an AI model) can point at later and say "make me something with
this energy" for a future project.

So treat this as a design artifact more than a finished app.

## The look

A neo-brutalist mobile aesthetic: cream cards on near-black, thick black borders,
hard offset shadows with zero blur, a single hot-red accent, live blurred video
behind the gate, and small animated touches — a pulsing capture button, rolling
slot counters, decryption text reveals.

Screens worth a look:

| Screen | File |
|---|---|
| The locked gate ("capture to unlock") | [app/gate.tsx](app/gate.tsx) |
| Lobby / quest log | [app/lobby.tsx](app/lobby.tsx) |
| Daily wrap (top posts reel) | [components/views/DailyWrap.tsx](components/views/DailyWrap.tsx) |
| Locked home | [components/views/LockedHome.tsx](components/views/LockedHome.tsx) |
| Onboarding flow | [app/onboarding/](app/onboarding/) |
| Small UI bits (slot counter, decrypt anim) | [components/ui/](components/ui/) |

## How it's wired

The backend got further than the product did. Convex holds the daily `quests`,
`submissions` (videos via Cloudflare Stream), and reactions (skull / salute /
fire / eye), with auth, moderation, and push notifications scaffolded in.

```
Expo (React Native) ── expo-router screens
        |
        |-- expo-camera -> record attempt -> Cloudflare Stream (video)
        |
        `-- Convex ── quests . submissions . reactions . moderation . auth . notifications
```

## Tech stack

| Layer | Choice |
|---|---|
| App | Expo SDK 54, React Native 0.81, expo-router |
| Language | TypeScript |
| Animation | Reanimated, expo-blur, expo-video |
| Backend | Convex (real-time DB + functions) |
| Auth | Better Auth + Convex |
| Video | Cloudflare Stream |
| Notifications | Expo push + Convex |

## Running it

```bash
npm install
npx convex dev   # sets up the Convex backend + env (EXPO_PUBLIC_CONVEX_URL, etc.)
npx expo start   # then open in Expo Go or a simulator
```

You'll need a Convex deployment and a Cloudflare Stream account for video uploads.

## Status

Unshipped experiment, kept around for the design work. Not maintained, not in the
app stores, and not intended to be — but the screens are real, and that's exactly
why it's still here.

Built with [Claude Code](https://claude.com/claude-code).
