import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User as PrismaUser, Product as PrismaProduct, Purchase as PrismaPurchase } from '.prisma/client';
import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server/dist/functions/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
      args?: TArgs,
      obj?: { root: TParent; context: TContext; info: GraphQLResolveInfo }
    ) => Promise<Partial<TResult>> | Partial<TResult>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: number;
  Date: string;
  DateTime: string;
  JSON: Record<string, unknown>;
  JSONObject: Record<string, unknown>;
  Time: string;
  URL: any;
};

export type CreateProductInput = {
  category: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  price: Scalars['Float'];
  userId: Scalars['Int'];
};

export type CreatePurchaseInput = {
  clientSecret?: InputMaybe<Scalars['String']>;
  productId: Scalars['Int'];
  status: PaymentStatus;
  userId: Scalars['Int'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  hashedPassword: Scalars['String'];
  resetToken?: InputMaybe<Scalars['String']>;
  resetTokenExpiresAt?: InputMaybe<Scalars['DateTime']>;
  roles: Array<InputMaybe<Scalars['String']>>;
  salt: Scalars['String'];
  stripeClientSecret?: InputMaybe<Scalars['String']>;
  subscriptionId?: InputMaybe<Scalars['String']>;
  subscriptionName?: InputMaybe<Scalars['String']>;
  subscriptionStatus?: InputMaybe<PaymentStatus>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createProduct: Product;
  createPurchase: Purchase;
  createUser: User;
  deleteProduct: Product;
  deletePurchase: Purchase;
  deleteUser: User;
  updateProduct: Product;
  updatePurchase: Purchase;
  updateUser: User;
};


export type MutationcreateProductArgs = {
  input: CreateProductInput;
};


export type MutationcreatePurchaseArgs = {
  input: CreatePurchaseInput;
};


export type MutationcreateUserArgs = {
  input: CreateUserInput;
};


export type MutationdeleteProductArgs = {
  id: Scalars['Int'];
};


export type MutationdeletePurchaseArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteUserArgs = {
  id: Scalars['Int'];
};


export type MutationupdateProductArgs = {
  id: Scalars['Int'];
  input: UpdateProductInput;
};


export type MutationupdatePurchaseArgs = {
  id: Scalars['Int'];
  input: UpdatePurchaseInput;
};


export type MutationupdateUserArgs = {
  id: Scalars['Int'];
  input: UpdateUserInput;
};

export type PaymentStatus =
  | 'failed'
  | 'init'
  | 'success';

export type Product = {
  __typename?: 'Product';
  category: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  imageUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  owned?: Maybe<Scalars['Boolean']>;
  price: Scalars['Float'];
  user: User;
  userId: Scalars['Int'];
};

export type Purchase = {
  __typename?: 'Purchase';
  clientSecret?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  product: Product;
  productId: Scalars['Int'];
  status: PaymentStatus;
  user: User;
  userId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  product?: Maybe<Product>;
  products: Array<Product>;
  purchase?: Maybe<Purchase>;
  purchases: Array<Purchase>;
  redwood?: Maybe<Redwood>;
  subscriptions: Array<Subscription>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryproductArgs = {
  id: Scalars['Int'];
};


export type QueryproductsArgs = {
  category?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['Int']>;
};


export type QuerypurchaseArgs = {
  id: Scalars['Int'];
};


export type QuerypurchasesArgs = {
  userId?: InputMaybe<Scalars['Int']>;
};


export type QueryuserArgs = {
  id: Scalars['Int'];
};

export type Redwood = {
  __typename?: 'Redwood';
  currentUser?: Maybe<Scalars['JSON']>;
  prismaVersion?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  currency: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  price: Scalars['Int'];
};

export type UpdateProductInput = {
  category?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  userId?: InputMaybe<Scalars['Int']>;
};

export type UpdatePurchaseInput = {
  clientSecret?: InputMaybe<Scalars['String']>;
  productId?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<PaymentStatus>;
  userId?: InputMaybe<Scalars['Int']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']>;
  hashedPassword?: InputMaybe<Scalars['String']>;
  resetToken?: InputMaybe<Scalars['String']>;
  resetTokenExpiresAt?: InputMaybe<Scalars['DateTime']>;
  roles: Array<InputMaybe<Scalars['String']>>;
  salt?: InputMaybe<Scalars['String']>;
  stripeClientSecret?: InputMaybe<Scalars['String']>;
  subscriptionId?: InputMaybe<Scalars['String']>;
  subscriptionName?: InputMaybe<Scalars['String']>;
  subscriptionStatus?: InputMaybe<PaymentStatus>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  hashedPassword: Scalars['String'];
  id: Scalars['Int'];
  products: Array<Maybe<Product>>;
  resetToken?: Maybe<Scalars['String']>;
  resetTokenExpiresAt?: Maybe<Scalars['DateTime']>;
  roles: Array<Maybe<Scalars['String']>>;
  salt: Scalars['String'];
  stripeClientSecret?: Maybe<Scalars['String']>;
  subscriptionId?: Maybe<Scalars['String']>;
  subscriptionName?: Maybe<Scalars['String']>;
  subscriptionStatus?: Maybe<PaymentStatus>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateProductInput: CreateProductInput;
  CreatePurchaseInput: CreatePurchaseInput;
  CreateUserInput: CreateUserInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  Mutation: ResolverTypeWrapper<{}>;
  PaymentStatus: PaymentStatus;
  Product: ResolverTypeWrapper<PrismaProduct>;
  Purchase: ResolverTypeWrapper<PrismaPurchase>;
  Query: ResolverTypeWrapper<{}>;
  Redwood: ResolverTypeWrapper<Redwood>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  URL: ResolverTypeWrapper<Scalars['URL']>;
  UpdateProductInput: UpdateProductInput;
  UpdatePurchaseInput: UpdatePurchaseInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<PrismaUser>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: Scalars['BigInt'];
  Boolean: Scalars['Boolean'];
  CreateProductInput: CreateProductInput;
  CreatePurchaseInput: CreatePurchaseInput;
  CreateUserInput: CreateUserInput;
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  Mutation: {};
  Product: PrismaProduct;
  Purchase: PrismaPurchase;
  Query: {};
  Redwood: Redwood;
  String: Scalars['String'];
  Subscription: {};
  Time: Scalars['Time'];
  URL: Scalars['URL'];
  UpdateProductInput: UpdateProductInput;
  UpdatePurchaseInput: UpdatePurchaseInput;
  UpdateUserInput: UpdateUserInput;
  User: PrismaUser;
};

export type requireAuthDirectiveArgs = {
  roles?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type requireAuthDirectiveResolver<Result, Parent, ContextType = RedwoodGraphQLContext, Args = requireAuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type skipAuthDirectiveArgs = { };

export type skipAuthDirectiveResolver<Result, Parent, ContextType = RedwoodGraphQLContext, Args = skipAuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JSONObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type MutationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationcreateProductArgs, 'input'>>;
  createPurchase?: Resolver<ResolversTypes['Purchase'], ParentType, ContextType, RequireFields<MutationcreatePurchaseArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationcreateUserArgs, 'input'>>;
  deleteProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationdeleteProductArgs, 'id'>>;
  deletePurchase?: Resolver<ResolversTypes['Purchase'], ParentType, ContextType, RequireFields<MutationdeletePurchaseArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationdeleteUserArgs, 'id'>>;
  updateProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationupdateProductArgs, 'id' | 'input'>>;
  updatePurchase?: Resolver<ResolversTypes['Purchase'], ParentType, ContextType, RequireFields<MutationupdatePurchaseArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationupdateUserArgs, 'id' | 'input'>>;
};

export type ProductResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owned?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PurchaseResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Purchase'] = ResolversParentTypes['Purchase']> = {
  clientSecret?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PaymentStatus'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryproductArgs, 'id'>>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, Partial<QueryproductsArgs>>;
  purchase?: Resolver<Maybe<ResolversTypes['Purchase']>, ParentType, ContextType, RequireFields<QuerypurchaseArgs, 'id'>>;
  purchases?: Resolver<Array<ResolversTypes['Purchase']>, ParentType, ContextType, Partial<QuerypurchasesArgs>>;
  redwood?: Resolver<Maybe<ResolversTypes['Redwood']>, ParentType, ContextType>;
  subscriptions?: Resolver<Array<ResolversTypes['Subscription']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type RedwoodResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Redwood'] = ResolversParentTypes['Redwood']> = {
  currentUser?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  prismaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  currency?: SubscriptionResolver<ResolversTypes['String'], "currency", ParentType, ContextType>;
  description?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "description", ParentType, ContextType>;
  id?: SubscriptionResolver<ResolversTypes['ID'], "id", ParentType, ContextType>;
  name?: SubscriptionResolver<ResolversTypes['String'], "name", ParentType, ContextType>;
  price?: SubscriptionResolver<ResolversTypes['Int'], "price", ParentType, ContextType>;
};

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export interface URLScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export type UserResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hashedPassword?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  products?: Resolver<Array<Maybe<ResolversTypes['Product']>>, ParentType, ContextType>;
  resetToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resetTokenExpiresAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  roles?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  salt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stripeClientSecret?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subscriptionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subscriptionName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subscriptionStatus?: Resolver<Maybe<ResolversTypes['PaymentStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = RedwoodGraphQLContext> = {
  BigInt?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  Purchase?: PurchaseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Redwood?: RedwoodResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Time?: GraphQLScalarType;
  URL?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = RedwoodGraphQLContext> = {
  requireAuth?: requireAuthDirectiveResolver<any, any, ContextType>;
  skipAuth?: skipAuthDirectiveResolver<any, any, ContextType>;
};
