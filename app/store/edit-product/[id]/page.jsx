'use client'
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Upload } from "lucide-react"
import Loading from "@/components/Loading"

export default function EditProductPage() {

    const router = useRouter()
    const { id } = useParams()

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        mrp: "",
        price: "",
        images: [],
    })
    const [loading, setLoading] = useState(true)
    const [imagePreviews, setImagePreviews] = useState([])

    useEffect(() => {
        if (id) {
            fetch(`/api/store/product/${id}`)
                .then(response => response.json())
                .then(data => {
                    setFormData(data)
                    setImagePreviews(data.images)
                    setLoading(false)
                })
        }
    }, [id])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        setFormData({ ...formData, images: files })

        const previews = files.map(file => URL.createObjectURL(file))
        setImagePreviews(previews)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const apiPromise = fetch(`/api/store/product/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            return response.json();
        })
        .then(() => {
            router.push("/store/manage-product")
        });

        toast.promise(apiPromise, {
            loading: 'Updating product...',
            success: 'Product updated successfully!',
            error: 'Failed to update product'
        });
    }

    if (loading) return <Loading />

    return (
        <>
            <div className="flex items-center mb-5">
                <button onClick={() => router.back()} className="mr-2">
                    <ArrowLeft className="text-slate-600" />
                </button>
                <h1 className="text-2xl text-slate-500">Edit <span className="text-slate-800 font-medium">Product</span></h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Product Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows="4" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="mrp" className="block text-sm font-medium text-slate-700">MRP</label>
                        <input type="number" name="mrp" id="mrp" value={formData.mrp} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-slate-700">Selling Price</label>
                        <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" required />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700">Product Images</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-slate-400" />
                            <div className="flex text-sm text-slate-600">
                                <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-slate-600 hover:text-slate-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-slate-500">
                                    <span>Upload files</span>
                                    <input id="images" name="images" type="file" multiple onChange={handleImageChange} className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>

                {imagePreviews.length > 0 && (
                    <div className="mb-4 grid grid-cols-3 gap-4">
                        {imagePreviews.map((src, index) => (
                            <img key={index} src={src} alt={`Preview ${index}`} className="h-24 w-full object-cover rounded-md" />
                        ))}
                    </div>
                )}

                <button type="submit" className="w-full bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700">Update Product</button>

            </form>
        </>
    )
}