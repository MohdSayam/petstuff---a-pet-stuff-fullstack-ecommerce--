import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import FullPageLoader from '../../loading/FullPageLoader';
import { MapPin, Mail, Edit3, Save, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AdminStore() {
  const navigate = useNavigate()
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    location: ""
  });

  const locations = [
    "Delhi, India", "Mumbai, India", "Hyderabad, India", "Kolkata, India",
    "Bengaluru, India", "Chennai, India", "Pune, India", "Dehradun, India",
    "Aurangabad, India", "Lucknow, India", "Bhopal, India",
  ];

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await API.get('/store/me');
        setStore(res.data.store);
        setFormData({
          name: res.data.store.name,
          description: res.data.store.description,
          email: res.data.store.email,
          location: res.data.store.location
        });
      } catch (error) {
        toast.error("Failed to load store details");
        console.log(error.message)
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/store/me/update', formData);
      setStore(res.data.store);
      setIsEditing(false);
      toast.success("Store Updated Successfully ✨");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update Failed");
    }
  };

  const handleDeleteStore = async () => {
    const firstCheck = window.confirm("Are you sure this will remove your all products, analytics etc. related to this store!")
    if (!firstCheck) return 

    const secondCheck = window.confirm("Final Warning: This action can't be reversed!")
    if (!secondCheck) return

    try {
      const res = await API.delete("/store/me/delete")

      toast.success("Store deleted. You are now a free agent")
      console.log(res.message)
      navigate("/admin")
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete store")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <FullPageLoader />;

  return (
    <div className='space-y-8 max-w-5xl animate-in fade-in duration-500'>
      {/* Header with Edit Toggle */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-black text-slate-800'>Store Settings</h1>
          <p className='text-slate-500 text-sm'>Manage your store identity and location</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
            isEditing ? 'bg-slate-100 text-slate-600' : 'bg-brand-primary text-white shadow-lg shadow-orange-200'
          }`}
        >
          {isEditing ? <><X size={18} /> Cancel</> : <><Edit3 size={18} /> Edit Store</>}
        </button>
      </div>

      <form onSubmit={handleUpdate} className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Side: Store Identity Card */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6'>
            <div className='space-y-2'>
              <label className='text-xs font-black uppercase text-slate-400 tracking-widest'>Store Name</label>
              {isEditing ? (
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/20 outline-none font-bold text-xl'
                />
              ) : (
                <h2 className='text-3xl font-black text-brand-dark'>{store.name}</h2>
              )}
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-black uppercase text-slate-400 tracking-widest'>Description</label>
              {isEditing ? (
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className='w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none'
                />
              ) : (
                <p className='text-slate-600 leading-relaxed'>{store.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Info & Save */}
        <div className='space-y-6'>
          <div className='bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4'>
            {/* Email Field */}
            <div className='flex items-center gap-4'>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Mail size={20} /></div>
              <div className='flex-1'>
                <p className='text-[10px] font-bold text-slate-400 uppercase'>Business Email</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className='w-full text-sm font-bold border-b border-slate-100 outline-none focus:border-brand-primary bg-transparent'
                  />
                ) : (
                  <p className='font-bold text-slate-700 text-sm'>{store.email}</p>
                )}
              </div>
            </div>

            {/* Location Dropdown */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><MapPin size={20} /></div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Location</p>
                {isEditing ? (
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-sm font-bold border-b border-slate-100 outline-none bg-transparent cursor-pointer"
                  >
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                ) : (
                  <p className="font-bold text-slate-700 text-sm">{store.location}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <button
              type="submit"
              className="w-full bg-brand-primary text-white p-5 rounded-3xl font-black shadow-xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} /> Save Changes
            </button>
          )}
        </div>
      </form>

      {/* DANGER ZONE */}
      <div className="pt-10 mt-10 border-t border-red-100">
        <div className="bg-red-50 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-red-600 font-black text-xl flex items-center gap-2">
              <Trash2 size={20} /> Danger Zone
            </h3>
            <p className="text-red-400 text-sm max-w-sm">
              Deleting your store will permanently remove all your products and analytics. This action cannot be undone.
            </p>
          </div>
          <button 
          onClick={handleDeleteStore}
          className="bg-white text-red-600 border border-red-200 px-8 py-3 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all">
            Delete Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminStore;