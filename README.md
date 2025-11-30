# 🌍 Trevelo — Travel Smarter
<b>Trevelo</b> is an AI-powered full-stack web application designed to revolutionize collaborative trip planning. Users can generate detailed, personalized itineraries in seconds using OpenAI, book flights and hotels (mock integration), and manage their trips in a sleek, modern interface.

## 🏗️ Architecture Overview
Trevelo follows a <b>decoupled client-server architecture</b> hosted on AWS-native infrastructure.

- Frontend: React (Vite) Single Page Application.
- Backend: Node.js + Express REST API.
- AI Engine: OpenAI GPT-4o-mini (structured JSON output).
- Database: Amazon DynamoDB (Single-Table Design).
- Authentication: AWS Cognito (User Pools).
- Infrastructure: AWS CDK (Infrastructure as Code).

<b>Data Flow</b>

1. User submits a prompt (e.g., "5 days in Tokyo").
2. Frontend sends request to Backend (POST /api/itineraries/start).
3. Backend creates a Job in DynamoDB (status: queued) and returns a jobId.
4. Frontend polls the Backend (GET /api/jobs/:id) while displaying a loading animation.
5. Backend processes the job asynchronously via OpenAI and updates DynamoDB.
6. Once completed, Frontend renders the rich ItineraryView component.

## 🚀 Quick Start
<b>Prerequisites</b>
- Node.js (v18+)
- AWS Account (for Cognito & DynamoDB)
- OpenAI API Key

<b>1. Environment Setup</b>
<br>You need to configure environment variables for both client and server.
<br><br><b>Root/Client (.env)</b>
````javascript
VITE_API_BASE_URL=http://localhost:4000
VITE_USER_POOL_ID=us-east-2_xxxxxx
VITE_CLIENT_ID=xxxxxxxxxxxxxx
````

<b>Server (.env)</b>
````javascript
PORT=4000
AWS_REGION=us-east-2
DYNAMO_TABLE=Trevelo-Data
OPENAI_API_KEY=sk-proj-xxxxxx
COGNITO_USER_POOL_ID=us-east-2_xxxxxx
````

<b>2. Installation</b>
<br>Run this in the root directory to install dependencies for both sides:
````javascript
# Install Client dependencies
cd client
npm install

# Install Server dependencies
cd server
npm install
````

<b>3. Running Locally (Development) </b>
<br>You need two terminal windows running simultaneously.
<br><br><b>Terminal 1 (Backend):</b>
````javascript
cd server
npm run dev
# Server runs on http://localhost:4000
````
<b>Terminal 2 (Frontend):</b>
```javascript
cd client
npm run dev
# Client runs on http://localhost:5173
```

## 🔐 Authentication
Authentication is handled via <b>AWS Cognito</b>.
- <b>Frontend</b>: Uses aws-amplify to manage sessions and tokens.
- <b>Backend</b>: Verifies JWT tokens passed in the `Authorization: Bearer <token>` header for protected routes.
