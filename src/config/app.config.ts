export default () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  // keys: {
  //   privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
  // },
});
