import { GoogleGenerativeAI } from "@google/generative-ai";
import { getNextApiKey } from './loadBalancer';

export async function generateCourseContent(topic, level) {
  const apiKey = getNextApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Create a course outline for "${topic}" with difficulty level "${level}". 
  Return only a JSON array of subtopics, with each subtopic being a string. 
  For example: ["Introduction to ${topic}", "Basic concepts", "Advanced techniques", ...].
  The number of subtopics should be:
  - 5 for easy level
  - 15 for medium level
  - 30 for hard level`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating course content:", error);
    throw error;
  }
}

export async function generateTopicContent(courseTitle, topicTitle) {
  const apiKey = await getNextApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Create a concise study guide for the topic "${topicTitle}" within the course "${courseTitle}". 
  Include key concepts, explanations, and examples. The content should be informative and easy to understand.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating topic content:", error);
    throw error;
  }
}

export async function generateQuiz(courseTitle, topicTitle, topicContent) {
  const apiKey = await getNextApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Create a quiz with 5 multiple-choice questions based on the following topic content for the course "${courseTitle}", topic "${topicTitle}":

${topicContent}

Format the quiz as a JSON array with the following structure for each question:
{
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0 // Index of the correct answer (0-3)
}

Provide only the JSON array, without any additional text or formatting.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonString = response.text();
    
    // Remove any Markdown formatting or extra text
    jsonString = jsonString.replace(/```json\n?|\n?```/g, '').trim();
    
    // Ensure the string starts with [ and ends with ]
    if (!jsonString.startsWith('[') || !jsonString.endsWith(']')) {
      throw new Error('Invalid JSON format');
    }
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}
