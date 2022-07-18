export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  subscriptionStatus?: InputMaybe<SubscriptionStatus>;
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelSubscription: Scalars['Boolean'];
  createProduct: Product;
  createSubscription: Scalars['String'];
  createUser: User;
  deleteProduct: Product;
  deleteUser: User;
  updateProduct: Product;
  updateUser: User;
};


export type MutationcancelSubscriptionArgs = {
  id: Scalars['String'];
};


export type MutationcreateProductArgs = {
  input: CreateProductInput;
};


export type MutationcreateSubscriptionArgs = {
  id: Scalars['String'];
};


export type MutationcreateUserArgs = {
  input: CreateUserInput;
};


export type MutationdeleteProductArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteUserArgs = {
  id: Scalars['Int'];
};


export type MutationupdateProductArgs = {
  id: Scalars['Int'];
  input: UpdateProductInput;
};


export type MutationupdateUserArgs = {
  id: Scalars['Int'];
  input: UpdateUserInput;
};

export type Product = {
  __typename?: 'Product';
  category: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  imageUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  price: Scalars['Float'];
  user: User;
  userId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  product?: Maybe<Product>;
  products: Array<Product>;
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

export type SubscriptionStatus =
  | 'failed'
  | 'init'
  | 'success';

export type UpdateProductInput = {
  category?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
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
  subscriptionStatus?: InputMaybe<SubscriptionStatus>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  hashedPassword: Scalars['String'];
  id: Scalars['Int'];
  product: Array<Maybe<Product>>;
  resetToken?: Maybe<Scalars['String']>;
  resetTokenExpiresAt?: Maybe<Scalars['DateTime']>;
  roles: Array<Maybe<Scalars['String']>>;
  salt: Scalars['String'];
  stripeClientSecret?: Maybe<Scalars['String']>;
  subscriptionId?: Maybe<Scalars['String']>;
  subscriptionName?: Maybe<Scalars['String']>;
  subscriptionStatus?: Maybe<SubscriptionStatus>;
};

export type ProductsQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['Int']>;
  category?: InputMaybe<Scalars['String']>;
}>;


export type ProductsQuery = { __typename?: 'Query', products: Array<{ __typename?: 'Product', id: number, name: string, category: string, description?: string | null, price: number, imageUrl?: string | null }> };

export type SubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type SubscriptionsQuery = { __typename?: 'Query', subscriptions: Array<{ __typename?: 'Subscription', id: string, name: string, price: number, currency: string, description?: string | null }> };

export type CreateSubscriptionMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type CreateSubscriptionMutation = { __typename?: 'Mutation', createSubscription: string };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', name: string, description?: string | null, price: number } };

export type CancelSubscriptionMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type CancelSubscriptionMutation = { __typename?: 'Mutation', cancelSubscription: boolean };
