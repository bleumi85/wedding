import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authActions } from './auth/authSlice';
import { Group, Guest, Invitation } from './auth/authTypes';

const baseUrl = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
});

const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'GET',
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(authActions.logout()).catch((err) => console.error(err));
    }
  }

  return result;
};

function providesList<R extends { id: string | number }[], T extends string>(resultWithIds: R | undefined, tagType: T) {
  return resultWithIds
    ? [{ type: tagType, id: `${tagType}LIST` }, ...resultWithIds.map(({ id }) => ({ type: tagType, id }))]
    : [{ type: tagType, id: `${tagType}LIST` }];
}

const weddingApi = createApi({
  reducerPath: 'weddingApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['Group', 'Guest', 'Invitation'],
  endpoints: (builder) => ({
    // Groups
    getGroups: builder.query<Group[], void>({
      query: () => '/groups',
      providesTags: (result) => providesList(result, 'Group'),
    }),
    // Guests
    getGuests: builder.query<Guest[], void>({
      query: () => '/guests',
      transformResponse: (response: Guest[]): Guest[] => {
        return response.map((guest) => {
          const modifiedGroups = guest.groups.map((group) => {
            return { ...group, title: group.groupName };
          });
          return { ...guest, groups: modifiedGroups };
        });
      },
      providesTags: (result) => providesList(result, 'Guest'),
    }),
    // Invitations
    getInvitations: builder.query<Invitation[], void>({
      query: () => '/invitations',
      providesTags: (result) => providesList(result, 'Invitation'),
    }),
  }),
});

export const { useGetGroupsQuery, useGetGuestsQuery, useGetInvitationsQuery } = weddingApi;

export default weddingApi;
