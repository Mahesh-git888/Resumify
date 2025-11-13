// controller for enhancing a resume's professional summary

import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

//POST: /API/AI/enhance-pro-sum

export const enhanceProfessionalSummary = async(req, res) =>{

    try{

        const{userContent} =req.body;

        if(!userContent){

            return res.status(400).json({message: 'Missing required fields'})
        }

        // Validate text length
        const trimmedContent = userContent.trim();
        
        if(trimmedContent.length < 5){
            return res.status(400).json({message: 'Please provide some text to enhance'})
        }

        if(trimmedContent.length > 3000){
            return res.status(400).json({message: 'Text is too long. Please provide less content'})
        }

       const response =  await ai.chat.completions.create({

                    model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: "You are an expert in resume writing. Your task is to enhance and refine professional summaries. Rules: If the input is very short (less than 20 words), expand it to 1-2  bullet lines. If the input is medium or long, condense it to 3-4 bullet lines maximum. Make it concise yet impactful, highlighting key skills, experience, and career objectives. Use strong action words. Make it ATS-friendly and compelling. Return ONLY the enhanced text, no additional commentary or quotation marks." },
                {
                    role: "user",
                    content: trimmedContent,
                },
            ],
        })

        const enhancedContent = response.choices[0].message.content?.trim();

        if(!enhancedContent){
            return res.status(400).json({message: 'Failed to enhance professional summary. Please try again.'})
        }

        return res.status(200).json({enhancedContent})

    }catch(error){

        console.error('Error in enhanceProfessionalSummary:', error.message);
        return res.status(400).json({message: error.message || 'Error enhancing professional summary'})

    }

}

// controller for enhancing a resume's job description

//POST: /api/ai/enhance-job-desc


export const enhanceJobDescription = async(req, res) =>{

    try{

        const{userContent} =req.body;

        if(!userContent){

            return res.status(400).json({message: 'Missing required fields'})
        }

        // Validate text length
        const trimmedContent = userContent.trim();
        
        if(trimmedContent.length < 5){
            return res.status(400).json({message: 'Please provide some text to enhance'})
        }

        if(trimmedContent.length > 3000){
            return res.status(400).json({message: 'Text is too long. Please provide less content'})
        }

       const response =  await ai.chat.completions.create({

            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: "You are an expert in resume writing. Your task is to enhance and refine job descriptions into concise bullet points. Rules: Create 2-4 impactful bullet points. Each bullet point should be one concise line starting with a strong action verb. Highlight key responsibilities and achievements with quantifiable results wherever possible. Make it ATS-friendly and impactful. Format each bullet point as: • [action verb] [description] Return ONLY the bullet points, no additional commentary or introductory text." },
                {
                    role: "user",
                    content: trimmedContent,
                },
            ],
        })

        const enhancedContent = response.choices[0].message.content?.trim();

        if(!enhancedContent){
            return res.status(400).json({message: 'Failed to enhance job description. Please try again.'})
        }

        return res.status(200).json({enhancedContent})

    }catch(error){

        console.error('Error in enhanceJobDescription:', error.message);
        return res.status(400).json({message: error.message || 'Error enhancing job description'})

    }

}

//controller for uploading a resume to the database

//POST: /api/ai/upload-resume



export const uploadResume = async(req, res) =>{

    try{
        console.log(`I am in aiController the body is: ${req}`);

        const {resumeText, title } = req.body;

        const userId = req.userId;

        if(!resumeText){

            return res.status(400).json({message: 'Missing required fields'})

        }


        const systemPrompt = "You are an expert AI Agent to extract data from resume. Always parse dates in YYYY-MM format. For example: 2020-01 for January 2020, 2023-12 for December 2023. If only year is provided, use YYYY-01 format."

        const userPrompt =` extract data from this resume:${resumeText} provide data in the following json format with no additional text before or after:

        {
            professional_summary: "",
            skills: [],
            personal_info: {
                image: "",
                full_name: "",
                profession: "",
                email: "",
                phone: "",
                location: "",
                linkedin: "",
                website: ""
            },
            experience: [
                { 
                    company: "",
                    position: "",
                    start_date: "YYYY-MM",
                    end_date: "YYYY-MM",
                    description: "",
                    is_current: false
                }
            ],
            project: [
                { 
                    name: "",
                    type: "",
                    description: ""
                }
            ],
            education: [
                { 
                    institution: "",
                    degree: "",
                    field: "",
                    graduation_date: "YYYY-MM",
                    gpa: ""
                }
            ]
        }

        IMPORTANT: 
        - Parse all dates in YYYY-MM format (e.g., "2020-01" for January 2020)
        - If a date only has year, use "YYYY-01" format
        - For current jobs, set is_current to true and end_date to empty string
        - Return ONLY the JSON, nothing else
        `

       
       const response =  await ai.chat.completions.create({

            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],

            response_format: {type: 'json_object'}
        })

        const extractedData = response.choices[0].message.content;

        const parsedData = JSON.parse(extractedData)

        const newResume = await Resume.create({userId, title, ...parsedData})

        return res.json({resumeId: newResume._id})

    }catch(error){

        return res.status(400).json({message: error.message})

    }

}

