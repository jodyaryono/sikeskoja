#!/bin/bash

# SiKesKoja - Sistem Pendataan Kesehatan
# Start Script for Linux/Mac

echo "🚀 Starting SiKesKoja Health System..."
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
fi

# Check if client/node_modules exists
if [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing client dependencies...${NC}"
    cd client
    npm install
    cd ..
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install client dependencies${NC}"
        exit 1
    fi
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found!${NC}"
    echo "Creating .env from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
        echo -e "${YELLOW}⚙️  Please update .env with your database credentials${NC}"
    else
        echo -e "${RED}❌ .env.example not found${NC}"
        exit 1
    fi
fi

# Generate Prisma Client
echo -e "${YELLOW}🔄 Generating Prisma Client...${NC}"
npx prisma generate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
    exit 1
fi

# Check database connection
echo -e "${YELLOW}🔍 Checking database connection...${NC}"
npx prisma db push --accept-data-loss 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database connection failed!${NC}"
    echo -e "${YELLOW}Please check your DATABASE_URL in .env file${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Database connected successfully${NC}"

# Start the application
echo ""
echo -e "${GREEN}✅ All checks passed!${NC}"
echo ""
echo "======================================"
echo "🚀 Starting Backend & Frontend..."
echo "======================================"
echo ""
echo "📍 Backend:  http://localhost:5000"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Run both backend and frontend
npm run dev
