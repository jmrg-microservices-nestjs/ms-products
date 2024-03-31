import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  NODE_ENV: 'development' | 'production';
  DATABASE_URL: string;
}

const envVarsSchema: Joi.ObjectSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  DATABASE_URL: Joi.string().required(),
}).unknown(true);

const { error, value } = envVarsSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,
  DATABASE_URL: envVars.DATABASE_URL,
};
