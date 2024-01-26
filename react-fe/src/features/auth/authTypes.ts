import { AgeType, Gender, MealRequest, ResponseStatus, Role } from '../../common/enums';

export type Address = {
  id?: string;
  street: string;
  zipCode: string;
  city: string;
  country: string;
  invitation?: string;
};

export type AuthState = {
  invitation: Invitation | null;
};

export type CreateGroupDto = {
  id?: string;
  groupName: string;
  colorLight?: string;
  colorDark?: string;
};

export type CreateGuestDto = {
  firstName: string;
  lastName: string;
  displayName: string;
  responseStatus: ResponseStatus;
  role: Role;
  gender: Gender;
  ageType: AgeType;
  groups: string[];
};

export type CreateInvitationDto = {
  hasAddress: boolean;
  address: Address | null;
  guests: CreateGuestDto[];
};

export type CreatePdfDto = {
  token: string;
  guests: {
    displayName: string;
  }[];
};

export type Group = {
  id: string;
  groupName: string;
  colorLight?: string;
  colorDark?: string;
  title: string;
  guests: Guest[];
};

export type GuestMin = {
  id: string;
  firstName: string;
  lastName: string;
  responseStatus: ResponseStatus;
};

export type Guest = {
  displayName: string;
  role: Role;
  gender: Gender;
  ageType: AgeType;
  mealRequest: MealRequest;
  groups: Group[];
  invitation: string;
} & GuestMin;

export type Invitation = {
  id: string;
  token: string;
  isPrinted: boolean;
  hasFile: boolean;
  address: Address | null;
  guests: Guest[];
};

export type LoginData = {
  token: string;
  accessCode: string;
};

export type MessageResponse = {
  message: string;
};

export type UpdateGuestDto = {
  id: string;
  responseStatus: ResponseStatus;
  mealRequest: MealRequest;
};

export type UpdateGuestAdminDto = {
  id?: string;
  firstName: string;
  lastName: string;
  displayName: string;
  responseStatus: ResponseStatus;
  mealRequest: MealRequest;
  groups: string[];
  invitation?: string;
};

export type UpdateInvitationTokenDto = {
  id?: string;
  token: string;
};
