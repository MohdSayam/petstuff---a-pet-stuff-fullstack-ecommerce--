import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import API from '../../api/axios';
import FullPageLoader from '../../loading/FullPageLoader';
import { useNavigate } from 'react-router-dom'
import { Plus, PackageSearch, Trash2, Edit3, ExternalLink } from 'lucide-react';

function AdminProducts() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await API.get('/store/products')
                setProducts(res.data.data)
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                // Don't show error for 404 (no store or products yet)
                if (error.response?.status !== 404) {
                    toast.error("Failed to load inventory!")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // Delete product
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This will delete the product permanently! 🐾")) return;
        try {
            const res = await API.delete(`/products/delete/${id}`)

            if (res.status === 200) {
                toast.success("Product removed")
                setProducts((prev) => prev.filter(p => p._id !== id))
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Delete Failed!")
        }
    }

    if (loading) return <FullPageLoader />

    return (
        <div className='space-y-8'>
            {/* Header section */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h1 className='text-3xl font-black text-slate-800 tracking-tight'>Inventory</h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Manage <span className="text-brand-primary font-bold">{products.length}</span> active listings
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin/products/add')}
                    className='bg-brand-dark text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95'
                >
                    <Plus size={20} /> New Product
                </button>
            </div>

            {/* Empty State */}
            {products.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100'>
                    <div className='bg-slate-50 p-6 rounded-full mb-4 text-slate-300'>
                        <PackageSearch size={48} />
                    </div>
                    <h2 className='text-xl font-bold text-slate-700'>No products found</h2>
                    <p className='text-slate-400 mb-6 text-sm'>Start by adding your first pet supply item.</p>
                    <button onClick={() => navigate('/admin/products/add')} className='bg-brand-primary text-white px-6 py-2 rounded-xl font-bold'>
                        Add Product
                    </button>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {products.map((product) => (
                        <div key={product._id} className='group bg-white rounded-[2.5rem] p-4 border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-500'>

                            {/* Clickable image */}
                            <div
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="aspect-square rounded-4xl bg-slate-100 mb-4 overflow-hidden relative cursor-pointer"
                                title="View on Live Shop"
                            >
                                <img
                                    src={product.images[0]?.url}
                                    alt={product.productName}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-white/90 p-3 rounded-full text-slate-900 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                        <ExternalLink size={20} />
                                    </div>
                                </div>

                                {/* Stock Badge */}
                                <div className="absolute top-3 right-3 pointer-events-none">
                                    {product.stock === 0 ? (
                                        <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Out of Stock</span>
                                    ) : product.stock <= 5 ? (
                                        <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Low: {product.stock}</span>
                                    ) : null}
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="px-2 space-y-1">
                                <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{product.animalType}</p>
                                <h3 className="font-bold text-slate-800 truncate leading-tight">{product.productName}</h3>

                                <div className="flex items-center gap-2 pt-1">
                                    <span className="text-lg font-black text-slate-900">₹{product.salePrice}</span>
                                    {product.discountPercentage > 0 && (
                                        <span className="text-xs text-slate-300 line-through font-medium">₹{product.originalPrice}</span>
                                    )}
                                </div>
                            </div>

                            {/* Actions Area */}
                            <div className="flex gap-2 mt-5">
                                <button
                                    onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                    className="flex-1 bg-slate-50 hover:bg-brand-primary hover:text-white text-slate-600 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit3 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminProducts;