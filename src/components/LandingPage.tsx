import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="relative min-h-screen bg-[#fafafa] w-full overflow-hidden font-sans">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 top-0 -translate-x-1/2 translate-y-[-10%] w-[600px] h-[600px] bg-purple-200/50 blur-[120px] rounded-full"></div>
                <div className="absolute right-0 top-0 translate-x-1/3 translate-y-[10%] w-[500px] h-[500px] bg-blue-200/50 blur-[120px] rounded-full"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900">InvoiceAI</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
                    <a href="https://github.com/PillaSanjayRaj" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">GitHub</a>
                </div>
                <Link href="/sign-in">
                    <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-md transition-all">
                        Get Started
                    </button>
                </Link>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 flex flex-col items-center text-center">

                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    AI-Powered Invoice Processing
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                    Extract Invoice Data with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        AI Intelligence
                    </span>
                </h1>

                <p className="max-w-2xl text-lg text-gray-500 mb-10 leading-relaxed">
                    Upload invoices and let our Gemini AI instantly extract critical data. Automate your accounting workflow and reduce manual data entry by up to 95%.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link href="/sign-in" className="w-full sm:w-auto">
                        <button className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 text-base">
                            Get Started &rarr;
                        </button>
                    </Link>
                    <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold border border-gray-200 rounded-full shadow-sm transition-all text-base">
                        View Features
                    </a>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-3xl">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-blue-600 mb-2">100%</span>
                        <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Free & Open Source</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-blue-600 mb-2">99%</span>
                        <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Extraction Accuracy</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-blue-600 mb-2">&lt;3s</span>
                        <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Processing Time</span>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-200/60">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
                    <p className="text-lg text-gray-500">Everything you need to streamline invoice processing.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature Cards */}
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                        <p className="text-gray-500 leading-relaxed">Process invoices in seconds, not hours. Our Gemini AI engine delivers results almost instantly.</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Processing</h3>
                        <p className="text-gray-500 leading-relaxed">Your data remains yours. We use secure endpoints and do not use your financial data for training.</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Instant JSON Export</h3>
                        <p className="text-gray-500 leading-relaxed">Extract structured data directly into JSON format, ready to be ingested by your database.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
