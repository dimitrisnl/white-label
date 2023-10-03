# White Label

This is a ["white-label"](https://en.wikipedia.org/wiki/White-label_product) project I wanted to create to test various ideas. It's a full-stack Typescript, powered by Remix.

---

### Technologies

- **Remix**
- **PNPM Workspaces**
- **Effect-TS**
- **RadixUI**
- **Zapatos**

As for the rest, I'll be using `PostgreSQL`, with the idea of dockerizing it all and deploying on Digital Ocean. [Postmark](https://postmarkapp.com/) was also very reliable in the past for me, so this would be my SMTP service of choice. For the dev environment, I use [Mailtrap](https://mailtrap.io/).

As for the design approach, I don't use any specific (like DDD), although I try to make it as flexible as possible.

### Goals & Features

#### Teams

Users can belong to many organizations and can have different roles in each. Here's a great article about that decision, called [Teams should be an MVP feature!](https://blog.bullettrain.co/teams-should-be-an-mvp-feature/). In short, even the most trivial SASS app will find a need down the road. I worked on a start-up years ago, that wanted to introduce Teams (and Billing) after years of operation and it was super painful. It's a relatively small change early on that can eliminate a ton of complexity in the future.

#### Membership Invitations

Essential when using Teams. Send invites, assign roles, accept, revoke, decline, etc.

#### Multi-tenancy

That's a big one. I have no idea how to do this, so seems like the ideal task to pick up.

#### Billing

I would like to work with [Paddle](https://www.paddle.com/) on this one. A Team can have different plans, with different limits each.

#### 2FA & PassKeys

2FA is standard, and Passkeys are the new hotness. Some resources on them.

- [Clearing up some misconceptions about Passkeys](https://www.stavros.io/posts/clearing-up-some-passkeys-misconceptions)
- [Passwordless login with passkeys](https://developers.google.com/identity/passkeys)

#### ... other stuff

More ideas will be added in the GitHub Projects tab, where I'll be tracking everything.

### Testing

- The Back-end will have tests for each use-case with Vitest
- The Front-end will test everything with [React-testing-library](https://testing-library.com/docs/react-testing-library/intro/)
- There will be a 3rd package, called `e2e` which will test both

### License

MIT
