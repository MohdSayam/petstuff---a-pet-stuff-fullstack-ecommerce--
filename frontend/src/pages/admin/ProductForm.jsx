import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Image as ImageIcon, Plus, Trash2, Save, 
  ArrowLeft, AlignLeft, Percent 
} from 'lucide-react';

const ProductForm = ({ mode = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState("");

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    originalPrice: "",
    salePrice: "",
    discountPercentage: 0,
    stock: "",
    animalType: "Dog",
    productType: "Food",
    images: ["", "", ""] 
  });

  // 1. Fetch Store and Product Data
  useEffect(() => {
    const initForm = async () => {
      try {
        const storeRes = await API.get('/store/me');
        setStoreId(storeRes.data.store._id);

        if (mode === "edit" && id) {
          const productRes = await API.get(`/products/admin/${id}`);
          const data = productRes.data;
          // Map backend objects back to simple strings for the inputs
          setFormData({
            ...data,
            images: data.images.map(img => img.url)
          });
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Initialization failed");
      }
    };
    initForm();
  }, [mode, id]);

  // 2. Auto-calculate Sale Price
  useEffect(() => {
    const original = parseFloat(formData.originalPrice);
    const discount = parseFloat(formData.discountPercentage);

    if (original && !isNaN(discount)) {
      const reduction = (original * discount) / 100;
      const finalPrice = (original - reduction).toFixed(2);
      setFormData(prev => ({ ...prev, salePrice: finalPrice }));
    }
  }, [formData.originalPrice, formData.discountPercentage]);

  // 3. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    if (formData.images.length < 5) {
      setFormData({ ...formData, images: [...formData.images, ""] });
    }
  };

  const removeImageField = (index) => {
    if (formData.images.length > 3) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: newImages });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedImages = formData.images
      .filter(img => img.trim() !== "")
      .map((imgUrl, index) => ({
        url: imgUrl,
        public_id: `temp_id_${Date.now()}_${index}` 
      }));

    if (formattedImages.length < 3) return toast.error("Min 3 images required");

    setLoading(true);
    try {
      const payload = {
        ...formData,
        store: storeId,
        images: formattedImages,
        originalPrice: Number(formData.originalPrice),
        salePrice: Number(formData.salePrice),
        discountPercentage: Number(formData.discountPercentage),
        stock: Number(formData.stock),
      };

      if (mode === "add") {
        await API.post('/products/create', payload);
        toast.success("Product launched! 🐾");
      } else {
        await API.put(`/products/update/${id}`, payload);
        toast.success("Product updated! ✨");
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

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
        
        {/* LEFT COLUMN: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Product Name</label>
              <input 
                name="productName" required value={formData.productName} onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/20 outline-none font-bold"
                placeholder="e.g. Organic Puppy Treats"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <AlignLeft size={14} /> Description
              </label>
              <textarea 
                name="description" required rows="5" value={formData.description} onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
                placeholder="What makes this product special?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Animal Type</label>
                <select name="animalType" value={formData.animalType} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none cursor-pointer">
                  <option>Dog</option><option>Cat</option><option>Bird</option><option>Fish</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
                <select name="productType" value={formData.productType} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none cursor-pointer">
                  <option>Food</option><option>Toys</option><option>Accessories</option><option>Medicines</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Original ($)</label>
                <input type="number" name="originalPrice" required value={formData.originalPrice} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-brand-primary tracking-widest ml-1 flex items-center gap-1">
                  <Percent size={12}/> Discount %
                </label>
                <input type="number" name="discountPercentage" min="0" max="100" value={formData.discountPercentage} onChange={handleChange} className="w-full p-4 bg-orange-50 text-brand-primary font-black rounded-2xl outline-none border border-orange-100" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Stock</label>
                <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Price Preview</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black">${formData.salePrice || "0.00"}</span>
                  {formData.discountPercentage > 0 && (
                    <span className="text-sm text-slate-500 line-through">${formData.originalPrice}</span>
                  )}
                </div>
              </div>
              {formData.discountPercentage > 0 && (
                <div className="bg-brand-primary text-white px-4 py-2 rounded-xl font-black text-xs animate-bounce">
                  SAVE {formData.discountPercentage}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Images */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon size={18} className="text-brand-primary" /> Gallery
            </h3>
            <div className="space-y-3">
              {formData.images.map((img, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input 
                    required value={img} onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder={`Image URL ${index + 1}`}
                    className="flex-1 p-3 bg-slate-50 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                  {formData.images.length > 3 && (
                    <button type="button" onClick={() => removeImageField(index)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {formData.images.length < 5 && (
                <button type="button" onClick={addImageField} className="w-full py-2 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-50">
                  + Add More
                </button>
              )}
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-brand-primary text-white p-6 rounded-4xl font-black shadow-xl shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {loading ? "Syncing... 🐾" : <><Save size={22}/> {mode === "add" ? "Launch Listing" : "Save Changes"}</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;