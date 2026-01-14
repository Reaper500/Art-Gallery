# J&M Art Gallery

A beautiful art gallery application built with Next.js, Tailwind CSS, and Convex.

## Features

- 🖼️ Display artwork in a beautiful grid layout on the homepage
- 📤 Admin dashboard for uploading new artworks (password protected)
- ❤️ Like and dislike functionality with browser-based tracking
- 📥 Download artwork images
- 🔍 Modal view for detailed artwork viewing
- 🗑️ Delete artworks from the admin panel
- 💾 Image storage powered by Convex
- 🎨 Modern, responsive UI with Tailwind CSS
- 🫧 Animated background bubbles
- 🎨 Purple and black theme

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Convex account (sign up at [convex.dev](https://convex.dev))

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd art-gallery
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up Convex:**
```bash
npx convex dev
```

This will:
- Prompt you to log in to Convex (create a free account if needed)
- Create a new Convex project for your deployment
- Generate the necessary configuration files
- Automatically create `.env.local` with your `NEXT_PUBLIC_CONVEX_URL`

**Important:** Each developer/deployment needs to run `npx convex dev` to create their own Convex project. The Convex URL is stored in `.env.local` which is git-ignored, so it won't be committed to the repository.

4. **Run the development server:**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

**Note:** Keep `npx convex dev` running in one terminal (it syncs your backend code), and run `npm run dev` in another terminal for the Next.js app.

## Usage

### Viewing Artworks

Navigate to the homepage to see all uploaded artworks displayed in a responsive grid.

### Accessing Admin Dashboard

1. Go to `/login` or click "Admin" in the navbar
2. Enter the password: `Jewel12345`
3. You'll be redirected to the admin dashboard

### Uploading Artworks

1. From the admin dashboard, fill in the form:
   - Select an image file
   - Enter a title (required)
   - Optionally add an artist name and description
2. Click "Upload Artwork"

### Managing Artworks

From the admin dashboard, you can:
- View all uploaded artworks
- Delete artworks by clicking the "Delete" button

### Interacting with Artworks

- **View Full Image:** Click on any artwork image to open it in a modal
- **Like:** Click the heart button (one like per browser/device)
- **Dislike:** Click the dislike button (one dislike per browser/device)
  - Note: Liking after disliking (or vice versa) will switch your vote
- **Download:** Click the download button to save the image

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard page (password protected)
│   ├── login/              # Login page for admin access
│   ├── components/         # React components (Navbar, ImageModal, AnimatedBubbles)
│   ├── hooks/              # Custom hooks (authentication, artwork interactions)
│   ├── page.tsx            # Homepage gallery
│   └── layout.tsx          # Root layout
├── convex/
│   ├── artworks.ts         # Artwork queries and mutations
│   ├── files.ts            # File storage utilities
│   └── schema.ts           # Database schema
└── public/                 # Static assets
```

## Important Notes for GitHub

✅ **Safe to push to GitHub:**
- Your code structure is safe to commit
- `.env.local` is git-ignored (contains your Convex URL)
- `.convex/` folder is git-ignored (local Convex config)
- `convex.json` is git-ignored (project-specific config)

⚠️ **Each deployment needs:**
- Run `npx convex dev` to create/connect to their own Convex project
- This generates their own `.env.local` with a unique Convex URL
- Each Convex project has its own database and file storage

🔒 **Security:**
- Admin password is hardcoded in the code (consider environment variables for production)
- Each Convex deployment is isolated and secure

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Convex** - Backend as a service (database + file storage)

## License

MIT
