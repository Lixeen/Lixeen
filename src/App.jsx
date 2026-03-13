import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import './App.css'
import Homepage from './pages/homepage'
import ForCompanies from '../src/pages/companies'
import SignUp from './pages/auth/signup'
import SignIn from './pages/auth/signin'
import PrivacyPolicy from './pages/legal/lixeen-privacy-policy'
import TermsOfService from './pages/legal/lixeen-terms-of-service'
import CookiePolicy from './pages/legal/lixeen-cookie-policy'
import Dashboard from './pages/lixeen-dashboard'
import TaskingPage from './pages/task-page'
import ProjectInstructions from './pages/project-instructions'
import HowItWorks from './pages/how-it-works'
import CareersPage from './pages/careers'
import AboutPage from './pages/about'
import ContactPage from './pages/contact'
import HelpCenter from './pages/lixeen-help-center'
import BlogPage from './pages/lixeen-blog'
import BlogPost from './pages/lixeen-blog-post'
import ProtectedRoute from './pages/auth/ProtectedRoute'
import AdminDashboard from './pages/admin'
import NotFound from './components/not-found'
import JobDetailPage from "./pages/job-details";



function App() {


  return (
    <>
      <Routes>

        <Route path="/" element={<Homepage />} />
        <Route path="/seremiat" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/how-it-works" element={<HowItWorks />} />


        <Route path="/careers/:type/:slug" element={<JobDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog-post" element={<BlogPost />} />
        <Route path="/work-for-us" element={<HowItWorks />} />
        <Route path="/task" element={<TaskingPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/project-instructions" element={<ProjectInstructions />} />
        <Route path="/companies" element={<ForCompanies />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  )
}

export default App
