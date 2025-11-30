# 🌍 Trevelo — Travel Smarter
**Trevelo** is an AI-powered full-stack web application designed to revolutionize collaborative trip planning. Users can generate detailed, personalized itineraries in seconds using OpenAI, book flights and hotels (mock integration), and manage their trips in a sleek, modern interface.

## 🏗️ Architecture Overview
Trevelo follows a **decoupled client-server architecture** hosted on AWS-native infrastructure.

- **Frontend**: React (Vite) Single Page Application.
- **Backend**: Node.js + Express REST API.
- **AI Engine**: OpenAI GPT-4o-mini (structured JSON output).
- **Database**: Amazon DynamoDB (Single-Table Design).
- **Authentication**: AWS Cognito (User Pools).
- **Infrastructure**: AWS CDK (Infrastructure as Code).

**Data Flow**

1. User submits a prompt (e.g., "5 days in Tokyo").
2. Frontend sends request to Backend (`POST /api/itineraries/start`).
3. Backend creates a Job in DynamoDB (`status: queued`) and returns a `jobId`.
4. Frontend polls the Backend (`GET /api/jobs/:id`) while displaying a loading animation.
5. Backend processes the job asynchronously via OpenAI and updates DynamoDB.
6. Once completed, Frontend renders the rich `ItineraryView` component.

## 🚀 Quick Start
**Prerequisites**
- Node.js (v18+)
- AWS Account (for Cognito & DynamoDB)
- OpenAI API Key

**1. Environment Setup**
<br>You need to configure environment variables for both client and server.
<br><br>**Root/Client (.env)**
````javascript
VITE_API_BASE_URL=http://localhost:4000
VITE_USER_POOL_ID=us-east-2_xxxxxx
VITE_CLIENT_ID=xxxxxxxxxxxxxx
````

**Server (.env)**
````javascript
PORT=4000
AWS_REGION=us-east-2
DYNAMO_TABLE=Trevelo-Data
OPENAI_API_KEY=sk-proj-xxxxxx
COGNITO_USER_POOL_ID=us-east-2_xxxxxx
````

**2. Installation**
<br>Run this in the root directory to install dependencies for both sides:
````javascript
# Install Client dependencies
cd client
npm install

# Install Server dependencies
cd server
npm install
````

**3. Running Locally (Development)**
<br>You need two terminal windows running simultaneously.
<br><br>**Terminal 1 (Backend):**
````javascript
cd server
npm run dev
# Server runs on http://localhost:4000
````
**Terminal 2 (Frontend):**
```javascript
cd client
npm run dev
# Client runs on http://localhost:5173
```

## 🔐 Authentication
Authentication is handled via **AWS Cognito**.
- **Frontend**: Uses aws-amplify to manage sessions and tokens.
- **Backend**: Verifies JWT tokens passed in the `Authorization: Bearer <token>` header for protected routes.
