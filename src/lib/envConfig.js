const envConfig = {
    dbURI: String(process.env.MONGODB_URI),
    tokenSecret: String(process.env.ACCESS_TOKEN_SECRET),
    tokenExpiry: String(process.env.ACCESS_TOKEN_EXPIRY),
    nodeEnv: String(process.env.NODE_ENV),
}

export default envConfig;