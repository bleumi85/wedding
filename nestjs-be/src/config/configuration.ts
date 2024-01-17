export const configuration = () => ({
  app: {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10),
    showSwagger: JSON.parse(process.env.SHOW_SWAGGER),
  },
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expTime: parseInt(process.env.JWT_ACCESS_TOKEN_EXP_TIME, 10),
    },
    refresh: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expTime: parseInt(process.env.JWT_REFRESH_TOKEN_EXP_TIME, 10),
    },
  },
});
