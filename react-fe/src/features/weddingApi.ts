import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authActions } from './auth/authSlice';
import { CreateGroupDto, CreateInvitationDto, CreatePdfDto, Group, Guest, Invitation, MessageResponse, UpdateGuestDto } from './auth/authTypes';

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
  tagTypes: ['Address', 'File', 'Group', 'Guest', 'Invitation'],
  endpoints: (builder) => ({
    // Groups
    addGroup: builder.mutation<Group, CreateGroupDto>({
      query: (body) => ({
        url: '/groups',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Group', id: 'GroupLIST' }],
    }),
    getGroups: builder.query<Group[], void>({
      query: () => '/groups',
      providesTags: (result) => providesList(result, 'Group'),
    }),
    getGroup: builder.query<Group, string>({
      query: (id) => `/groups/${id}`,
      providesTags: (_, __, id) => [{ type: 'Group', id }],
    }),
    updateGroup: builder.mutation<Group, Partial<CreateGroupDto>>({
      query: ({ id, ...patch }) => ({
        url: `/groups/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Group', id }],
    }),
    deleteGroup: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Group', id }],
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
    updateGuests: builder.mutation<MessageResponse, UpdateGuestDto[]>({
      query: (body) => ({
        url: '/guests',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [
        { type: 'Guest', id: 'GuestLIST' },
        { type: 'Invitation', id: 'InvitationLIST' },
      ],
    }),
    deleteGuest: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/guests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Guest', id }],
    }),
    // Invitations
    addInvitation: builder.mutation<MessageResponse, CreateInvitationDto>({
      query: (body) => ({
        url: '/invitations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Invitation', id: 'InvitationLIST' },
        { type: 'Address', id: 'AddressLIST' },
        { type: 'Guest', id: 'GuestLIST' },
        { type: 'Group', id: 'GroupLIST' },
      ],
    }),
    getInvitations: builder.query<Invitation[], void>({
      query: () => '/invitations',
      providesTags: (result) => providesList(result, 'Invitation'),
    }),
    deleteInvitation: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/invitations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Invitation', id },
        { type: 'Guest', id: 'GuestLIST' },
        { type: 'Group', id: 'GroupLIST' },
      ],
    }),
    // Files
    addFiles: builder.mutation<MessageResponse, CreatePdfDto[]>({
      query: (body) => ({
        url: '/files',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Invitation', id: 'InvitationLIST' }],
    }),
  }),
});

export const {
  useAddGroupMutation,
  useGetGroupsQuery,
  useGetGroupQuery,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetGuestsQuery,
  useUpdateGuestsMutation,
  useDeleteGuestMutation,
  useAddInvitationMutation,
  useGetInvitationsQuery,
  useDeleteInvitationMutation,
  useAddFilesMutation,
} = weddingApi;

export default weddingApi;
