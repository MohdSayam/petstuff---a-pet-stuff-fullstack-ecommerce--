import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import { Store, MapPin, Mail, AlignLeft, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

function CreateStoreForm() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name:"",
        description: "",
        email: "",
        location: ""
    })

    const locations = [
        "Delhi, India", "Mumbai, India", "Hyderabad, India", 
        "Kolkata, India", "Bengaluru, India", "Chennai, India", 
        "Pune, India", "Dehradun, India", "Aurangabad, India", 
        "Lucknow, India", "Bhopal, India",
        ];

    const handleChange = (e)=>{
        const {name, value} = e.target
        setFormData({...formData, [name]:value})
    }

    const handleSubmit =async (e)=> {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await API.post("/store/create", formData)
            console.log("Success from backend", response.data)

            toast.success("Welcome to the family! Store created 🐾")
            navigate("/admin/store")

        } catch (error) {
            console.log("Store creation error", error.response?.data)
            toast.error(error.response?.data?.message || "Something went wrong")
        }finally{
            setLoading(false)
        }
    }

  return (
        <div className="max-w-3xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <Sparkles className="text-brand-primary" /> Setup Your Shop
                </h1>
                <p className="text-slate-500 mt-2">Enter your business details to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
                
                {/* Store Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Store size={16} className="text-brand-primary" /> Store Name
                        </label>
                        <input 
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Sayam's Pet Haven"
                            className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Mail size={16} className="text-brand-primary" /> Business Email
                        </label>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="hello@yourstore.com"
                            className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Location Dropdown */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <MapPin size={16} className="text-brand-primary" /> Store Location
                    </label>
                    <select 
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all bg-white cursor-pointer"
                        required
                    >
                        <option value="">Select your city...</option>
                        {locations.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {/* Cooler Description (Textarea) */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <AlignLeft size={16} className="text-brand-primary" /> Store Story (Description)
                    </label>
                    <textarea 
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell your customers what makes your pet store special..."
                        className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all resize-none"
                        required
                    />
                    <p className="text-[10px] text-slate-400 italic">This will appear on your public store profile.</p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full md:w-max px-10 rounded-2xl py-4 font-bold text-white text-lg transition-all shadow-lg ${
                            loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-primary shadow-orange-200 hover:brightness-110 active:scale-95'
                        }`}
                    >
                        {loading ? "Launching Shop... 🐾" : "Launch My Store"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateStoreForm