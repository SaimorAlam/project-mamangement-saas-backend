export default () => ({
  port: parseInt(process.env.PORT as string, 10),
  node_env: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_OPT_secret: process.env.JWT_OTP_SECRET,
  jwt_OTP_expired_in: process.env.JWT_OTP_EXPIRED_IN || '1m',
  jwt_secret: process.env.JWT_SECRET,
  jwt_expired_in: process.env.JWT_EXPIRED_IN || '5m',
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  smtp_auth_user: process.env.SMTP_AUTH_USER,
  smtp_auth_pass: process.env.SMTP_AUTH_PASS,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  client_url: process.env.ClIENT_URL,
  loginUrl: process.env.LOGIN_URL,
  server_url: process.env.SERVER_URL,

  //Mailer config (for nodemailer)
  mail_host: process.env.MAIL_HOST,
  mail_port: parseInt(process.env.MAIL_PORT as string, 10),
  mail_secure: process.env.MAIL_SECURE === 'true',
  mail_user: process.env.MAIL_USER,
  mail_pass: process.env.MAIL_PASS,
  mail_from_name: process.env.MAIL_FROM_NAME,
  mail_from_email: process.env.MAIL_FROM_EMAIL,

  database: {
    url: process.env.DATABASE_URL,
  },

  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME,
    phoneNumber: process.env.ADMIN_PHONE,
  },

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER,
    verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
  },

  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string, 10),
    url: process.env.REDIS_CONNECTION_URL,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },



});
