# DeepPurple

Text emotion analysis platform. Submit customer communications (support tickets, product reviews, social media) and get deep insights into the emotions they express — displayed in an interactive dashboard with trend charts and detailed breakdowns.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| Backend API | Java 17, Spring Boot 3, Spring Data JPA, Flyway |
| Analysis engine | AWS Lambda (Python 3.11) + OpenAI GPT-3.5-turbo |
| Database | PostgreSQL (AWS RDS) |
| Frontend hosting | AWS Amplify |
| Backend hosting | AWS Elastic Beanstalk |

## Project Structure

```
DeepPurple/
├── frontend/          React dashboard
├── backend/           Spring Boot REST API
└── lambda/            Emotion analysis Lambda function
```

## Quick Start (local)

### Prerequisites
- Node.js 18+
- Java 17, Maven 3.9+
- Python 3.11+

### 1. Lambda — test locally

```bash
cd lambda
pip install -r requirements.txt
OPENAI_API_KEY=sk-... python handler.py "I am so frustrated with this billing issue"
```

### 2. Backend — run with in-memory H2 (no Postgres needed)

```bash
cd backend
mvn spring-boot:run -Dspring.profiles.active=local
```

API: http://localhost:8080  
Swagger UI: http://localhost:8080/swagger-ui.html  
H2 console: http://localhost:8080/h2-console

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173 (API calls are proxied to :8080)

## API Reference

| Method | Path | Description |
|---|---|---|
| POST | `/api/communications` | Submit text → invoke Lambda → return analysis |
| GET | `/api/communications` | Paginated list; filter by `source`, `emotion`, `from`, `to` |
| GET | `/api/communications/:id` | Full analysis detail |
| GET | `/api/analytics/trends` | Emotion counts per day for a date range |
| GET | `/api/analytics/summary` | Overall emotion distribution |

## Environment Variables

### Backend

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | H2 in-memory (local) | PostgreSQL JDBC URL |
| `DATABASE_USERNAME` | `postgres` | DB username |
| `DATABASE_PASSWORD` | `postgres` | DB password |
| `AWS_REGION` | `us-east-1` | AWS region |
| `LAMBDA_FUNCTION_ARN` | — | ARN of the analysis Lambda |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Frontend origin |

### Lambda

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key |

## Emotions Tracked

Joy · Anger · Fear · Sadness · Surprise · Disgust · Trust

Each analysis returns a primary emotion, per-emotion scores (0–1), sentiment score (−1 to +1), extracted topics, and a one-sentence summary.
