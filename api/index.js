const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('../src/config/config');
const connectDB = require('../src/config/database');
const createSuperAdmin = require('../src/utils/createSuperAdmin');
const swaggerSetup = require('../src/config/swagger');
const errorHandler = require('../src/middleware/errorHandler');
const AppError = require('../src/utils/AppError');

// Import routes
const authRoutes = require('../src/routes/authRoutes');
const userRoutes = require('../src/routes/userRoutes');
const adminRoutes = require('../src/routes/adminRoutes');
const contactRoutes = require('../src/routes/contactRoutes');

const app = express();

// Security middleware - Configure Helmet for Vercel
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for Swagger UI
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
app.use(cors());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting - less strict for serverless
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running on Vercel',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Nanos E-Commerce API',
    documentation: '/api-docs',
    health: '/health',
    apiVersion: 'v1',
  });
});

// API routes
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/users`, userRoutes);
app.use(`${config.apiPrefix}/admin`, adminRoutes);
app.use(`${config.apiPrefix}/contact`, contactRoutes);

// Swagger documentation
swaggerSetup(app);

// 404 handler - must be after all other routes
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorHandler);

// Database connection and initialization
let isConnected = false;

const initializeApp = async () => {
  try {
    // Only connect if not already connected (serverless optimization)
    if (!isConnected) {
      await connectDB();
      isConnected = true;
      console.log('✅ Database connected');

      // Create super admin if not exists
      await createSuperAdmin();
      console.log('✅ Super admin check complete');
    }
  } catch (error) {
    console.error('❌ Initialization error:', error);
    // Don't throw - let the request continue and error handler will catch issues
  }
};

// For Vercel serverless function
module.exports = async (req, res) => {
  // Initialize on each invocation (with connection reuse)
  await initializeApp();
  
  // Handle the request with Express
  return app(req, res);
};

// For local development
if (require.main === module) {
  const PORT = config.port || 5000;
  
  const startServer = async () => {
    try {
      await initializeApp();
      
      app.listen(PORT, () => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🚀 Server running in ${config.env} mode`);
        console.log(`🌍 Server URL: http://localhost:${PORT}`);
        console.log(`📡 API Prefix: ${config.apiPrefix}`);
        console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();
}
