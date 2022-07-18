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

export type Mutation = {
  __typename?: 'Mutation';
  createSubscription: Scalars['String'];
};


export type MutationcreateSubscriptionArgs = {
  id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  redwood?: Maybe<Redwood>;
  subscriptions: Array<Subscription>;
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

export type SubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type SubscriptionsQuery = { __typename?: 'Query', subscriptions: Array<{ __typename?: 'Subscription', id: string, name: string, price: number, currency: string, description?: string | null }> };

export type CreateSubscriptionMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type CreateSubscriptionMutation = { __typename?: 'Mutation', createSubscription: string };
