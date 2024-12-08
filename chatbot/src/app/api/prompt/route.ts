// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextRequest, NextResponse } from "next/server";

// const apiKey = process.env.GEMINI_API_KEY;

// export const POST = async (request: NextRequest) => {

//     console.log("The API key is: ", process.env.GEMINI_API_KEY);

//     const reqBody = await request.json();
//     console.log("The request body is: ", reqBody);
//     const { userMessage } = reqBody;

//     const genAI = new GoogleGenerativeAI(apiKey as string);

//     try {
//       const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       const response = await model.generateContent([userMessage]);

//       return NextResponse.json(
//         {message: response.response.text()},
//         {status: 200},
//       )
//     } catch (error) {
//       return NextResponse.json(
//         {message: "Error while getting response from the AI"},
//         {status: 500},
//       )
//     }

// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

// Function to set CORS headers
const setCorsHeaders = (response: NextResponse) => {
  response.headers.set("Access-Control-Allow-Origin", "*"); // Replace * with specific origin if required
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  return response;
};

export const POST = async (request: NextRequest) => {
  if (request.method === "OPTIONS") {
    // Handle preflight request
    const response = NextResponse.json({ message: "CORS preflight response" }, { status: 200 });
    return setCorsHeaders(response);
  }

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined in environment variables.");
    const response = NextResponse.json(
      { message: "Server configuration error: API key is missing." },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }

  try {
    const reqBody = await request.json();
    const { userMessage } = reqBody;

    if (!userMessage) {
      const response = NextResponse.json(
        { message: "Invalid request: 'userMessage' is required." },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (!model) {
      const response = NextResponse.json(
        { message: "Error: Could not retrieve the generative model." },
        { status: 500 }
      );
      return setCorsHeaders(response);
    }

    const generatedResponse = await model.generateContent([userMessage]);

    const responseText = generatedResponse?.response?.text();
    if (!responseText) {
      const response = NextResponse.json(
        { message: "Error: AI response is empty." },
        { status: 500 }
      );
      return setCorsHeaders(response);
    }

    const response = NextResponse.json(
      { message: responseText },
      { status: 200 }
    );
    return setCorsHeaders(response);
  } catch (error: any) {
    console.error("Error while processing the AI response:", error.message || error);
    const response = NextResponse.json(
      { message: "Error while processing the AI response. Please try again later." },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
};
