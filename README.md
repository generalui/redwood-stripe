# Intro

**Who never wanted to build a marketplace for [fill in the blank]?**

The goal of this tutorial is do that using redwood and stripe, if you want the low down about redwood, spend 100 seconds watching [this video](https://youtu.be/o5Mwa_TJ3HM) and if you are left wondering, but why redwood rather than some other framework? Then, I suggest you look at the [why redwood rather than some other framework?](https://community.redwoodjs.com/t/but-why-redwood-rather-than-some-other-framework-remix-blitz-vue-nextjs-gatsby-sveltekit-11ty-nuxtjs/2957) page! Basically Redwoodjs is your medicine against js tech stack fatigue.

The goal of this tutorial is to create a boilerplate application that is using the stripe API to build a marketplace with subscriptions. Yes, each seller is going to need to buy a subscription to be able to sell on our platform. We're a greedy bunch. Note that this tutorial is not about making things pretty, this is a 0 css tutorial, it might hurt your eyes, and a good remedy for that would be to us Chakra-ui that I highly recommend and fits very nicely with [Redwood](https://redwoodjs.com/docs/cli-commands#setup-ui) ❤️.

Note: We'll be using Typescript for this tutorial, doesn't mean that you have to use it. You could strip out the typescript parts and use the `yarn create redwood-app` without the `--ts` option, I won't judge you. Other people might...

Ok, now that we know we're going to buy an Island in the Pacific very soon, we need to divide and conquer and figure out what are the different steps going to be:

[Part 1:](part1/readme.md)

- Setup & Authentication
- List Subscriptions
- Subscribe

[Part 2:](part2/readme.md)

- View my subscription
- Cancel or change my subscription
- Add products
- List products by category

[Part 3:](part3/readme.md)

- Buy products
- View my products

[Part 4:](part4/readme.md)

- Check subscription validity
- Subscriber payouts (with commission)

[Part 5:](part5/readme.md)

- (admin) Payment list
- (admin) make payment
- (admin) Subscription list
- 🏝️
