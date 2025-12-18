# 🔗 BioFolio

<div align="center">

![BioFolio Logo](public/logo-full.png)

**The modern link-in-bio platform for creators**

Transform your scattered digital presence into a cohesive, high-converting landing page.

[Live Demo](https://biofolio.link) · [Report Bug](mailto:support@biofolio.link) · [Request Feature](mailto:support@biofolio.link)

</div>

---

## ✨ Features

### 🏠 Landing Page
- Modern, responsive design with dark theme
- Floating glassmorphism navigation bar
- Animated hero section with gradient effects
- Brand marquee showcasing integrations
- Interactive editor preview section
- Analytics showcase with animated counters
- Call-to-action section
- Comprehensive footer with legal links

### 🔐 Authentication
- Email/Password authentication
- Google OAuth integration
- Secure session management via Supabase Auth
- Protected dashboard routes

### 📊 Dashboard
- **Profile Management**: Edit display name, bio, location
- **Profile Image**: Upload and crop profile pictures with drag-to-adjust
- **Social Links**: Add, edit, reorder, and toggle visibility of links
- **Live Preview**: Real-time preview of your public profile
- **Auto-save**: Changes automatically save after 2 seconds

### 🎨 Supported Social Platforms
- Twitter/X
- Instagram
- YouTube
- TikTok
- LinkedIn
- GitHub
- Twitch
- Facebook
- Custom Website
- Email

### 📈 Analytics Dashboard
- **Overview Stats**: Total views, unique visitors, link clicks, CTR
- **Time Range Filters**: Today, 7 days, 30 days, All time
- **Device Breakdown**: Mobile, Desktop, Tablet distribution
- **Geographic Data**: Views by country with visual charts
- **Link Performance**: Click tracking for each link
- **Traffic Sources**: Referrer analysis

### 👤 Public Profiles
- Clean, mobile-first profile pages at `biofolio.link/u/username`
- One-tap share functionality
- Copy link to clipboard
- Animated social link buttons
- Location display
- Profile view tracking

### 🎨 Design Page (Coming Soon)
- Custom theme builder
- Font customization
- Color palette selection
- Layout options

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 14.2.18 | React framework with App Router |
| [React](https://react.dev/) | 18 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4.1 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | 12.x | Animations |
| [Lucide React](https://lucide.dev/) | 0.468.0 | Icon library |
| [Radix UI](https://www.radix-ui.com/) | Latest | Accessible components |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| [Supabase](https://supabase.com/) | Backend-as-a-Service |
| PostgreSQL | Database (via Supabase) |
| Supabase Auth | Authentication |
| Supabase Storage | Profile image storage |
| Row Level Security | Data protection |

---

## 📁 Project Structure

```
biofolio/
├── app/                          # Next.js App Router
│   ├── analytics/               # Analytics dashboard page
│   ├── auth/                    # Authentication page
│   ├── blog/                    # Blog (coming soon)
│   ├── careers/                 # Careers (coming soon)
│   ├── dashboard/               # Main dashboard
│   ├── design/                  # Design customization (coming soon)
│   ├── design-studio/           # Design studio (coming soon)
│   ├── privacy/                 # Privacy policy page
│   ├── templates/               # Templates (coming soon)
│   ├── u/[username]/            # Public profile pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
│
├── components/                   # Reusable components
│   ├── AnalyticsSection.tsx     # Landing page analytics section
│   ├── BrandsMarquee.tsx        # Scrolling brand logos
│   ├── CTASection.tsx           # Call-to-action section
│   ├── DashboardNav.tsx         # Dashboard navigation with profile dropdown
│   ├── EditorSection.tsx        # Landing page editor preview
│   ├── Footer.tsx               # Site footer
│   ├── HeroSection.tsx          # Landing page hero
│   ├── ImageCropper.tsx         # Profile image cropper
│   └── Navbar.tsx               # Landing page navigation
│
├── lib/                          # Utility libraries
│   ├── analytics.ts             # Analytics tracking functions
│   └── supabase.ts              # Supabase client configuration
│
├── public/                       # Static assets
│   ├── logo.png                 # Icon logo
│   └── logo-full.png            # Full logo with text
│
├── supabase-schema.sql          # Core database schema
├── supabase-analytics-schema.sql # Analytics tables schema
├── ANALYTICS_DOCUMENTATION.md   # Analytics system docs
│
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/biofolio.git
   cd biofolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the following SQL files in your Supabase SQL Editor:
   - `supabase-schema.sql` - Core tables (profiles, links)
   - `supabase-analytics-schema.sql` - Analytics tables

5. **Create Supabase Storage bucket**
   
   Create a bucket named `profile-images` with public access for profile pictures.

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Schema

### Core Tables

#### `linkfolio_profiles`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to auth.users |
| username | TEXT | Unique username for public URL |
| display_name | TEXT | Public display name |
| bio | TEXT | Profile bio/description |
| location | TEXT | User's location |
| profile_image | TEXT | URL to profile picture |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `linkfolio_links`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to auth.users |
| type | TEXT | Link type (twitter, instagram, etc.) |
| title | TEXT | Link button text |
| url | TEXT | Destination URL |
| icon | TEXT | Icon identifier |
| color | TEXT | Button color class |
| visible | BOOLEAN | Show/hide toggle |
| sort_order | INTEGER | Display order |

### Analytics Tables

- `analytics_profile_views` - Individual view events
- `analytics_link_clicks` - Individual click events
- `analytics_daily_stats` - Aggregated daily statistics
- `analytics_country_stats` - Geographic breakdown
- `analytics_link_stats` - Per-link performance

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#050505` | Primary dark background |
| Surface | `#0a0a0a` | Cards, navigation |
| Primary | `#22c55e` | Green accent, CTAs |
| Text Primary | `#ffffff` | Headings |
| Text Secondary | `#9ca3af` | Body text |
| Border | `rgba(255,255,255,0.1)` | Subtle borders |

### Typography

- **Primary Font**: Plus Jakarta Sans (sans-serif)
- **Accent Font**: Instrument Serif (serif, for italics)

### Animation Principles

- Smooth easing: `[0.22, 1, 0.36, 1]`
- Staggered reveals for lists
- Subtle hover transitions
- Glassmorphism with backdrop blur
- Gradient glow effects

---

## 📱 Pages Overview

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Landing page | ✅ Complete |
| `/auth` | Login/Register | ✅ Complete |
| `/dashboard` | Profile editor | ✅ Complete |
| `/analytics` | Analytics dashboard | ✅ Complete |
| `/design` | Theme customization | 🚧 Coming Soon |
| `/u/[username]` | Public profiles | ✅ Complete |
| `/privacy` | Privacy policy | ✅ Complete |
| `/templates` | Template gallery | 🚧 Coming Soon |
| `/design-studio` | Advanced editor | 🚧 Coming Soon |
| `/blog` | Blog/Updates | 🚧 Coming Soon |
| `/careers` | Job listings | 🚧 Coming Soon |

---

## 🔒 Security Features

- **Row Level Security (RLS)**: All database tables protected
- **Authenticated Routes**: Dashboard requires login
- **Secure Image Upload**: Validated file types and sizes
- **Hashed Analytics**: IP addresses are hashed for privacy
- **HTTPS Only**: Secure connections enforced

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👨‍💻 Developer

<div align="center">

**Built with ❤️ by [Travis Moore (Angelo Asante)](https://angeloasante.com)**

[![Website](https://img.shields.io/badge/Website-22c55e?style=for-the-badge&logo=google-chrome&logoColor=white)](https://angeloasante.com)

</div>

---

## 📞 Support

For support, email [support@biofolio.link](mailto:support@biofolio.link) or visit [angeloasante.com](https://angeloasante.com) for updates.

---

<div align="center">

**© 2025 BioFolio. All rights reserved.**

</div>
