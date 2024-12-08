import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request:Request) {
  try {
    const {myDepartment,otherDepartments,title,description}= await request.json()
    console.log(myDepartment,otherDepartments,title,description)
    const { text } = await generateText({
      model: groq('mixtral-8x7b-32768'),
      prompt: `Create a list of three open-ended and engaging solutions formatted as a single string. Each solution should be separated by '||'. For example ur response should look like: "Identify specific ways ${myDepartment} and ${otherDepartments} can address the challenges outlined in '${title}' using the context provided: ${description}.|| Focus on shared objectives, resource allocation, and setting clear milestones for effective collaboration;What practical strategies or technologies can ${myDepartment} and ${otherDepartments} adopt to improve data sharing and streamline project execution for '${title}'?||Use insights from ${description} to highlight key areas for optimization;Suggest a detailed conflict-resolution framework for '${title}' that incorporates the priorities of both ${myDepartment} and ${otherDepartments}, ensuring alignment with the goals outlined in ${description}. Include recommendations for fostering transparency and building trust across departments."`,
      maxTokens: 1024,
      temperature: 0.7,
    });

    return NextResponse.json({ 
      questions: text.trim()
    });
  } catch (error) {
    console.error('Error generating text:', error);

    return NextResponse.json({ 
      error: 'An error occurred',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}