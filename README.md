# StudioSpace — Creative Workspace & Production Studio Booking

**Live Website:** https://studiospace-client-coral.vercel.app/  
**Client Repository:** https://github.com/tayassukmdabir95/studiospace-client  
**Server Repository:** https://github.com/tayassukmdabir95/studiospace-server

StudioSpace is a peer-to-peer marketplace for discovering, listing, and booking creative workspaces, including photography studios, film stages, podcast lounges, music suites, and workshops. Creators can browse studios and reserve time slots, while hosts manage their listings through a personalized dashboard.

## Key Features

- **Explore Studios:** Browse creative spaces and filter listings by studio category.
- **Studio Details:** View workspace images, amenities, location, pricing, host information, and studio details before booking.
- **Studio Booking:** Choose a date and time slot, create a booking, and review its status in My Bookings.
- **Booking Management:** View your reservations and cancel eligible pending bookings with a confirmation dialog.
- **Host Studio Management:** Add new studios, upload images, edit existing listings, and delete your own studios.
- **Authentication:** Register or log in with email/password or Google; protected actions use JWT authentication with HTTPOnly cookies.
- **Booking Conflict Checks:** The server checks existing confirmed bookings to prevent overlapping reservations.
- **Responsive Experience:** Mobile-friendly UI, light/dark theme toggle, toast notifications, and dedicated loading, empty, and not-found states.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js (App Router), React, JavaScript, Tailwind CSS |
| UI | Lucide React, Swiper, Sonner, next-themes |
| Authentication | JWT in HTTPOnly cookies, Google OAuth |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Image Hosting | ImgBB |
| Deployment | Vercel (frontend), Render (backend) |

## Run Locally

### Prerequisites

- Node.js and npm
- MongoDB Atlas connection string
- Google OAuth Web Client ID
- ImgBB API key (for image uploads)

### 1. Clone and run the backend

```bash
git clone https://github.com/tayassukmdabir95/studiospace-server.git
cd studiospace-server
npm install
```

Create a `.env` file inside `studiospace-server`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=studiospace
JWT_SECRET=replace_with_a_strong_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
IMGBB_API_KEY=your_imgbb_api_key
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

The API should be available at `http://localhost:5000`.

### 2. Clone and run the frontend

Open a separate terminal:

```bash
git clone https://github.com/tayassukmdabir95/studiospace-client.git
cd studiospace-client
npm install
```

Create a `.env.local` file inside `studiospace-client`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the frontend:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Main Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Home and featured studios | Public |
| `/studios` | Browse and filter studios | Public |
| `/studios/[id]` | Studio details and booking | Public details; authentication required to book |
| `/login` | Email/password and Google login | Public |
| `/register` | Create an account | Public |
| `/dashboard` | User dashboard | Private |
| `/add-studio` | Add a studio listing | Private |
| `/my-listings` | Manage owned studio listings | Private |
| `/studios/edit/[id]` | Update an owned studio | Private |
| `/my-bookings` | View and manage reservations | Private |

## Examiner Test Credentials

> **Before submission:** Replace the placeholders below with a dedicated working demo account. Do not publish a personal account password or any admin, database, API, or JWT secrets.

| Field | Value |
| --- | --- |
| Website | https://studiospace-client-coral.vercel.app/ |
| Demo Email | `REPLACE_WITH_DEMO_EMAIL` |
| Demo Password | `REPLACE_WITH_DEMO_PASSWORD` |

The examiner can also create a new account using the registration form or sign in with Google.

## Deployment

- **Frontend:** Hosted on Vercel at https://studiospace-client-coral.vercel.app/
- **Backend:** Hosted on Render. **Add your actual Render service URL here:** `https://REPLACE_WITH_RENDER_SERVICE.onrender.com`
- Set `NEXT_PUBLIC_API_URL` in Vercel to the Render backend URL.
- Set `CLIENT_URL` in Render to `https://studiospace-client-coral.vercel.app` and configure Google OAuth's authorized JavaScript origin accordingly.
- Keep secret values in hosting environment variables, not in GitHub.

## Notes

StudioSpace is built as an academic project. Booking status and availability depend on the server-side workflow; payment processing is not included.
