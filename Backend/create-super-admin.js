import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Delete existing SUPER_ADMIN
    await User.deleteMany({ email: "super@gmail.com" });
    
    // Hash password "123456"
    const hashedPassword = await bcrypt.hash('123456', 10);
    console.log("Generated hash:", hashedPassword);
    
    // Create SUPER_ADMIN
    const superAdmin = await User.create({
      userId: "SA1",
      username: "Super Admin",
      email: "super@gmail.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      timezone: "UTC",
      isActive: true,
      createdBy: null
    });
    
    console.log("✅ SUPER_ADMIN created successfully!");
    console.log("📧 Email: super@gmail.com");
    console.log("🔑 Password: 123456");
    
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createSuperAdmin();