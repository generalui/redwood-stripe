import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        email: 'String9320554',
        hashedPassword: 'String',
        salt: 'String',
        roles: 'String',
      },
    },
    two: {
      data: {
        email: 'String7372845',
        hashedPassword: 'String',
        salt: 'String',
        roles: 'String',
      },
    },
  },
})

export type StandardScenario = typeof standard
