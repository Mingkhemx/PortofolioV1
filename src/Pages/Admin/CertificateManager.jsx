import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Loader2, X, Save } from 'lucide-react';

const CertificateManager = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'certificates'));
            const certList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCertificates(certList);
        } catch (error) {
            console.error("Error fetching certificates: ", error);
        } finally {
            setLoading(false);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageUrl) return;

        setUploading(true);
        try {
            await addDoc(collection(db, 'certificates'), {
                Img: imageUrl
            });

            setIsModalOpen(false);
            setImageUrl('');
            fetchCertificates();
        } catch (error) {
            console.error("Error adding certificate: ", error);
            alert("Error adding certificate");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this certificate?')) {
            try {
                await deleteDoc(doc(db, 'certificates', id));
                fetchCertificates();
            } catch (error) {
                console.error("Error deleting certificate: ", error);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Manage Certificates</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Certificate
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-indigo-500" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="relative group rounded-xl overflow-hidden shadow-lg border border-white/10 bg-slate-900/50">
                            <div className="aspect-video w-full overflow-hidden">
                                <img
                                    src={cert.Img}
                                    alt="Certificate"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(cert.id)}
                                    className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-all transform hover:scale-110"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                Add New Certificate
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
                                <label className="block text-gray-300 text-sm font-medium mb-2">Certificate Image URL</label>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-500"
                                    placeholder="https://example.com/certificate.jpg"
                                    required
                                />
                            </div>

                            {imageUrl && (
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 mt-4">
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                                        }}
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading || !imageUrl}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Save
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

export default CertificateManager;
