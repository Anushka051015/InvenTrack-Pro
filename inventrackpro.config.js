/**
 * InvenTrack Pro Configuration
 * 
 * This file contains application-wide configuration settings.
 * Environment-specific settings can be defined in .env files.
 */

module.exports = {
  // Application settings
  app: {
    name: 'InvenTrack Pro',
    version: '1.0.0',
    description: 'Professional inventory management solution',
    author: 'Your Company Name',
    website: 'https://yourcompany.com',
  },

  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    host: '0.0.0.0',
    api: {
      prefix: '/api',
      version: 'v1',
    },
  },

  // Client configuration
  client: {
    rootDir: 'client',
    buildDir: 'client/dist',
    assetsDir: 'client/assets',
  },

  // Development options
  development: {
    enableLogging: true,
    logLevel: 'info',
  },

  // Production options
  production: {
    enableCompression: true,
    cacheControl: true,
  },
};