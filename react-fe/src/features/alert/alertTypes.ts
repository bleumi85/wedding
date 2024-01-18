import { AlertStatus } from '../../common/enums';

export type AlertPayload = {
  id?: string;
  description?: string;
  title?: string;
  duration?: number;
  isClosable?: boolean;
  type?: 'string' | 'json';
};

export type AlertState = {
  id: string;
  status: AlertStatus | null;
  description?: string;
  title?: string;
  duration?: number | null;
  isClosable?: boolean;
  type: 'string' | 'json';
};

export { AlertStatus };

export function isInstanceOfAlertPayload(object: unknown): object is AlertPayload {
  return object !== null && typeof object === 'object' && 'description' in object;
}
