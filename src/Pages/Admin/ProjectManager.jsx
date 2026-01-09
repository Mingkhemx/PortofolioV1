import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, Save, Loader2 } from 'lucide-react';

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [formData, setFormData] = useState({
        Title: '',
        Description: '',
        Link: '',
        TechStack: [],
        Img: ''
    });
    const [uploading, setUploading] = useState(false);
    const [techInput, setTechInput] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'projects'));
            const projectList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectList);
        } catch (error) {
            console.error("Error fetching projects: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddTech = (e) => {
        if (e.key === 'Enter' && techInput.trim()) {
            e.preventDefault();
            setFormData(prev => ({
                ...prev,
                TechStack: [...(prev.TechStack || []), techInput.trim()]
            }));
            setTechInput('');
        }
    };

    const removeTech = (index) => {
        setFormData(prev => ({
            ...prev,
            TechStack: (prev.TechStack || []).filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const projectData = {
                ...formData,
                TechStack: Array.isArray(formData.TechStack) ? formData.TechStack : []
            };

            if (currentProject) {
                const projectRef = doc(db, 'projects', currentProject.id);
                await updateDoc(projectRef, projectData);
            } else {
                await addDoc(collection(db, 'projects'), projectData);
            }

            setIsModalOpen(false);
            resetForm();
            fetchProjects();
        } catch (error) {
            console.error("Error saving project: ", error);
            alert("Error saving project: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteDoc(doc(db, 'projects', id));
                fetchProjects();
            } catch (error) {
                console.error("Error deleting project: ", error);
            }
        }
    };

    const openEditModal = (project) => {
        setCurrentProject(project);
        setFormData({
            Title: project.Title || '',
            Description: project.Description || '',
            Link: project.Link || '',
            TechStack: Array.isArray(project.TechStack) ? project.TechStack : [],
            Img: project.Img || ''
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentProject(null);
        setFormData({
            Title: '',
            Description: '',
            Link: '',
            TechStack: [],
            Img: ''
        });
        setTechInput('');
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Manage Projects</h2>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Project
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-indigo-500" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden group">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={project.Img}
                                    alt={project.Title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => openEditModal(project)}
                                        className="p-2 bg-yellow-500/80 hover:bg-yellow-500 text-white rounded-full transition-colors"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-white mb-2">{project.Title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.Description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {(Array.isArray(project.TechStack) ? project.TechStack : []).map((tech, index) => (
                                        <span key={index} className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                            <h2 className="text-xl font-bold text-white">
                                {currentProject ? 'Edit Project' : 'Add New Project'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Project Image URL</label>
                                <input
                                    type="text"
                                    name="Img"
                                    value={formData.Img}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-500"
                                    placeholder="https://example.com/image.jpg"
                                    required
                                />
                            </div>

                            {formData.Img && (
                                <div className="relative h-48 w-full mx-auto overflow-hidden rounded-lg border border-white/10">
                                    <img
                                        src={formData.Img}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                                        }}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    name="Title"
                                    value={formData.Title}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                                <textarea
                                    name="Description"
                                    value={formData.Description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Live Link</label>
                                    <input
                                        type="url"
                                        name="Link"
                                        value={formData.Link}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Tech Stack (Press Enter to add)</label>
                                    <input
                                        type="text"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyDown={handleAddTech}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="e.g. React, Firebase"
                                    />
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {(formData.TechStack || []).map((tech, index) => (
                                            <span key={index} className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-sm flex items-center gap-1">
                                                {tech}
                                                <button type="button" onClick={() => removeTech(index)} className="hover:text-white">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Save Project
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectManager;
