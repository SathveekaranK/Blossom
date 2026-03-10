# Blossom 🌸
A premium, modern e-commerce platform for high-end beauty rituals and botanical essences.

## Project Structure
The Blossom platform is built as a full-stack monorepo, with a dedicated `frontend` and `backend`.

```text
Blossom/
├── frontend/  # React + Vite + Tailwind CSS
├── backend/   # Express + Prisma + PostgreSql (Suppabase)
└── README.md
```

## 🛠️ Technology Stack
### Frontend
- **Framework**: React 18+
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Build Tool**: Vite

### Backend
- **Server**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (hosted on Supabase)
- **Authentication**: JWT & Bcrypt

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/SathveekaranK/Blossom.git
    cd Blossom
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create a .env file based on the environment requirements
    # Run migrations if necessary: npx prisma migrate dev
    npm run dev
    ```

## 🎨 Design Philosophy
Blossom is designed around a **Scientific Luxury** aesthetic. Every interaction, from the parallax backgrounds to the "B-Logo" range slider, is engineered to feel premium and intentional.

- **Primary Color**: `#D4AF37` (Metallic Gold)
- **Secondary Color**: `#FFB7C5` (Cherry Blossom)
- **Dark Theme Accent**: Midnight Black for high-density components.

## 📱 Mobile Responsiveness
The platform is fully optimized for touch devices, with unique "Tap-to-Reveal" product rituals and a specialized mobile navigation menu designed for single-hand ergonomics.

---

Created with ❤️ by the Blossom Team.
