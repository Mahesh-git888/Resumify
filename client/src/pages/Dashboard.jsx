import React, { useEffect, useState } from 'react'
import {
  FilePenIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from 'lucide-react'
import { dummyResumeData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api.js' // Assumed path to your api client
import { toast } from 'react-hot-toast' // Assuming you are using react-hot-toast
import pdfToText from 'react-pdftotext'

const Dashboard = () => {

  const { user, token } = useSelector(state => state.auth)

  const colors = ['#9333ea', '#d97706', '#dc2626', '#0284c7', '#16a34a']

  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const loadAllResumes = async () => {
    try{

      
       const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })

       setAllResumes(data.resumes)

    }catch (error){

      toast.error(error?.response?.data?.message || error.message)

    }
  }

  const createResume = async (event) => {
    try {
      event.preventDefault()

      const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } })

      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try{



      const resumeText = await pdfToText(resume); 
      
        console.log(`$I am in Dashboard.jsx the reume after calling pdftoText :${title, resumeText}`);
         const { data } = await api.post('/api/ai/upload-resume', { title, resumeText}, { headers: { Authorization: token } })
         console.log(data);

         setTitle('')
         setResume(null)
         setShowUploadResume(false)
         navigate(`/app/builder/${data.resumeId}`)


    }catch(error){

      

    }

    setIsLoading(false)
    
  }

  const handleEditResume = (id, currentTitle) => {
    setEditResumeId(id)
    setTitle(currentTitle)
  }

  const editTitle = async (event) => {

    try{
       event.preventDefault()

       const {data} = await api.put(`/api/resumes/update`,{ resumeId: editResumeId, resumeData:{title}}, { headers: { Authorization: token } })


       setAllResumes(  allResumes.map(resume =>
      resume._id === editResumeId ? { ...resume, title } : resume))
    
      setTitle('')

      setEditResumeId('')
      toast.success(data.message)
      
    
  
    }catch(error){

      toast.error(error.response?.data?.message || error.message)

    }
   
    
  }

  const deleteResume =async (resumeId) => {

    try{

       const confirmDelete = window.confirm('Are you sure you want to delete this Resume?')
    if (confirmDelete) {
      const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } })

      setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
      toast.success(data.message)
    }

    }catch(error){

      toast.error(error.response?.data?.message || error.message)


    }


   
  }

  useEffect(() => {
    loadAllResumes()
  }, [])

  const handleCloseCreateModal = () => {
    setShowCreateResume(false)
    setTitle('')
  }

  const handleCloseUploadModal = () => {
    setShowUploadResume(false)
    setTitle('')
    setResume(null)
  }

  const handleCloseEditModal = () => {
    setEditResumeId('')
    setTitle('')
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name || 'User'}
        </p>

        {/* Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-green-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-green-600 transition-all duration-300">
              Create Resume
            </p>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[305px]" />

        {/* Resume Cards */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length]
            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + '40',
                }}
              >
                <FilePenIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />
                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>
                <p
                  className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                  style={{ color: baseColor + '90' }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1">
                  <TrashIcon
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteResume(resume._id)
                    }}
                    className="size-6 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                  <PencilIcon
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditResume(resume._id, resume.title)
                    }}
                    className="size-6 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Create Resume Modal */}
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={handleCloseCreateModal}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border rounded focus:ring-2 focus:ring-green-600 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={handleCloseCreateModal}
              />
            </div>
          </form>
        )}

        {/* Upload Resume Modal */}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={handleCloseUploadModal}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4"></h2>
              <input
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border rounded focus:ring-2 focus:ring-green-600 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <label htmlFor="resume-input" className="block text-sm text-slate-700">
                Select resume file
                <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-slate-400 rounded-md p-4 py-10 my-4 text-slate-400 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                  {resume ? (
                    <p className="text-green-700">{resume.name}</p>
                  ) : (
                    <>
                      <UploadCloudIcon className="size-14 stroke-1" />
                     
                    </>
                  )}
                </div>
              </label>

              <input
                id="resume-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setResume(e.target.files[0])}
              />

              <button disabled = {isLoading}className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                
                {isLoading && <LoaderCircleIcon className='animate-spin size-4 text-white'/>}
                {isLoading ?'Uploading...': 'Upload Resume'}
                Upload Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={handleCloseUploadModal}
              />
            </div>
          </form>
        )}

        {/* Edit Resume Modal */}
        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={handleCloseEditModal}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>

              <input
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border rounded focus:ring-2 focus:ring-green-600 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Save Changes
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={handleCloseEditModal}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Dashboard