import { Role } from '../../common/enums';

export type Address = {
  id: string;
  street: string;
  zipCode: string;
  city: string;
  country: string;
};

export type AuthState = {
  invitation: Invitation | null;
};

export type Group = {
  id: string;
  groupName: string;
  colorLight?: string;
  colorDark?: string;
  title: string;
  guests: Guest[];
};

export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  // responseStatus: ResponseStatus;
  role: Role;
  groups: Group[];
};

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
