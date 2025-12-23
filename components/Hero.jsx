'use client'
import { useEffect, useState } from 'react';
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import CategoriesMarquee from './CategoriesMarquee';

const Hero = () => {
    const [settings, setSettings] = useState({ hero: {} });
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    useEffect(() => {
        const fetchSettings = async () => {
            const response = await fetch('/api/settings');
            const data = await response.json();
            setSettings(data);
        };
        fetchSettings();
    }, []);

    return (
        <div className='mx-6'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
                <div className='relative flex-1 flex flex-col bg-blue-200 rounded-3xl xl:min-h-100 group'>
                    <div className='p-5 sm:p-16'>
                        <div className='inline-flex items-center gap-3 bg-blue-300 text-blue-600 pr-4 p-1 rounded-full text-xs sm:text-sm'>
                            <span className='bg-blue-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>NEWS</span> Free Shipping on Orders Above $50! <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-slate-600 to-[#74e1ff] bg-clip-text text-transparent max-w-xs  sm:max-w-md'>
                            {settings.hero.title || "Gadgets you'll love. Prices you'll trust."}
                        </h2>
                        <p>{settings.hero.description || ''}</p>
                        <div className='text-slate-800 text-sm font-medium mt-4 sm:mt-8'>
                            <p>Starts from</p>
                            <p className='text-3xl'>{currency}4.90</p>
                        </div>
                        <button className='bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition'>LEARN MORE</button>
                    </div>
                    {settings.hero.imageUrl &&
                        <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm' src={settings.hero.imageUrl} alt="Hero Image" width={500} height={500} />
                    }
                </div>
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <div className='flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>Best products</p>
                            <p className='flex items-center gap-1 mt-4'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        {/* It seems there are other images in the hero component, I will leave them as is for now. */}
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-green-200 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78ff7f] bg-clip-text text-transparent max-w-40'>20% discounts</p>
                            <p className='flex items-center gap-1 mt-4'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>
    );
};

export default Hero;