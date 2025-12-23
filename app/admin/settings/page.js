'use client';

import { useState, useEffect } from 'react';

const AdminSettingsPage = () => {
    const [navbarLogo, setNavbarLogo] = useState(null);
    const [navbarDisplayType, setNavbarDisplayType] = useState('image');
    const [navbarText, setNavbarText] = useState('');
    const [heroImage, setHeroImage] = useState(null);
    const [heroTitle, setHeroTitle] = useState('');
    const [heroDescription, setHeroDescription] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [currentSettings, setCurrentSettings] = useState({});

    useEffect(() => {
        const fetchSettings = async () => {
            const response = await fetch('/api/settings');
            const data = await response.json();
            setCurrentSettings(data);
            setNavbarDisplayType(data.navbar.displayType || 'image');
            setNavbarText(data.navbar.text || '');
            setHeroTitle(data.hero.title);
            setHeroDescription(data.hero.description);
            setMenuItems(data.menu || []);
        };
        fetchSettings();
    }, []);

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data.url;
    };

    const handleMenuItemChange = (index, field, value) => {
        const newMenuItems = [...menuItems];
        newMenuItems[index][field] = value;
        setMenuItems(newMenuItems);
    };

    const addMenuItem = () => {
        setMenuItems([...menuItems, { name: '', href: '' }]);
    };

    const removeMenuItem = (index) => {
        const newMenuItems = menuItems.filter((_, i) => i !== index);
        setMenuItems(newMenuItems);
    };

    const deleteImage = async (imageUrl) => {
        // You would typically make an API call to your backend to delete the image file from the server.
        // For this example, we'll just clear the image URL from the settings.
        if (imageUrl.includes('logo')) {
            setCurrentSettings({ ...currentSettings, navbar: { ...currentSettings.navbar, logoUrl: '' } });
        } else {
            setCurrentSettings({ ...currentSettings, hero: { ...currentSettings.hero, imageUrl: '' } });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        let navbarLogoUrl = currentSettings.navbar?.logoUrl;
        if (navbarLogo) {
            navbarLogoUrl = await uploadImage(navbarLogo);
        }

        let heroImageUrl = currentSettings.hero?.imageUrl;
        if (heroImage) {
            heroImageUrl = await uploadImage(heroImage);
        }

        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                navbar: {
                    displayType: navbarDisplayType,
                    text: navbarText,
                    logoUrl: navbarLogoUrl,
                },
                hero: {
                    imageUrl: heroImageUrl,
                    title: heroTitle,
                    description: heroDescription,
                },
                menu: menuItems,
            }),
        });

        if (response.ok) {
            alert('Settings saved successfully!');
        } else {
            alert('Failed to save settings.');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Site Settings</h1>

            <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* Navbar Settings */}
                <div className="p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Navbar</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Display Type</label>
                            <div className="mt-2 flex items-center gap-4">
                                <label>
                                    <input type="radio" value="image" checked={navbarDisplayType === 'image'} onChange={() => setNavbarDisplayType('image')} />
                                    Image
                                </label>
                                <label>
                                    <input type="radio" value="text" checked={navbarDisplayType === 'text'} onChange={() => setNavbarDisplayType('text')} />
                                    Text
                                </label>
                            </div>
                        </div>

                        {navbarDisplayType === 'image' ? (
                            <div>
                                <label htmlFor="navbarLogo" className="block text-sm font-medium text-gray-700">Navbar Logo</label>
                                {currentSettings.navbar?.logoUrl && (
                                    <div className="mt-2 flex items-center gap-4">
                                        <img src={currentSettings.navbar.logoUrl} alt="Current Navbar Logo" className="h-10 w-auto" />
                                        <button type="button" onClick={() => deleteImage('logo')} className="text-red-500">Delete</button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="navbarLogo"
                                    onChange={(e) => setNavbarLogo(e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                />
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="navbarText" className="block text-sm font-medium text-gray-700">Navbar Text</label>
                                <input
                                    type="text"
                                    id="navbarText"
                                    value={navbarText}
                                    onChange={(e) => setNavbarText(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Menu Settings */}
                <div className="p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Menu</h2>
                    <div className="space-y-4">
                        {menuItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={item.name}
                                    onChange={(e) => handleMenuItemChange(index, 'name', e.target.value)}
                                    className="flex-1 mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Href"
                                    value={item.href}
                                    onChange={(e) => handleMenuItemChange(index, 'href', e.target.value)}
                                    className="flex-1 mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <button type="button" onClick={() => removeMenuItem(index)} className="text-red-500">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={addMenuItem} className="mt-2 text-blue-500">+ Add Menu Item</button>
                    </div>
                </div>

                {/* Hero Section Settings */}
                <div className="p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700">Hero Image</label>
                            {currentSettings.hero?.imageUrl && (
                                <div className="mt-2 flex items-center gap-4">
                                    <img src={currentSettings.hero.imageUrl} alt="Current Hero Image" className="h-32 w-auto" />
                                    <button type="button" onClick={() => deleteImage('hero')} className="text-red-500">Delete</button>
                                </div>
                            )}
                            <input
                                type="file"
                                id="heroImage"
                                onChange={(e) => setHeroImage(e.target.files[0])}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700">Hero Title</label>
                            <input
                                type="text"
                                id="heroTitle"
                                value={heroTitle}
                                onChange={(e) => setHeroTitle(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="heroDescription" className="block text-sm font-medium text-gray-700">Hero Description</label>
                            <textarea
                                id="heroDescription"
                                value={heroDescription}
                                onChange={(e) => setHeroDescription(e.target.value)}
                                rows="3"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettingsPage;