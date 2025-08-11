// Netlify Function for database migrations
const ResponseHelper = require('../utils/response');
const DatabaseHelper = require('../utils/database');

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return ResponseHelper.success({}, 200);
  }

  if (event.httpMethod !== 'POST') {
    return ResponseHelper.error('Method not allowed', 405);
  }

  try {
    const body = JSON.parse(event.body);
    const { action = 'push', force = false } = body;

    // Validate action
    const validActions = ['push', 'generate', 'reset'];
    if (!validActions.includes(action)) {
      return ResponseHelper.validationError(`Invalid action. Must be one of: ${validActions.join(', ')}`);
    }

    const results = {
      action,
      timestamp: new Date().toISOString(),
      results: {},
      success: false,
    };

    try {
      const prisma = DatabaseHelper.getPrismaClient();

      switch (action) {
        case 'push':
          // Push schema to database
          const { PrismaClient } = require('@prisma/client');
          const prismaClient = new PrismaClient();
          
          try {
            // This is a simplified approach - in production, you'd use proper migrations
            await prismaClient.$executeRaw`
              CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uid TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                displayName TEXT NOT NULL,
                photoURL TEXT,
                role TEXT DEFAULT 'user',
                subscription TEXT,
                profile TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT,
                lastLoginAt TEXT
              )
            `;

            await prismaClient.$executeRaw`
              CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                skillTopic TEXT NOT NULL,
                userLevel TEXT NOT NULL,
                duration INTEGER NOT NULL,
                content TEXT,
                isPublished BOOLEAN DEFAULT false,
                generatedAt TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT,
                FOREIGN KEY (userId) REFERENCES users(id)
              )
            `;

            await prismaClient.$executeRaw`
              CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                roomName TEXT,
                roomSid TEXT,
                sessionType TEXT,
                status TEXT DEFAULT 'created',
                type TEXT,
                maxParticipants INTEGER,
                isRecorded BOOLEAN DEFAULT false,
                tokenGeneratedAt TEXT,
                startedAt TEXT,
                endedAt TEXT,
                endReason TEXT,
                searchData TEXT,
                exerciseData TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT,
                FOREIGN KEY (userId) REFERENCES users(id)
              )
            `;

            await prismaClient.$executeRaw`
              CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                orderId TEXT UNIQUE NOT NULL,
                amount REAL NOT NULL,
                currency TEXT DEFAULT 'USD',
                paymentMethod TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'created',
                paypalOrderId TEXT,
                paypalCaptureId TEXT,
                paypalPayerId TEXT,
                paypalEmail TEXT,
                capturedAt TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT,
                FOREIGN KEY (userId) REFERENCES users(id)
              )
            `;

            await prismaClient.$executeRaw`
              CREATE TABLE IF NOT EXISTS subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER UNIQUE NOT NULL,
                paypalSubscriptionId TEXT UNIQUE,
                plan TEXT NOT NULL,
                billingCycle TEXT DEFAULT 'monthly',
                status TEXT DEFAULT 'pending',
                paymentMethod TEXT NOT NULL,
                activatedAt TEXT,
                cancelledAt TEXT,
                paypalOrderId TEXT,
                lastPaymentAt TEXT,
                nextPaymentAt TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT,
                FOREIGN KEY (userId) REFERENCES users(id)
              )
            `;

            results.results.push = {
              status: 'success',
              message: 'Database schema pushed successfully',
            };

          } catch (pushError) {
            results.results.push = {
              status: 'error',
              message: pushError.message,
              error: 'Failed to push database schema',
            };
          }

          await prismaClient.$disconnect();
          break;

        case 'generate':
          // Generate Prisma client
          try {
            const { execSync } = require('child_process');
            execSync('npx prisma generate', { stdio: 'inherit' });
            
            results.results.generate = {
              status: 'success',
              message: 'Prisma client generated successfully',
            };
          } catch (generateError) {
            results.results.generate = {
              status: 'error',
              message: generateError.message,
              error: 'Failed to generate Prisma client',
            };
          }
          break;

        case 'reset':
          if (!force) {
            return ResponseHelper.validationError(
              'Reset requires force=true. This will delete all data!'
            );
          }

          try {
            // Drop all tables
            await prisma.$executeRaw`DROP TABLE IF EXISTS subscriptions`;
            await prisma.$executeRaw`DROP TABLE IF EXISTS payments`;
            await prisma.$executeRaw`DROP TABLE IF EXISTS sessions`;
            await prisma.$executeRaw`DROP TABLE IF EXISTS courses`;
            await prisma.$executeRaw`DROP TABLE IF EXISTS users`;

            results.results.reset = {
              status: 'success',
              message: 'Database reset successfully',
            };
          } catch (resetError) {
            results.results.reset = {
              status: 'error',
              message: resetError.message,
              error: 'Failed to reset database',
            };
          }
          break;
      }

      results.success = Object.values(results.results).every(result => result.status === 'success');

      return ResponseHelper.success(results);

    } catch (error) {
      console.error('Database migration error:', error);
      results.success = false;
      results.error = error.message;
      
      return ResponseHelper.serverError('Failed to perform database migration');
    }

  } catch (error) {
    console.error('Migration function error:', error);
    return ResponseHelper.serverError('Failed to process migration request');
  }
};