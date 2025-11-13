import React from 'react'
import { Zap } from "lucide-react";
import Title from './Title';

const Features = () => {
  return (
    <div id='features' className='flex flex-col items-center my-10 scroll-mt-12'>

      {/* Section Label */}
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-6 py-1.5">
        <Zap width={14} />
        <span>Smart Resume Builder</span>
      </div>

      {/* Title Section */}
      <Title
        title="Build, Optimize & Share — Effortlessly"
        description="Create a standout resume in minutes with AI-powered suggestions, real-time preview, and easy online sharing."
      />

      <div className="flex flex-col md:flex-row items-center justify-center xl:-mt-10">
        <img
          className="max-w-2xl w-full xl:-ml-32"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
          alt="Resume Builder Features"
        />

        <div className="px-4 md:px-0 space-y-6">

          {/* ✅ Feature 1 */}
          <div className="p-6 hover:bg-violet-100 border border-transparent hover:border-violet-300 flex gap-4 rounded-xl transition-colors cursor-pointer">
            <svg className="size-6 stroke-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-slate-700">Create & Manage Resumes</h3>
              <p className="text-sm text-slate-600 max-w-xs">
                Seamlessly create, edit, and organize multiple resumes — all in one place with secure login.
              </p>
            </div>
          </div>

          {/* ✅ Feature 2 */}
          <div className="p-6 hover:bg-green-100 border border-transparent hover:border-green-300 flex gap-4 rounded-xl transition-colors cursor-pointer">
            <svg className="size-6 stroke-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14m7-7H5" />
            </svg>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-slate-700">AI Optimization</h3>
              <p className="text-sm text-slate-600 max-w-xs">
                Upload your resume and let AI enhance it — improving tone, structure, and clarity for better impact.
              </p>
            </div>
          </div>

          {/* ✅ Feature 3 */}
          <div className="p-6 hover:bg-orange-100 border border-transparent hover:border-orange-300 flex gap-4 rounded-xl transition-colors cursor-pointer">
            <svg className="size-6 stroke-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4v16h16V4zM4 10h16" />
            </svg>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-slate-700">Live Preview & Share</h3>
              <p className="text-sm text-slate-600 max-w-xs">
                Get instant visual feedback while editing and share a live online link with recruiters in one click.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Optional Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>
    </div>
  )
}

export default Features
