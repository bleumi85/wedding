export enum AgeType {
  ADULT,
  CHILD,
}

export enum Gender {
  MALE,
  FEMALE,
}

export enum MealRequest {
  NONE = 'Keine Sonderwünsche',
  PESCETARIAN = 'Pescetarier',
  VEGETARIAN = 'Vegetarier',
  VEGAN = 'Veganer',
}

export enum NodeEnv {
  DEV = 'development',
  PROD = 'production',
}

export enum ResponseStatus {
  OPEN = 'Offen',
  CONFIRMED = 'Zugesagt',
  CANCELED = 'Abgesagt',
}

export enum Role {
  ADMIN,
  GUEST,
  WITNESS,
}
