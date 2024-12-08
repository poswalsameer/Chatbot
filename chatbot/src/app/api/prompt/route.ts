import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export const POST = async (request: NextRequest) => {

    console.log("The API key is: ", process.env.GEMINI_API_KEY);

    const reqBody = await request.json();
    console.log("The request body is: ", reqBody);
    const { userMessage } = reqBody;

    const genAI = new GoogleGenerativeAI(apiKey as string);

    try {
      const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent([userMessage]);

      return NextResponse.json(
        {message: response.response.text()},
        {status: 200},
      )
    } catch (error) {
      return NextResponse.json(
        {message: "Error while getting response from the AI"},
        {status: 500},
      )
    }

}