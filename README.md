# InvenTrack Pro - Professional Inventory Management System

![InvenTrack Pro Logo](./client/public/logo.png)

## Overview
InvenTrack Pro is a comprehensive inventory management solution designed for businesses of all sizes. It offers a streamlined interface to manage, track, and organize your product inventory with powerful features for categorization, filtering, and reporting.

## Features
- **User Authentication**: Secure login and registration system
- **Product Management**: Add, edit, view, and delete products
- **Advanced Filtering**: Filter products by name, category, and price range
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Eye-friendly interface for day and night use
- **Profile Management**: Update user profile and account settings

## Tech Stack

### Frontend
- React.js with TypeScript
- TailwindCSS for styling
- Shadcn/UI component library
- React Query for state management
- Wouter for routing

### Backend
- Node.js + Express
- PostgreSQL database with Drizzle ORM
- JWT authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js v16 or higher
- PostgreSQL database

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/inventrackpro.git
cd inventrackpro
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit the .env file with your database credentials
```

4. Run database migrations
```bash
npm run db:push
```

5. Start the development server
```bash
npm run dev
```

6. Access the application at `http://localhost:5000`

## Project Structure

```
/
├── client/               # Frontend code
│   ├── src/              # React source files
│   ├── public/           # Static assets
│   └── index.html        # HTML entry point
├── server/               # Backend code
│   ├── routes/           # API routes
│   ├── db.ts             # Database connection
│   └── index.ts          # Server entry point
├── shared/               # Shared code (types, utilities)
│   └── schema.ts         # Database schema definitions
├── inventrackpro.config.js  # Application configuration
└── workspace.setup.json    # Development workspace settings
```

## Contributing
We welcome contributions! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For support or inquiries, please contact support@yourcompany.com.

---

© 2025 Your Company Name. All rights reserved.