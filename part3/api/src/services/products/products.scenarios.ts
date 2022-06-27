import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.ProductCreateArgs>({
  product: {
    one: {
      data: {
        name: 'String',
        user: {
          create: {
            email: 'String6112824',
            hashedPassword: 'String',
            salt: 'String',
            roles: 'String',
          },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        user: {
          create: {
            email: 'String9932388',
            hashedPassword: 'String',
            salt: 'String',
            roles: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
