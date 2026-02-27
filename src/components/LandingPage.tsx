"use client";
import React from 'react';

export default function LandingPage() {
    return (
        <div className="relative bg-white w-full min-h-screen overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 top-0 -translate-x-1/2 translate-y-[-10%] w-[500px] h-[500px] bg-purple-200 opacity-50 blur-[100px] rounded-full"></div>
                <div className="absolute right-0 top-0 translate-x-1/2 translate-y-[20%] w-[400px] h-[400px] bg-blue-200 opacity-50 blur-[100px] rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 flex flex-col items-center text-center">

                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8">
                    AI-Powered Invoice Processing
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
                    Extract Invoice Data with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        AI Intelligence
                    </span>
                </h1>

                <p className="max-w-2xl text-lg md:text-xl text-gray-500 mb-10">
                    Upload invoices and receipts and let our Gemini-powered AI instantly extract critical data.
                    Automate your data entry workflow with 99% accuracy.
                </p>

                {/* Bulletproof HTML Link */}
                <div className="flex justify-center w-full">
                    <a
                        href="/sign-in"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-all text-lg block"
                    >
                        Get Started &rarr;
                    </a>
                </div>

                {/* Stats */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl border-t border-gray-200 pt-10">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-gray-900 mb-2">Gemini 2.5</span>
                        <span className="text-gray-500 text-sm uppercase tracking-wide">Powered By</span>
                    </div>
                    <div className="flex flex-col items-center border-l-0 md:border-l border-r-0 md:border-r border-gray-200">
                        <span className="text-4xl font-bold text-gray-900 mb-2">99%</span>
                        <span className="text-gray-500 text-sm uppercase tracking-wide">Extraction Accuracy</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-gray-900 mb-2">Instant</span>
                        <span className="text-gray-500 text-sm uppercase tracking-wide">Processing Speed</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
