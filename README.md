# Arc Education - School Management System

Arc Education is a comprehensive school management system built with Next.js that provides a complete solution for educational institutions to manage their day-to-day operations efficiently.

## 🌟 Features

### 🔐 Authentication & Role Management

- **Multi-role authentication system** with Admin, Teacher, and Student roles
- **Protected routes** with role-based access control
- **Demo data integration** for quick testing and development

### 👥 User Management

- **Student Management**: Complete student records with guardian information
- **Teacher Management**: Staff profiles and contact details
- **Admin Dashboard**: Comprehensive oversight of all school operations
- **CSV Import/Export**: Bulk import of student and teacher data

### 📚 Academic Management

- **Lesson Plans**: Create, edit, and view detailed lesson plans and syllabuses
- **Subject Management**: Organize subjects by class levels (Primary, JHS, SHS)
- **Class Organization**: Structured class management system
- **Assignment Tracking**: Monitor student assignments and progress

### 📊 Attendance System

- **Real-time attendance tracking** for both students and teachers
- **Multiple status options**: Present, Absent, Late
- **Historical attendance records** with date-based filtering
- **Attendance statistics and summaries**

### 🏫 Institution Management

- **Institution Setup**: Complete school profile configuration
- **Multi-sector support**: Creche, Kindergarten, Nursery, Primary, Junior High, Senior High
- **Contact Information**: Admin and school details management
- **Settings Configuration**: Customizable school preferences

### 🎯 Dashboard Features

- **Role-specific dashboards** tailored for Admin, Teacher, and Student views
- **Quick action buttons** for common tasks
- **Statistics and analytics** overview
- **Recent activity tracking**

### 🔧 System Features

- **Responsive design** that works on desktop and mobile devices
- **Modern UI/UX** with Tailwind CSS styling
- **Local storage integration** for demo data persistence
- **Form validation** with error handling
- **Loading states** and user feedback

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd arc
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Demo Access

The application includes demo data for testing:

- **Admin**: Use any name starting with "A" or email containing "admin"
- **Teacher**: Use any name starting with "T" or email containing "teacher"
- **Student**: Use any name starting with "S" or email containing "student"

## 📱 Application Structure

### Pages & Routes

- `/` - Welcome page with feature overview
- `/admin` - Administrative dashboard
- `/teacher` - Teacher dashboard
- `/student` - Student dashboard
- `/lesson-plans` - Lesson plan management
- `/students` - Student management
- `/teachers` - Teacher management
- `/attendance` - Attendance tracking
- `/profile` - User profile management
- `/settings` - Application settings
- `/institution-setup` - School setup wizard

### Key Components

- **Sidebar**: Role-based navigation component
- **ProtectedRoute**: Authentication wrapper for secure pages
- **FormInput**: Reusable form input component with validation
- **AuthContext**: Global authentication state management

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: JavaScript/JSX
- **Authentication**: Custom context-based auth
- **Data Storage**: Local Storage (demo), ready for database integration
- **Icons**: Heroicons (SVG)
- **Fonts**: Geist Sans & Geist Mono

## 📋 Recent Updates

### ✅ Completed Features

- Multi-role authentication system
- Comprehensive dashboard for all user types
- Student and teacher management with CSV import
- Lesson plan creation and management system
- Attendance tracking with historical data
- Institution setup and profile management
- Responsive sidebar with role-based navigation
- Settings page with notification preferences
- Profile editing capabilities
- Form validation and error handling

### 🔄 Current Improvements

- Enhanced UI/UX with consistent styling
- Improved form validation and user feedback
- Better responsive design for mobile devices
- Optimized navigation and user experience

## 🎨 Design System

### Color Palette

- **Primary**: `#037764` (Teal)
- **Secondary**: `#FED703` (Yellow)
- **Background**: `#F9FEFA` (Light green)
- **Text**: Various gray shades for hierarchy

### Typography

- **Font Family**: Geist Sans for body text, Geist Mono for code
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

## 📄 File Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── teacher/           # Teacher dashboard
│   ├── student/           # Student dashboard
│   ├── lesson-plans/      # Lesson plan management
│   ├── students/          # Student management
│   ├── teachers/          # Teacher management
│   ├── attendance/        # Attendance system
│   ├── profile/           # User profiles
│   ├── settings/          # App settings
│   └── institution-setup/ # School setup
├── components/            # Reusable components
│   ├── Sidebar.jsx       # Navigation sidebar
│   ├── ProtectedRoute.jsx # Auth wrapper
│   └── FormInput.jsx     # Form input component
├── contexts/              # React contexts
│   └── AuthContext.jsx   # Authentication context
└── globals.css           # Global styles
```

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [React Documentation](https://reactjs.org/docs) - React library documentation

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Real-time notifications
- Email integration
- Advanced analytics and reporting
- Mobile app development
- Parent portal
- Online examination system
- Fee management
- Library management
- Transport management

---

**Arc Education** - Empowering educational institutions with modern technology solutions.
