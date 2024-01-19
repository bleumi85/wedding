export enum AgeType {
  ADULT = 'Erwachsener',
  CHILD = 'Kind',
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
