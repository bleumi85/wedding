export enum AgeType {
  ADULT = 'Erwachsener',
  CHILD = 'Kind',
}

export enum AlertStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  LOADING = 'loading',
}

export enum Gender {
  MALE = 'm',
  FEMALE = 'w',
}

export enum MealRequest {
  NONE = 'Keine Sonderwünsche',
  PESCETARIAN = 'Pescetarier',
  VEGETARIAN = 'Vegetarier',
  VEGAN = 'Veganer',
}

export enum ResponseStatus {
  OPEN = 'Offen',
  CONFIRMED = 'Zugesagt',
  CANCELED = 'Abgesagt',
}

export enum Role {
  ADMIN,
  GUEST,
  BEST_MAN,
}

export enum TokenStatus {
  VALIDATING,
  VALID,
  INVALID,
  EMPTY,
}
