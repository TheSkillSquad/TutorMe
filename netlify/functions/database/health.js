// Netlify Function for database health check
const ResponseHelper = require('../utils/response');
const DatabaseHelper = require('../utils/database');

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return ResponseHelper.success({}, 200);
  }

  if (event.httpMethod !== 'GET') {
    return ResponseHelper.error('Method not allowed', 405);
  }

  try {
    const queryParams = event.queryStringParameters || {};
    const { check = 'all' } = queryParams;

    const results = {
      timestamp: new Date().toISOString(),
      checks: {},
      overall: 'healthy',
    };

    // Database connection check
    if (check === 'all' || check === 'database') {
      try {
        const prisma = await DatabaseHelper.connect();
        await prisma.$queryRaw`SELECT 1`;
        await DatabaseHelper.disconnect();
        
        results.checks.database = {
          status: 'healthy',
          message: 'Database connection successful',
          responseTime: Date.now() - results.timestamp,
        };
      } catch (error) {
        results.checks.database = {
          status: 'unhealthy',
          message: error.message,
          error: 'Database connection failed',
        };
        results.overall = 'unhealthy';
      }
    }

    // Prisma client check
    if (check === 'all' || check === 'prisma') {
      try {
        const prisma = DatabaseHelper.getPrismaClient();
        await prisma.$executeRaw`SELECT 1`;
        
        results.checks.prisma = {
          status: 'healthy',
          message: 'Prisma client working',
        };
      } catch (error) {
        results.checks.prisma = {
          status: 'unhealthy',
          message: error.message,
          error: 'Prisma client failed',
        };
        results.overall = 'unhealthy';
      }
    }

    // User table check
    if (check === 'all' || check === 'users') {
      try {
        const prisma = DatabaseHelper.getPrismaClient();
        const userCount = await prisma.user.count();
        
        results.checks.users = {
          status: 'healthy',
          message: 'Users table accessible',
          count: userCount,
        };
      } catch (error) {
        results.checks.users = {
          status: 'unhealthy',
          message: error.message,
          error: 'Users table check failed',
        };
        results.overall = 'unhealthy';
      }
    }

    // Courses table check
    if (check === 'all' || check === 'courses') {
      try {
        const prisma = DatabaseHelper.getPrismaClient();
        const courseCount = await prisma.course.count();
        
        results.checks.courses = {
          status: 'healthy',
          message: 'Courses table accessible',
          count: courseCount,
        };
      } catch (error) {
        results.checks.courses = {
          status: 'unhealthy',
          message: error.message,
          error: 'Courses table check failed',
        };
        results.overall = 'unhealthy';
      }
    }

    // Sessions table check
    if (check === 'all' || check === 'sessions') {
      try {
        const prisma = DatabaseHelper.getPrismaClient();
        const sessionCount = await prisma.session.count();
        
        results.checks.sessions = {
          status: 'healthy',
          message: 'Sessions table accessible',
          count: sessionCount,
        };
      } catch (error) {
        results.checks.sessions = {
          status: 'unhealthy',
          message: error.message,
          error: 'Sessions table check failed',
        };
        results.overall = 'unhealthy';
      }
    }

    // Payments table check
    if (check === 'all' || check === 'payments') {
      try {
        const prisma = DatabaseHelper.getPrismaClient();
        const paymentCount = await prisma.payment.count();
        
        results.checks.payments = {
          status: 'healthy',
          message: 'Payments table accessible',
          count: paymentCount,
        };
      } catch (error) {
        results.checks.payments = {
          status: 'unhealthy',
          message: error.message,
          error: 'Payments table check failed',
        };
        results.overall = 'unhealthy';
      }
    }

    // Environment variables check
    if (check === 'all' || check === 'environment') {
      const envChecks = {
        DATABASE_URL: !!process.env.DATABASE_URL,
        PRISMA_CLI_QUERY_ENGINE_TYPE: !!process.env.PRISMA_CLI_QUERY_ENGINE_TYPE,
        PRISMA_CLIENT_ENGINE_TYPE: !!process.env.PRISMA_CLIENT_ENGINE_TYPE,
      };

      const missingEnvVars = Object.entries(envChecks)
        .filter(([_, value]) => !value)
        .map(([key, _]) => key);

      results.checks.environment = {
        status: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
        message: missingEnvVars.length === 0 
          ? 'All required environment variables are set'
          : `Missing environment variables: ${missingEnvVars.join(', ')}`,
        variables: envChecks,
      };

      if (missingEnvVars.length > 0) {
        results.overall = 'unhealthy';
      }
    }

    // Set appropriate HTTP status
    const statusCode = results.overall === 'healthy' ? 200 : 503;

    return ResponseHelper.success(results, statusCode);

  } catch (error) {
    console.error('Database health check error:', error);
    return ResponseHelper.serverError('Failed to perform database health check');
  }
};