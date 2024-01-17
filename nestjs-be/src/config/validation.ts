import { NodeEnv } from '@utils/enums';
import Joi from 'joi';

const validLogLevels = ['log', 'debug', 'error', 'fatal', 'verbose', 'warn'];

const logLevelsStringSchema = Joi.string().custom((value, helpers) => {
  const levels: string[] = value.split(',').map((level: string) => level.trim().toLowerCase());

  const uniqueLevels = [...new Set(levels)]; // Remove duplicates

  const invalidLevels = uniqueLevels.filter((level) => !validLogLevels.includes(level));

  if (invalidLevels.length > 0) {
    return helpers.error('any.invalid', { values: invalidLevels, valids: validLogLevels });
  }

  return uniqueLevels.join(',');
}, 'custom validation');

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid(NodeEnv.DEV, NodeEnv.PROD).default(NodeEnv.DEV),
  PORT: Joi.number().required(),
  SHOW_SWAGGER: Joi.boolean().required(),
  LOG_LEVELS: logLevelsStringSchema.required(),
  // Postgres
  POSTGRES_HOST: Joi.string().default('127.0.0.1'),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_SHOW_DEBUG: Joi.boolean().default(false),
  // JWT
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXP_TIME: Joi.number().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXP_TIME: Joi.number().required(),
});
