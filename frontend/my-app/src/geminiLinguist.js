import { GoogleGenerativeAI } from "@google/generative-ai";

async function giveFeedback(correctPro, givenPro) {
    console.log(process.env.REACT_APP_API_KEY)
    if (correctPro === givenPro){
        return "Great job!"
    }
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "You are a linguistic expert. Given two words as IPA phonemes, generate advice on how the person speaking the second word can match the first. The advice should be physical actions such as rolling your r's. Be colloquial when generating the advice. \ncorrect pronunciation: "  + correctPro + "\ngiven pronunciation: " + givenPro;

    const result = await model.generateContent(prompt);
    console.log(result.response.text())
    return result.response.text();
}

export default giveFeedback