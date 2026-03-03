    "use client";

    import Image from "next/image";

    export default function FindLandHero() {
    return (
        <section className="relative w-full bg-[#fff] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
            
            {/* ================= LEFT CONTENT ================= */}
            <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                FIND LAND IN YOUR <br /> LOCATIONS
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                Discover verified farmland, agricultural plots, and investment-ready
                properties tailored to your needs. Fieldly connects you with trusted
                landowners and opportunities near you. Simply enter your location
                and explore available lands instantly.
            </p>

            <button className="bg-black text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition duration-300">
                Find Land Near You
            </button>
            </div>

            {/* ================= RIGHT IMAGES ================= */}
            <div className="relative flex justify-center items-center min-h-[600px] lg:min-h-[720px]">

            {/* Background Map (WIDER + SHORTER) */}
            <div
                className="absolute 
                w-[140%] lg:w-[150%] 
                h-[70%] 
                max-h-[520px]
                opacity-60 
                -z-10"
            >
                <Image
                src="/mainmap.png"
                alt="Map Background"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 150vw"
                />
            </div>

            {/* Foreground Phone (TALLER + DOMINANT) */}
            <div
                className="relative 
                w-[340px] lg:w-[420px] 
                h-[620px] lg:h-[780px]"
            >
                <Image
                src="/mainmaplap.png"
                alt="Fieldly Mobile App"
                fill
                className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.25)]"
                priority
                />
            </div>

            </div>
        </div>
        </section>
    );
    }