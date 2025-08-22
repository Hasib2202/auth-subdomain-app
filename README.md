# Auth Subdomain App

A full-stack authentication application with dynamic subdomain support, built with NestJS backend and Next.js frontend.

## 🌟 Features

### ✅ Core Authentication Features

- **User Signup** with username, password, and shop names
- **User Signin** with "Remember Me" functionality
- **Dashboard** with profile management
- **Shop-Specific Pages** accessible via subdomains
- **Cross-Domain Authentication** that persists across all subdomains

### 🔐 Security Features

- **Password Requirements**: Minimum 8 characters with at least one number and one special character
- **JWT Token Authentication** with HTTP-only cookies
- **Session Management**: 30 minutes default, 7 days with "Remember Me"
- **Global Shop Name Uniqueness** across all users
- **Secure Cross-Domain Cookie Sharing**

### 🌐 Subdomain Support

- **Dynamic Subdomain Routing**: `http://shopname.localhost:3000`
- **Persistent Authentication** across subdomains
- **Loading Spinners** during token verification
- **Automatic Redirects** for unauthenticated users

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS v4
- **Backend**: NestJS, TypeScript, JWT Authentication
- **Database**: PostgreSQL with Prisma ORM
- **Infrastructure**: Docker & Docker Compose
- **Deployment**: Ready for production deployment

## 📁 Project Structure

```
/
├── client/          # Next.js Frontend
│   ├── src/
│   │   ├── app/     # App Router pages
│   │   │   ├── dashboard/
│   │   │   ├── signin/
│   │   │   ├── signup/
│   │   │   └── shop/[shopName]/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── lib/
│   └── package.json
├── server/          # NestJS Backend
│   ├── src/
│   │   ├── auth/    # Authentication module
│   │   ├── user/    # User management
│   │   └── main.ts
│   ├── prisma/
│   └── package.json
├── docker-compose.yml
├── Dockerfile.client
├── Dockerfile.server
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Hasib2202/auth-subdomain-app.git
   cd auth-subdomain-app
   ```

2. **Set up environment variables**

   ```bash
   # Create .env file in server directory
   cp server/.env.example server/.env
   ```

   Update `server/.env` with:

   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/authdb?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-here"
   ```

3. **Start with Docker (Recommended)**

   ```bash
   docker-compose up --build
   ```

4. **OR Manual Setup**

   ```bash
   # Start PostgreSQL
   docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=authdb -p 5432:5432 -d postgres:15

   # Setup Backend
   cd server
   npm install
   npx prisma generate
   npx prisma db push
   npm run start:dev

   # Setup Frontend (new terminal)
   cd client
   npm install
   npm run dev
   ```

### 🌐 Accessing the Application

- **Main App**: http://localhost:3000
- **API Server**: http://localhost:8000
- **Sample Subdomains**:
  - http://shop1.localhost:3000
  - http://beautyhub.localhost:3000
  - http://techstore.localhost:3000

## 📚 API Documentation

### Authentication Endpoints

#### POST /auth/signup

```json
{
  "username": "john_doe",
  "password": "Password123!",
  "shopNames": ["shop1", "shop2", "shop3"]
}
```

#### POST /auth/login

```json
{
  "username": "john_doe",
  "password": "Password123!",
  "rememberMe": true
}
```

#### GET /auth/profile

- Returns user profile with shop names
- Requires JWT token in Authorization header or cookie

#### POST /auth/logout

- Clears authentication cookies
- Invalidates current session

### Response Examples

**Successful Login Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe"
  },
  "expiresIn": "7d"
}
```

**Profile Response:**

```json
{
  "id": 1,
  "username": "john_doe",
  "shops": ["shop1", "shop2", "shop3"]
}
```

## 🔒 Token/Session Handling

### JWT Token Management

- **Storage**: HTTP-only cookies for security
- **Domain**: `.localhost` for subdomain sharing
- **Expiration**: 30 minutes (default) or 7 days (Remember Me)
- **Validation**: Automatic token verification on protected routes

