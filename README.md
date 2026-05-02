# COMTRACK - Smart Emergency Response & Public Assistance Platform

COMTRACK is a production-focused full-stack platform that unifies:

- Ambulance booking with live tracking map
- Complaint management with smart AI routing
- SOS emergency alerts with live location sharing

## Tech Stack

- Frontend: React, Tailwind CSS, React Router, Axios, Framer Motion, Recharts, Leaflet
- Backend: Node.js, Express.js, Socket.io
- Database: MongoDB + Mongoose
- Auth/Security: JWT access + refresh tokens, OTP/link reset, Helmet, Rate limiting, sanitization
- Uploads: Cloudinary (preferred) + local fallback
- Deployment: Docker + docker-compose, Replit compatible scripts

## Feature Highlights

- Live map modules for ambulance and SOS views
- Nearby hospitals / police / fire station markers
- Complaint image upload + SOS evidence upload with UI preview
- Email verification + forgot password via OTP or reset link
- Admin analytics dashboard (category, bookings trend, SOS by location, response time, user growth)
- Realtime notifications via Socket.io
- Dark/light mode, EN/TA language toggle, voice shortcuts
- Skeleton loaders, toast notifications, responsive design

## API Routes

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/verify-email`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

Ambulance:
- `GET /api/ambulance/nearby`
- `GET /api/ambulance/nearby-services`
- `POST /api/ambulance/book`
- `GET /api/ambulance/track/:id`

Complaints:
- `POST /api/complaints/upload`
- `POST /api/complaints/create`
- `GET /api/complaints/my`
- `GET /api/complaints/status/:id`

SOS:
- `POST /api/sos/upload`
- `POST /api/sos/create`
- `GET /api/sos/history`

Admin:
- `GET /api/admin/users`
- `GET /api/admin/complaints`
- `PUT /api/admin/complaints/:id`
- `GET /api/admin/reports`

## Project Structure

- `client/` frontend app
  - `src/components`
  - `src/pages`
  - `src/layouts`
  - `src/hooks`
  - `src/services`
  - `src/utils`
- `server/` backend app
  - `routes`
  - `controllers`
  - `models`
  - `middleware`
  - `config`
  - `utils`

## Local Setup

1. Copy environment files:
   - `server/.env.example` to `server/.env`
   - `client/.env.example` to `client/.env`
2. Install dependencies:
   - `npm run install:all`
3. Seed demo data:
   - `npm run seed`
4. Run backend:
   - `npm run dev:server`
5. Run frontend:
   - `npm run dev:client`

URLs:
- App: `http://localhost:5173`
- API: `http://localhost:5000/api`

## Docker Deployment

One-command startup:

- `npm run docker:up`

Stop:

- `npm run docker:down`

Services in compose:
- `mongodb` (port `27017`)
- `server` (port `5000`)
- `client` (port `5173`)

## Cloud Deployment

Frontend (Vercel):
- Project root: `client`
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite config included in `client/vercel.json`

Backend (Render):
- Blueprint config included in `render.yaml`
- Service root: `server`
- Start command: `npm start`
- Set environment variables from `server/.env.example`

Backend (Railway):
- Config included in `railway.toml`
- Start command uses `server` workspace package

## Seeded Demo Data

Seeding creates:
- Admin user: `admin@comtrack.app`
- Sample complaint ticket
- Sample ambulance booking
- Sample SOS alert
- Sample ambulances

Default admin password:
- `Admin@12345`

## Security Notes

- Helmet for secure headers
- Rate limiting on API
- Request body sanitization
- Mongo sanitization + parameter pollution protection
- JWT refresh rotation with token hash storage
- Refresh token revocation blacklist with TTL cleanup
- Bcrypt hashing with cost factor `12`
- File upload MIME whitelisting + per-module size limits + virus scan hook placeholder
- Mapbox Directions API integration for real route polyline and ETA (when `MAPBOX_TOKEN` is set)

