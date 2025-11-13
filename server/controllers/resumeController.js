

//controller for creating a new resume
import imagekit from "../configs/imagekit.js";
import Resume from "../models/Resume.js";
import fs from 'fs';

// POST: /api/resumes/create

export const createResume = async(req, res) =>{

    try{


        const userId = req.userId;

        const {title} = req.body;

        // create new resume

        const newResume = await Resume.create({userId,title})

        return res.status(201).json({message:'Resume created successfully', resume:newResume})



    }catch(error){

        return res.status(400).json({message:error.message})

    }

}

// controller for deleting a resume

//DELETE: /api/resumes/delete

export const deleteResume = async(req, res) =>{

    try{


        const userId = req.userId;

        const {resumeId} = req.params;

        // create new resume
        await Resume.findOneAndDelete({userId,_id: resumeId})

        //return success message

    

        return res.status(200).json({message:'Resume deleted successfully'})



    }catch(error){

        return res.status(400).json({message:error.message})

    }

}

//get user resume by id

//GET : /api/resumes/get


export const getResumeById = async(req, res) =>{

    try{


        const userId = req.userId;

        const {resumeId} = req.params;


        const resume = await Resume.findOne({userId, _id: resumeId})

        if(!resume){

            return res.status(400).json({message:"Resume not found"})
        }

        //return success message

        const resumeObj = resume.toObject();
        delete resumeObj.__v;
        delete resumeObj.createdAt;
        delete resumeObj.updatedAt;

return res.status(200).json({ resume: resumeObj });




    }catch(error){

        return res.status(400).json({message:error.message})

    }

}


//get resume by id public

//GET: /api/resumes/public
export const getPublicResumeById = async(req, res) =>{

    try{


        

        const {resumeId} = req.params;


        const resume = await Resume.findOne({public: true, _id:resumeId})

        if(!resume){

            return res.status(404).json({message:"Resume not found"})
        }



       

        return res.status(200).json({resume})



    }catch(error){

        return res.status(400).json({message:error.message})

    }

}

//controller for updating a resume

//PUT: /api/resumes/update

export const updateResume = async(req, res) =>{

    try{

        const userId = req.userId;

        const {resumeId, resumeData, removeBackground} = req.body

        const image = req.file;


        let resumeDatacopy;
         if(typeof resumeData === 'string'){

            resumeDatacopy = await JSON.parse( resumeData )
         }else{
            resumeDatacopy = structuredClone(resumeData)

         }

        if(image){

            const imageBufferData = fs.createReadStream(image.path)

            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: `resume-${Date.now()}.png`,
                folder: 'user-resumes',
                isPrivateFile: false
            });

            // Apply transformation to the URL
            let transformedUrl = response.url;
            const transformationString = `tr=w-300,h-300,fo-auto,g-face,z-0.75${removeBackground ? ',e-bgremove' : ''}`;
            
            // Insert transformation before the query params
            const urlParts = transformedUrl.split('?');
            transformedUrl = `${urlParts[0]}?${transformationString}`;
            
            resumeDatacopy.personal_info.image = transformedUrl
            
        }

         const resume = await Resume.findOneAndUpdate(
            { userId: userId, _id: resumeId }, 
            { $set: resumeDatacopy },
            { new: true, runValidators: true }
         )

         if(!resume){
            return res.status(404).json({message: 'Resume not found'})
         }

         return res.status(200).json({message: 'saved successfully', resume})
    }
    catch(error){

        return res.status(400).json({message:error.message})
    }
}
