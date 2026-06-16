import {
    type OptionalRestArgsOrSkip,
    useQuery,
} from 'convex/react';
import type { FunctionReference } from 'convex/server';

import { makeUseQueryWithStatus } from 'convex-helpers/react';
import { useQueries } from 'convex-helpers/react/cache/hooks';
import { authClient } from '@/lib/auth-client';

/**
 * A wrapper around useQuery that automatically checks authentication state.
 * If the user is not authenticated, the query is skipped.
 */
export function useAuthenticatedQuery<Query extends FunctionReference<'query'>>(
    query: Query,
    args: OptionalRestArgsOrSkip<Query>[0] | 'skip'
) {
    const { data: session } = authClient.useSession();
    const isAuthenticated = !!session?.user;
    return useQuery(query, isAuthenticated ? args : 'skip');
}

// This is a wrapper around useQueries that automatically checks authentication state.
export const useQueryWithStatus = makeUseQueryWithStatus(useQueries);

/**
 * A wrapper around useQueryWithStatus that automatically checks authentication state.
 * If the user is not authenticated, the query is skipped.
 */
export function useAuthenticatedQueryWithStatus<
    Query extends FunctionReference<'query'>,
>(query: Query, args: OptionalRestArgsOrSkip<Query>[0] | 'skip') {
    const { data: session } = authClient.useSession();
    const isAuthenticated = !!session?.user;
    return useQueryWithStatus(query, isAuthenticated ? args : 'skip');
}
