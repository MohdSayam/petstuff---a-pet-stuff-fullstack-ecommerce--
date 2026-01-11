import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import API from '../api/axios'
import toast from 'react-hot-toast'
import FullPageLoader from '../loading/FullPageLoader'

function Login() {
    const navigate = useNavigate()
    const {login} = useContext(AuthContext);
    const [loading,setLoading] = useState(false)

    const [formData,setFormData]=useState({
        email:"",
        password:""  
    })

    const handleChange = (e)=>{
        const {name, value} = e.target
        setFormData({...formData, [name]:value})
    }

    const handleSubmit =async (e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            const response = await API.post('/auth/login', formData)
            // agar sahi chala yaha tak to 
            const { user, token } = response.data;
            login(user, token);
            
            toast.success(`Welcome back ${user.name}!🐾`)
        
            // Role-based redirect
            if (user.role === 'admin') {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid email or password")
        }finally{
            setLoading(false)
        }
    }

    if (loading){
        return <FullPageLoader/>
    }

  return (
     <div className='flex min-h-screen items-center justify-center bg-brand-light px-4 py-10'>
        {/* form details div inside that main div */}
        <div className='w-full sm:max-w-md md:w-[45%] lg:w-[35%] xl:w-[30%] rounded-3xl bg-white p-8 md:p-10 shadow-2xl border border-slate-100'>
            
            <h1 className='text-3xl font-extrabold text-brand-dark mb-2 text-center'>PetStuff 🐾</h1>
            <p className='text-center text-slate-500 mb-8'>Hello! How is your pet.</p>
            
            <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className='mb-5'>
                    <label className='block text-sm font-bold text-slate-700 mb-2'>Email Address</label>
                    <input
                        type="email"
                        name='email'
                        value={formData.email}
                        onChange= {handleChange}
                        placeholder='john@example.com'
                        className='w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all'
                        required
                    />
                </div>

                {/* Password Field */}
                <div className='mb-5'>
                    <label className='block text-sm font-bold text-slate-700 mb-2'>Password</label>
                    <input 
                        type="password"
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='••••••••'
                        className='w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all'
                        required
                    />
                </div>

                {/* Button */}
                <button 
                    type="submit"
                    disabled={loading} // Prevent double clicks!
                    className={`w-full rounded-2xl py-4 font-bold text-white text-lg transition-all ${
                        loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-brand-primary shadow-xl hover:brightness-110 active:scale-95'
                    }`}
                    >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                        Processing... 🐾
                        </span>
                    ) : (
                        "Login"
                    )}
                    </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
                Hey you have to register first!
                <Link to="/register" className='text-brand-primary font-bold hover:underline ml-1'>Register Now</Link>
            </div>
        </div>
    </div>
  )
}

export default Login