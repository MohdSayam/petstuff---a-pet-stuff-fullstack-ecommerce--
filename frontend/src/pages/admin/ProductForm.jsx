import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import {
  Image as ImageIcon, Trash2, Save,
  ArrowLeft, AlignLeft, Percent, UploadCloud, X
} from 'lucide-react';

const ProductForm = ({ mode = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState("");

  // Image state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Form fields
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    originalPrice: "",
    salePrice: "",
    discountPercentage: "",
    stock: "",
    animalType: "Dog",
    productType: "Food",
  });

  // Initialize form and fetch data for edit mode
  useEffect(() => {
    const initForm = async () => {
      try {
        const storeRes = await API.get("/store/me")
        setStoreId(storeRes.data.store._id)

        if (mode === "edit" && id) {
          const productRes = await API.get(`/products/admin/${id}`)
          const data = productRes.data;
          setFormData({
            productName: data.productName,
            description: data.description,
            originalPrice: data.originalPrice,
            salePrice: data.salePrice,
            discountPercentage: data.discountPercentage,
            stock: data.stock,
            animalType: data.animalType,
            productType: data.productType
          })
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Initialization Failed")
      } finally {
        setLoading(false)
      }
    }
    initForm()
  }, [mode, id]);

  // Auto-calculate sale price
  useEffect(() => {
    const original = Number(formData.originalPrice)
    const discount = Number(formData.discountPercentage)
    if (!isNaN(original) && original > 0) {
      const reduction = (original * discount) / 100
      setFormData(prev => ({ ...prev, salePrice: (original - reduction).toFixed(2) }))
    }
  }, [formData.originalPrice, formData.discountPercentage]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "discountPercentage") {
      if (value === "") { setFormData({ ...formData, discountPercentage: "" }) }
      const intValue = Math.max(0, Math.min(100, Number(value)))
      setFormData({ ...formData, discountPercentage: intValue })
    }
    setFormData({ ...formData, [name]: value })
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // Limit check
    if (selectedFiles.length + files.length > 5) {
      return toast.error("Maximum 5 images are allowed")
    }

    // create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...files])
    setImagePreviews((prev) => [...prev, ...newPreviews])
  }

  // Remove selected image
  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)

    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index])

    setSelectedFiles(newFiles)
    setImagePreviews(newPreviews)
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (selectedFiles.length < 3 && mode == "add") {
      return toast.error("Please upload atleast 3 images")
    }

    setLoading(true)

    try {
      // Build FormData
      const data = new FormData()

      // Add text fields
      data.append("productName", formData.productName)
      data.append("description", formData.description);
      data.append("originalPrice", formData.originalPrice);
      data.append("salePrice", formData.salePrice);
      data.append("discountPercentage", formData.discountPercentage);
      data.append("stock", formData.stock);
      data.append("animalType", formData.animalType);
      data.append("productType", formData.productType);
      data.append("store", storeId);

      // Add image files
      selectedFiles.forEach((file) => {
        data.append("images", file)
      })

      if (mode === "add") {
        await API.post('/products/create', data)
        toast.success("Product launched successfully!")
      } else {
        await API.put(`/products/update/${id}`, data)
        toast.success("Product updated successfully!")
      }
      navigate('/admin/products')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Operation Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
          {mode === "add" ? "New Listing" : "Update Listing"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Details (Unchanged) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            {/* Inputs for Name, Description, Prices */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Product Name</label>
              <input name="productName" required value={formData.productName} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary/20" placeholder="e.g. Organic Puppy Treats" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Description</label>
              <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none resize-none focus:ring-2 focus:ring-brand-primary/20" placeholder="Details..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Animal</label>
                <select name="animalType" value={formData.animalType} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none"><option>Dog</option><option>Cat</option><option>Bird</option><option>Other</option></select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
                <select name="productType" value={formData.productType} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none"><option>Food</option><option>Toys</option><option>Accessories</option><option>Medicines</option><option>Grooming</option><option>Snacks</option></select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Price</label>
                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-brand-primary tracking-widest ml-1">Discount %</label>
                <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} className="w-full p-4 bg-orange-50 text-brand-primary border border-orange-100 rounded-2xl outline-none font-black" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Stock</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Final Price</span>
              <span className="text-2xl font-black">₹{formData.salePrice || "0.00"}</span>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon size={18} className="text-brand-primary" /> Product Images
            </h3>

            {/* Drop Zone */}
            <div className="relative group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={selectedFiles.length >= 5}
              />
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 group-hover:bg-slate-100 transition-colors group-hover:border-brand-primary">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-brand-primary">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700">Click to upload</p>
                <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (Max 5)</p>
              </div>
            </div>

            {/* Image Previews */}
            <div className="space-y-3">
              {imagePreviews.length === 0 && (
                <p className="text-xs text-center text-slate-400 italic py-2">No images selected</p>
              )}

              {imagePreviews.map((src, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{selectedFiles[index]?.name}</p>
                    <p className="text-[10px] text-slate-400">{(selectedFiles[index]?.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Count */}
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>{selectedFiles.length} / 5 Images</span>
              {selectedFiles.length < 3 && <span className="text-red-400">Min 3 required</span>}
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-brand-primary text-white p-6 rounded-4xl font-black shadow-xl shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {loading ? "Uploading... 🐾" : <><Save size={22} /> {mode === "add" ? "Launch Listing" : "Save Changes"}</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;