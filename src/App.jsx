import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from 'react';
import "./index.css";
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const AnimatedBackground = lazy(() => import("./components/Background"));
const Navbar = lazy(() => import("./components/Navbar"));
const Portofolio = lazy(() => import("./Pages/Portofolio"));
const ContactPage = lazy(() => import("./Pages/Contact"));
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const WelcomeScreen = lazy(() => import("./Pages/WelcomeScreen"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#030014]">
    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <Suspense fallback={<LoadingSpinner />}>
            <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar />
          <AnimatedBackground />
          <Home />
          <About />
          <Portofolio />
          <ContactPage />
          <footer>
            <center>
              <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
              <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
                © 2025{" "}
                <a href="https://flowbite.com/" className="hover:underline">
                  Migwara™
                </a>
                . All Rights Reserved.
              </span>
            </center>
          </footer>
        </Suspense>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <Suspense fallback={<LoadingSpinner />}>
      <ProjectDetails />
    </Suspense>
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Migwara™
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  </>
);

const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const Login = lazy(() => import("./Pages/Admin/Login"));

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
        <Route path="/admin" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        } />
        <Route path="/admin/dashboard" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;