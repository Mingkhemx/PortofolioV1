import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Award, LogOut, Menu, X } from 'lucide-react';
import ProjectManager from './ProjectManager';
import CertificateManager from './CertificateManager';
import ErrorBoundary from '../../components/ErrorBoundary';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('projects');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/admin');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#030014]">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!user) return null;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#030014] flex text-white font-poppins">
            {/* Mobile Sidebar Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/90 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <LayoutDashboard className="text-indigo-500" size={32} />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <button
                            onClick={() => { setActiveTab('projects'); setIsSidebarOpen(false); }} // Close sidebar on mobile
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'projects'
                                ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <FolderKanban size={20} />
                            <span className="font-medium">Projects</span>
                        </button>

                        <button
                            onClick={() => { setActiveTab('certificates'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'certificates'
                                ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Award size={20} />
                            <span className="font-medium">Certificates</span>
                        </button>
                    </nav>

                    <div className="pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3 px-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                                {user?.email?.[0]?.toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                                <p className="text-xs text-green-400">Online</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full lg:w-auto overflow-y-auto h-screen p-4 lg:p-8 pt-16 lg:pt-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030014] to-[#030014]">
                <div className="max-w-7xl mx-auto">
                    <ErrorBoundary>
                        {activeTab === 'projects' ? <ProjectManager /> : <CertificateManager />}
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
