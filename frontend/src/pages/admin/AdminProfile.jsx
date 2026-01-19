import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from "../../context/AuthContext"
import { User, Mail, ShieldCheck, Calendar, Save, Edit3, Lock, X, LogOut } from 'lucide-react';
import API from '../../api/axios';
import toast from "react-hot-toast"

function AdminProfile() {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const { logout } = useContext(AuthContext)

  // local state for form
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    // Only sync from global user to form if we are NOT in the middle of editing
    if (user && !isEditing) {
      setFormData({
        name: user.name,
        email: user.email,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [user, isEditing]);


  // kya kuch change hua hai 
  const hasChanges =
    formData.name !== user?.name ||
    formData.email !== user?.email ||
    (formData.oldPassword && formData.newPassword && formData.confirmNewPassword);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await API.put('/auth/edit', formData);

      // did password changed
      const isPasswordChanged = formData.newPassword.length > 0;

      if (isPasswordChanged) {
        toast.success("Password Changed Successfully! Please login again!")
        setTimeout(() => {
          logout()
        }, 2000);
      } else {
        // SUCCESS PATH
        // 1. Update global state (This refreshes the Sidebar/Header/Card)
        setUser(res.data.user);

        // 2. Close the form
        setIsEditing(false);

        toast.success("Profile updated successfully! 🐾");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Update failed");
      } else {
        console.error("Frontend Logic Error:", error);
        toast.error("UI Sync Error. Please refresh.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Profile</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your personal admin identity</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${isEditing ? 'bg-slate-100 text-slate-600' : 'bg-brand-primary text-white shadow-lg shadow-orange-100'
            }`}
        >
          {isEditing ? <><X size={18} /> Cancel</> : <><Edit3 size={18} /> Edit Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Identity Card */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
            {/* The Huge Avatar */}
            <div className="w-32 h-32 mx-auto bg-linear-to-tr from-orange-400 to-brand-primary rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-orange-100 mb-6">
              {user?.name?.charAt(0)}
            </div>

            <h2 className="text-2xl font-black text-slate-800 leading-tight">{user?.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="bg-brand-dark text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck size={12} /> {user?.role}
              </span>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
              <div className="flex items-center gap-3 text-slate-500">
                <Mail size={16} className="text-brand-primary" />
                <span className="text-sm font-medium truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Calendar size={16} className="text-brand-primary" />
                <span className="text-sm font-medium">Joined {new Date(user?.createdAt).getFullYear() || '2025'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">

            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
                <User size={18} className="text-brand-primary" /> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                  <input
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/20 outline-none font-bold disabled:opacity-60 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                  <input
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/20 outline-none font-bold disabled:opacity-60 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Security Section - Only shows if Editing */}
            {isEditing && (
              <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
                  <Lock size={18} className="text-brand-primary" /> Change Password
                </h3>

                {/* Check if user signed up with Google (no password) */}
                {user?.googleId ? (
                  <div className="bg-blue-50 p-4 rounded-2xl text-center">
                    <p className="text-blue-600 font-medium text-sm">
                      You signed in with Google. Password change is not available for Google accounts.
                    </p>
                    <p className="text-blue-400 text-xs mt-1">
                      Your account is secured by Google authentication.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={formData.oldPassword}
                      onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                      className="w-full p-4 bg-orange-50/50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="password"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={formData.confirmNewPassword}
                        onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                        className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Save Button - The "Greyed Out" Logic */}
            {isEditing && (
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={!hasChanges || loading}
                  className={`w-full md:w-max px-10 py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 transition-all shadow-xl ${!hasChanges || loading
                      ? "bg-slate-200 cursor-not-allowed shadow-none"
                      : "bg-brand-primary shadow-orange-100 hover:scale-105 active:scale-95"
                    }`}
                >
                  <Save size={20} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;