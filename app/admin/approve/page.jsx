
'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"

export default function AdminApproveStores() {

    const [loading, setLoading] = useState(true)
    const [stores, setStores] = useState([])

    const fetchStores = async () => {
        try {
            const response = await fetch('/api/admin/approve');
            const data = await response.json();
            if (response.ok) {
                setStores(Array.isArray(data) ? data : []);
            } else {
                toast.error(data.error || "Failed to fetch stores");
                setStores([]);
            }
        } catch (error) {
            toast.error("Failed to fetch stores");
            setStores([]);
        }
        setLoading(false)
    }

    const handleApproval = async (storeId, status) => {
        const apiPromise = fetch('/api/admin/approve', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ storeId, status })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to ${status === 'approved' ? 'approve' : 'reject'} store`);
            }
            return response.json();
        })
        .then(() => {
            fetchStores();
        });

        toast.promise(apiPromise, {
            loading: `Updating store status...`,
            success: `Store ${status === 'approved' ? 'approved' : 'rejected'} successfully!`,
            error: `Failed to ${status === 'approved' ? 'approve' : 'reject'} store`
        });
    }

    useEffect(() => {
        fetchStores()
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Approve <span className="text-slate-800 font-medium">Stores</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {stores.length === 0 ? (
                    <p>No pending stores found.</p>
                ) : (stores.map(store => (
                    <div key={store.id} className="bg-white rounded-lg shadow-md p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <Image src={store.logo || '/defaults/default-logo.png'} alt={store.name} width={50} height={50} className="rounded-full" />
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">{store.name}</h2>
                                <p className="text-sm text-slate-500">@{store.username}</p>
                            </div>
                        </div>
                        <div className="text-sm text-slate-600 mb-4">
                            <p><strong>Owner:</strong> {store.owner.firstName} {store.owner.lastName}</p>
                            <p><strong>Email:</strong> {store.owner.primaryEmailAddress.emailAddress}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => handleApproval(store.id, 'approved')} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Approve</button>
                            <button onClick={() => handleApproval(store.id, 'rejected')} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Reject</button>
                        </div>
                    </div>
                )))}
            </div>
        </>
    )
}