### Cross-Domain Authentication Flow

1. User logs in on main domain (`localhost:3000`)
2. JWT token stored in HTTP-only cookie with `.localhost` domain
3. Cookie automatically shared with all subdomains
4. Subdomain pages validate token and redirect if invalid
5. Loading spinner shown during validation process

### Security Measures

- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Cookie Settings**: Production-ready configuration
- **Domain Restriction**: Cookies only work on localhost domain
- **Token Expiration**: Automatic session management

## 🏗️ Database Schema

```sql
-- Users table
CREATE TABLE User (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Shops table
CREATE TABLE Shop (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  userId INTEGER REFERENCES User(id)
);
```

## 🐳 Docker Configuration

### Services

- **postgres**: PostgreSQL database server
- **server**: NestJS API server (port 8000)
- **client**: Next.js frontend (port 3000)

### Development Commands

```bash
# Start all services
docker-compose up

# Rebuild and start
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]
```

## 🔧 Development

### Adding New Shop Routes

1. Shop pages are automatically created using Next.js dynamic routing
2. Access pattern: `http://[shopname].localhost:3000`
3. All authentication is handled automatically

### Extending Authentication

- Modify `auth.service.ts` for business logic
- Update DTOs in `dto/` for validation rules
- Extend JWT payload in `jwt.strategy.ts`

### Database Changes

```bash
# Update schema
npx prisma db push

# Generate new client
npx prisma generate

# Reset database
npx prisma db push --force-reset
```

## 🚀 Production Deployment

### Environment Variables

```env
# Server (.env)
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-production-jwt-secret"
NODE_ENV="production"

# Client (.env.local)
NEXT_PUBLIC_API_URL="https://your-api-domain.com"
```

### Deployment Checklist

- [ ] Update CORS settings for production domains
- [ ] Configure secure cookie settings
- [ ] Set up SSL certificates
- [ ] Update subdomain DNS configuration
- [ ] Configure production database
- [ ] Set strong JWT secret
- [ ] Enable request rate limiting

## 🧪 Testing

### Manual Testing Checklist

- [ ] Signup with valid data
- [ ] Signup with invalid password
- [ ] Login with correct credentials
- [ ] Login with wrong credentials
- [ ] Remember Me functionality
- [ ] Dashboard profile display
- [ ] Shop subdomain access
- [ ] Cross-domain authentication
- [ ] Logout functionality

### Test Scenarios

1. **Signup Flow**: Create account with 3+ unique shop names
2. **Login Flow**: Test both regular and "Remember Me" options
3. **Dashboard**: Verify profile icon and shop list display
4. **Subdomain Access**: Open shop subdomain in new tab
5. **Session Management**: Test token expiration behavior

## 🏆 Requirements Fulfilled

✅ **Signup Page**: Username, password, 3+ unique shop names  
✅ **Password Validation**: 8+ chars, number + special character  
✅ **Global Shop Uniqueness**: Enforced across all users  
✅ **Signin Page**: Username/password with Remember Me  
✅ **Session Duration**: 30min default, 7 days with Remember Me  
✅ **Error Messages**: "User not found", "Incorrect password"  
✅ **Dashboard**: Profile icon with shop list and logout  
✅ **Logout Confirmation**: Modal confirmation prompt  
✅ **Subdomain Routing**: `http://shopname.localhost:3000`  
✅ **Cross-Domain Auth**: Persistent authentication  
✅ **Loading Spinners**: During token verification  
✅ **Tech Stack**: Next.js + NestJS + PostgreSQL + Prisma  
✅ **Docker Support**: Complete containerization  
✅ **Project Structure**: Organized client/server folders

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Hasib Ul Hasan**

- GitHub: [@Hasib2202](https://github.com/Hasib2202)
- Repository: [auth-subdomain-app](https://github.com/Hasib2202/auth-subdomain-app)

---

🎉 **Ready for submission!** This application implements all required features with robust authentication and seamless subdomain support.
