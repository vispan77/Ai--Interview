import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { text } from "stream/consumers";
import generateResponse from "../config/OpenRouter.js";
// Note: If you want to use the alternative method, install pdf-parse via: npm install pdf-parse
// import * as pdfParse from "pdf-parse/lib/";


// controller for analysing the resume pdf using pdfjs-dist
export const analyseResume = async (req, res) => {
    try {
        // fetch the file from the request
        const file = req.file;
        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File is not found"
            });
        }

        // find the file path 
        const filePath = req.file.path;

        // then read the file using fs from the file folder
        const fileBuffer = await fs.promises.readFile(filePath);

        // then convert the file into binary data or binary array which is accepted
        // by the pdf library
        const unint8Array = new Uint8Array(fileBuffer);

        const pdf = await pdfjsLib.getDocument({ data: unint8Array }).promise;

        let resumeText = "";

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            // get the page from the pdf
            const page = await pdf.getPage(pageNumber);

            // get textContent from the specific page
            const textContent = await page.getTextContent();

            // get the all the text from the page (Fixed: .json to .join)
            const pageText = textContent.items.map((item) => item.str).join(" ");

            resumeText = resumeText + pageText + "\n";
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim();

        const messages = [
            {
                role: "system",
                content: `
                    Extract structured data from resume.

                    Return strictly JSON:{
                        "role": "string",
                        "experience": "string",
                        "projects": ["project1", "project2"],
                        "skills": ["skill1", "skill2"]
                    }
                `
            },
            {
                role: "user",
                content: resumeText
            }
        ];

        const response = await generateResponse(messages);

        const parsed = JSON.parse(response);

        // delete the file from the folder
        fs.unlinkSync(filePath);

        return res.status(200).json({
            success: true,
            message: "Resume is analysed successfully",
            data: resumeText,
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills
        });

    } catch (error) {
        console.log(error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            success: false,
            message: `Something went wrong while analysing the resume ${error}`
        });
    }
};




export default { analyseResume }
