# White Label

![https://i.giphy.com/media/oCjCwnuLpiWbfMb1UA/giphy.webp](https://i.giphy.com/media/oCjCwnuLpiWbfMb1UA/giphy.webp)

**Update**: I'll re-write everything and drop Adonis.js. I'll try to make the full-stack JS dream a reality using Remix. Right now it feels odd to validate my data twice, and I find myself dropping more and more of the out-of-the-box AdonisJS features.

---

### 1. Motivation

This is a ["white-label"](https://en.wikipedia.org/wiki/White-label_product) project I wanted to create to test various ideas. Currently, only the Back-end can be found under `/server`. That said, it's an in-progress project, and things can change rapidly.

At first, it started as experimentation with [Adonis.js](https://adonisjs.com/) but a [Remix](https://remix.run/) Front-end will accompany it (soon) so that I can better understand the trade-offs of using Remix instead of [Next.js](https://nextjs.org/).

#### Back-end

From a glance, Adonis.js seems to have everything you need for a quick MVP win. First-party packages include:

- [Validator](https://docs.adonisjs.com/guides/validator/introduction) (replacing zod, io-ts, etc)
- [ORM](https://docs.adonisjs.com/guides/models/introduction) (replacing Prisma, Drizzle)
- [Mailer](https://docs.adonisjs.com/guides/mailer) (configured on top of NodeMailer)
- [Bouncer](https://docs.adonisjs.com/guides/authorization) (ACL framework with actions and policies)
- [Drive](https://docs.adonisjs.com/guides/drive) (an abstraction on top of common storage services, like S3, GCS, etc)
- ... a whole lot more that couple well and work flawlessly with TypeScript

It also has great [documentation](https://docs.adonisjs.com/guides/introduction) & its [own video tutorials](https://adocasts.com/).

A very underappreciated framework, I might say. So in this project, I take it for a spin.

As for the rest, I'll be using PostgreSQL & Redis, with the idea of dockerizing it all and deploying on Digital Ocean. [Postmark](https://postmarkapp.com/) was also very reliable in the past for me, so this would be my SMTP service of choice. For the dev environment, I use [Mailtrap](https://mailtrap.io/).

As for the design approach, I don't use any specific (like DDD), although I try to make it as flexible as possible. The project surface is small. I don't have any actual Domain objects, as there's no business to model here. I have this in mind, and things might change. Again it's a playground app, so it's a good problem.

#### Front-end

I focus on the Front-end, and Remix has been on my radar for a bit. I built most of my projects with Next.js (including my Blog rewrite), but I'm not a huge fan of [React Server Components](https://nextjs.org/docs/getting-started/react-essentials#server-components). I find the `Action & Loader` mental model simpler to work with.

My plan here is to understand Remix better, and maybe feel more comfortable adding it as a skill under my belt.

As for styling, I'll use [TailwindCSS](https://tailwindcss.com/) and [RadixUI](https://www.radix-ui.com/). Most of the components will probably come from the [shadcn/ui collection](https://ui.shadcn.com/)

### 2. Goals & Features

#### Teams

Users can belong to many organizations and can have different roles in each. Here's a great article about that decision, called [Teams should be an MVP feature!](https://blog.bullettrain.co/teams-should-be-an-mvp-feature/). In short, even the most trivial SASS app will find a need down the road. I worked on a start-up years ago, that wanted to introduce Teams (and Billing) after years of operation and it was super painful. It's a relatively small change early on that can eliminate a ton of complexity in the future.

#### Membership Invitations

Essential when using Teams. Send invites, assign roles, accept, revoke, decline, etc.

#### Multi-tenancy

That's a big one. I have no idea how to do this, so seems like the ideal task to pick up. I'm curious how flexible Adonis will be with this. Will the ORM or migration tool be an obstacle?

#### Billing

I would like to work with [Paddle](https://www.paddle.com/) on this one. A Team can have different plans, with different limits each.

#### 2FA & PassKeys

2FA is standard, and Passkeys are the new hotness. Some resources on them.

- [Clearing up some misconceptions about Passkeys](https://www.stavros.io/posts/clearing-up-some-passkeys-misconceptions)
- [Passwordless login with passkeys](https://developers.google.com/identity/passkeys)

#### ... other stuff

More ideas will be added in the GitHub Projects tab, where I'll be tracking everything.

### 3. Functional Programming

Hmm, this is weird. I've been getting down the FP rabbit hole, but Adonis uses classes a lot, so I have to make a decision here. I have sprinkled some [`Either`](https://gcanti.github.io/fp-ts/modules/Either.ts.html) in my services, with the plan to re-write it with [`TaskEither`](https://gcanti.github.io/fp-ts/modules/TaskEither.ts.html) and such.

I will continue with the OOP approach for now, and decide down the road.

### 4. Testing

- The Back-end. has tests for each use-case
- The Front-end will test everything with [React-testing-library](https://testing-library.com/docs/react-testing-library/intro/)
- There will be a 3rd package, called `e2e` which will test both

### 5. Why not X

#### Why not Nest.js

I don't find Nest as polished as Adonis. For example, with Nest, I had to pull `passport` and handle all the quirks on my own. Adonis nicely abstracts everything, and even scaffolds some files. Check the [relevant documentation](https://docs.adonisjs.com/guides/auth/introduction), it's fantastic.

I also don't enjoy using decorators. I can ignore them in the Model definition of Adonis, but I dislike it everywhere else.

But ultimately, I feel like Nest.js lacks many features of Adonis.

#### Why not full-stack Remix/Next.js

This should be ideal really, and I might explore this option if I find myself working against the first-party packages of Adonis. For example, if I decide against using an ORM, then this option is more attractive. For now, I don't want to waste my time configuring and debugging common solved use cases.

There's another reason. I wouldn't trust my full-stack project with Next.js as deploying to other providers can be super tricky. Next.js is the flagship product of Vercel, so it will always get first-class support. I can't guarantee that certain functionality (cron?) can work as flawlessly with other providers. You don't want surprises with your Back-end stack. Also pricing for such services can be ridiculous.

But a full-stack Remix/Express, with type sharing, could be pretty fun to work with. Anyway, for now, Adonis allows me to move fast, and I like it.

#### Why not GraphQL?

I would like to explore this option! I structure my code in a way that can be turned into resolvers. Unsure if this will happen soon, but I thought about it.

### 6. In the era of AI, are you still toying with Full-stack apps?

Sue me

### 7. License

MIT
