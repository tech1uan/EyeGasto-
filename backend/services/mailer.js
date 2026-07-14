import axios from "axios";

const MAILEROO_API_KEY = process.env.MAILEROO_API_KEY;
const MAILEROO_ENDPOINT = "https://smtp.maileroo.com/api/v2/emails";

export async function sendVerificationEmail(email, code) {
  try {
    const response = await axios.post(
      MAILEROO_ENDPOINT,
      {
        from: {
          address: "noreply@564a7ea69375bf15.maileroo.org",
        },
        to: [
          {
            address: email,
          },
        ],
        subject: "Verify your email",
        html: verificationEmailTemplate(code),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MAILEROO_API_KEY}`,
        },
        timeout: 10000, // 10 seconds
      }
    );

    const data = response.data;

    if (data.success === false) {
      throw new Error(data.message || "Maileroo failed");
    }

    return data;

  } catch (error) {
    console.error("Maileroo Axios Error:");

    if (error.response) {
      // Maileroo responded with an error
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      // Request was sent but no response received
      console.error("No response received:", error.message);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    throw error;
  }
}