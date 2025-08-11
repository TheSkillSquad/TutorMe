// Database utilities for Netlify Functions using Prisma
const { PrismaClient } = require('@prisma/client');

let prisma = null;

const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  return prisma;
};

class DatabaseHelper {
  static async connect() {
    try {
      const prisma = getPrismaClient();
      await prisma.$connect();
      return prisma;
    } catch (error) {
      console.error('Database connection error:', error);
      throw new Error('Failed to connect to database');
    }
  }

  static async disconnect() {
    if (prisma) {
      await prisma.$disconnect();
      prisma = null;
    }
  }

  static async executeTransaction(operations) {
    const prisma = getPrismaClient();
    try {
      return await prisma.$transaction(operations);
    } catch (error) {
      console.error('Transaction error:', error);
      throw new Error('Transaction failed');
    }
  }

  // User operations
  static async findUserByEmail(email) {
    const prisma = getPrismaClient();
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async createUser(userData) {
    const prisma = getPrismaClient();
    return await prisma.user.create({
      data: userData,
    });
  }

  static async updateUser(uid, userData) {
    const prisma = getPrismaClient();
    return await prisma.user.update({
      where: { uid },
      data: userData,
    });
  }

  static async findUserByUid(uid) {
    const prisma = getPrismaClient();
    return await prisma.user.findUnique({
      where: { uid },
    });
  }

  // Course operations
  static async createCourse(courseData) {
    const prisma = getPrismaClient();
    return await prisma.course.create({
      data: courseData,
    });
  }

  static async findCoursesByUserId(userId) {
    const prisma = getPrismaClient();
    return await prisma.course.findMany({
      where: { userId },
    });
  }

  static async updateCourse(id, courseData) {
    const prisma = getPrismaClient();
    return await prisma.course.update({
      where: { id },
      data: courseData,
    });
  }

  // Session operations
  static async createSession(sessionData) {
    const prisma = getPrismaClient();
    return await prisma.session.create({
      data: sessionData,
    });
  }

  static async findSessionsByUserId(userId) {
    const prisma = getPrismaClient();
    return await prisma.session.findMany({
      where: { userId },
      include: {
        tutor: true,
        student: true,
      },
    });
  }

  static async updateSession(id, sessionData) {
    const prisma = getPrismaClient();
    return await prisma.session.update({
      where: { id },
      data: sessionData,
    });
  }

  // Payment operations
  static async createPayment(paymentData) {
    const prisma = getPrismaClient();
    return await prisma.payment.create({
      data: paymentData,
    });
  }

  static async findPaymentsByUserId(userId) {
    const prisma = getPrismaClient();
    return await prisma.payment.findMany({
      where: { userId },
    });
  }

  static async updatePayment(id, paymentData) {
    const prisma = getPrismaClient();
    return await prisma.payment.update({
      where: { id },
      data: paymentData,
    });
  }

  // Subscription operations
  static async createSubscription(subscriptionData) {
    const prisma = getPrismaClient();
    return await prisma.subscription.create({
      data: subscriptionData,
    });
  }

  static async findSubscriptionByUserId(userId) {
    const prisma = getPrismaClient();
    return await prisma.subscription.findUnique({
      where: { userId },
    });
  }

  static async updateSubscription(userId, subscriptionData) {
    const prisma = getPrismaClient();
    return await prisma.subscription.update({
      where: { userId },
      data: subscriptionData,
    });
  }
}

module.exports = DatabaseHelper;