require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
const configuration = new Configuration({
    apiKey: process.env.openapikey,
  });
  
const openai = new OpenAIApi(configuration);
const userData = {};
app.post("/chatbot", async (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let reply = "";

  try {
    switch (true) {
      case /hello|hi|hey/.test(userMessage):
        reply =
          "Hello! I’m your SBI Life Advisor. I’ll help you find the perfect life insurance policy. Let’s get started! Can I ask you a few questions to better understand your needs? (Yes/No)";
        userData.step = "start";
        break;

      case /yes/.test(userMessage) && userData.step === "start":
        reply = "Great! Let's begin. How old are you?";
        userData.step = "age";
        break;

      case /\b\d{1,2}\b/.test(userMessage) && userData.step === "age": {
        const age = parseInt(userMessage, 10);
        if (age > 0 && age <= 100) {
          userData.age = age;
          reply = "Thank you! Are you married? (Yes/No)";
          userData.step = "maritalStatus";
        } else {
          reply = "Please enter a valid age.";
        }
        break;
      }

      case /yes|no/.test(userMessage) && userData.step === "maritalStatus":
        userData.maritalStatus = userMessage === "yes" ? "Married" : "Single";
        reply =
          "Got it! Can you please share your annual income in INR? (e.g., 500000)";
        userData.step = "income";
        break;

      case /\b\d{5,8}\b/.test(userMessage) && userData.step === "income": {
        const income = parseInt(userMessage, 10);
        if (income > 0) {
          userData.income = income;
          reply =
            "Thank you! Do you have any specific financial goals, like wealth creation, retirement planning, or family security?";
          userData.step = "goals";
        } else {
          reply = "Please enter a valid income.";
        }
        break;
      }

      case /.*/.test(userMessage) && userData.step === "goals":
        userData.goals = userMessage;
        reply =
          "Got it! What is your preferred premium payment frequency? (Monthly/Quarterly/Half-Yearly/Annually)";
        userData.step = "paymentFrequency";
        break;

      case /monthly|quarterly|half-yearly|annually/.test(userMessage) && userData.step === "paymentFrequency":
        userData.paymentFrequency = userMessage.charAt(0).toUpperCase() + userMessage.slice(1); // Capitalize the first letter
        reply =
          "Thank you! Do you have any existing life insurance policies or health coverage? (Yes/No)";
        userData.step = "existingPolicy";
        break;

      case /yes|no/.test(userMessage) && userData.step === "existingPolicy":
        userData.existingPolicy = userMessage === "yes" ? "Yes" : "No";
        reply =
          "Great! Do you prefer a short-term or long-term policy? (Short/Long)";
        userData.step = "policyType";
        break;

      case /short|long/.test(userMessage) && userData.step === "policyType":
        userData.policyType =
          userMessage === "short" ? "Short-Term" : "Long-Term";
        reply =
          "Understood! Are you looking for a policy that covers critical illness or focuses on family security?";
        userData.step = "coverageType";
        break;

      case /.*/.test(userMessage) && userData.step === "coverageType":
        userData.coverageType = userMessage;
        reply =
          "Thank you! What is your desired sum assured amount? (e.g., 1000000)";
        userData.step = "sumAssured";
        break;

      case /\b\d{6,8}\b/.test(userMessage) && userData.step === "sumAssured": {
        const sumAssured = parseInt(userMessage, 10);
        if (sumAssured > 0) {
          userData.sumAssured = sumAssured;
          reply =
            "Great! Finally, do you prefer a policy with high returns or a policy with a balance of coverage and returns?";
          userData.step = "returnsPreference";
        } else {
          reply = "Please enter a valid sum assured amount.";
        }
        break;
      }

      case /.*/.test(userMessage) && userData.step === "returnsPreference":
        userData.returnsPreference = userMessage;
        reply =
          "Understood! Now, let me evaluate the best policies for you. Please wait a moment.";
        userData.step = "evaluate";
        const openaiResponse = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are an expert life insurance advisor for SBI Life. Based on the user's inputs, suggest the 3 best policies from SBI Life that suit their needs.`,
            },
            {
              role: "user",
              content: `User Details:
              Age: ${userData.age},
              Marital Status: ${userData.maritalStatus},
              Annual Income: ${userData.income},
              Financial Goals: ${userData.goals},
              Premium Payment Frequency: ${userData.paymentFrequency},
              Existing Life Insurance: ${userData.existingPolicy},
              Policy Type: ${userData.policyType},
              Coverage Type: ${userData.coverageType},
              Sum Assured: ${userData.sumAssured},
              Returns Preference: ${userData.returnsPreference}`,
            },
          ],
        });

        reply = openaiResponse.data.choices[0].message.content;
        break;

      case /no/.test(userMessage) && userData.step === "start":
        reply =
          "Thank you for exploring your insurance options with me! If you have more questions, feel free to reach out anytime. Have a great day!";
        break;

      default:
        reply =
          "I'm sorry, I didn't understand that. Can you please clarify or follow the prompted questions?";
    }
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    reply = "Sorry, there was an error processing your request. Please try again.";
  }
  res.json({ reply });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
//serverless vercel 
module.exports = app;