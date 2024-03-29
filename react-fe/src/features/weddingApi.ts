import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authActions } from './auth/authSlice';
import {
  Address,
  CreateGroupDto,
  CreateInvitationDto,
  CreatePdfDto,
  Group,
  Guest,
  GuestMin,
  Invitation,
  MessageResponse,
  UpdateGuestAdminDto,
  UpdateGuestDto,
  UpdateInvitationTokenDto,
} from './auth/authTypes';
import { ResponseStatus } from '../common/enums';

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
    // Address
    addAddress: builder.mutation<Address, Address>({
      query: (body) => ({
        url: '/addresses',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Address', id: 'AddressLIST' },
        { type: 'Invitation', id: 'InvitationLIST' },
      ],
    }),
    getAddress: builder.query<Address, string>({
      query: (id) => `/addresses/${id}`,
      providesTags: (_, __, id) => [{ type: 'Address', id }],
    }),
    updateAddress: builder.mutation<Address, Partial<Address>>({
      query: ({ id, ...patch }) => ({
        url: `/addresses/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Address', id },
        { type: 'Invitation', id: 'InvitationLIST' },
      ],
    }),
    deleteAddress: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Address', id },
        { type: 'Invitation', id: 'InvitationLIST' },
      ],
    }),
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
    getGuest: builder.query<Guest, string>({
      query: (id) => `/guests/${id}`,
      providesTags: (_, __, id) => [{ type: 'Guest', id }],
    }),
    getGuestsFromCommonGroups: builder.query<GuestMin[], void>({
      query: () => '/guests/common',
      transformResponse: (response: GuestMin[]): GuestMin[] => {
        const guests: GuestMin[] = [...response, { id: '1', firstName: 'Frank-Walter', lastName: 'Steinmeier', responseStatus: ResponseStatus.CANCELED }];
        return guests.slice().sort((a, b) => (a.firstName < b.firstName ? -1 : a.lastName < b.lastName ? -1 : 1));
      },
    }),
    updateGuestAdmin: builder.mutation<MessageResponse, UpdateGuestAdminDto>({
      query: ({ id, ...patch }) => ({
        url: `/guests/admin/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Guest', id },
        { type: 'Invitation', id: 'InvitationLIST' },
      ],
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
    getInvitation: builder.query<Invitation, string>({
      query: (id) => `/invitations/${id}`,
      providesTags: (_, __, id) => [{ type: 'Invitation', id }],
    }),
    updateInvitation: builder.mutation<unknown, UpdateInvitationTokenDto>({
      query: ({ id, ...patch }) => ({
        url: `/invitations/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Invitation', id }],
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
  useAddAddressMutation,
  useGetAddressQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useAddGroupMutation,
  useGetGroupsQuery,
  useGetGroupQuery,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetGuestsQuery,
  useGetGuestQuery,
  useGetGuestsFromCommonGroupsQuery,
  useUpdateGuestsMutation,
  useUpdateGuestAdminMutation,
  useDeleteGuestMutation,
  useAddInvitationMutation,
  useGetInvitationsQuery,
  useGetInvitationQuery,
  useUpdateInvitationMutation,
  useDeleteInvitationMutation,
  useAddFilesMutation,
} = weddingApi;

export default weddingApi;
