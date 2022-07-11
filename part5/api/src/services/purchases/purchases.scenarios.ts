import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.PurchaseCreateArgs>({
  purchase: {
    one: {
      data: {
        status: 'init',
        user: {
          create: {
            email: 'String9506598',
            hashedPassword: 'String',
            salt: 'String',
            roles: 'String',
          },
        },
        product: {
          create: {
            price: 3262462.9041002495,
            name: 'String',
            category: 'String',
            user: {
              create: {
                email: 'String9338713',
                hashedPassword: 'String',
                salt: 'String',
                roles: 'String',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        status: 'init',
        user: {
          create: {
            email: 'String4624892',
            hashedPassword: 'String',
            salt: 'String',
            roles: 'String',
          },
        },
        product: {
          create: {
            price: 8030712.587325273,
            name: 'String',
            category: 'String',
            user: {
              create: {
                email: 'String8408171',
                hashedPassword: 'String',
                salt: 'String',
                roles: 'String',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
