// Your Cohere API key
const apiKey = 'M4kD4N0bhPUfoUrFejbUZnpvof1pkyoohMzdtzCz'; // Replace with your actual API key

// Function to get university recommendations based on user inputs
async function getRecommendations() {
  // Gather form inputs
  const field = document.getElementById('field').value;
  const average = parseFloat(document.getElementById('average').value);

  // Check if all inputs are filled correctly
  if (!field || isNaN(average)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  // Check if average is below 0 or above 100
  if (average < 0 || average > 100) {
    document.getElementById('results').innerHTML = `
      <p class="text-danger">Oops! Are you from another planet? Please enter an average between 0 and 100!</p>
    `;
    return;
  }

  // Check if average is below 60%
  if (average < 60) {
    document.getElementById('results').innerHTML = `
      <p class="text-danger">Your estimated average is below 60%. University admission may be challenging. Consider the following tips to improve your average:</p>
      <ul>
        <li>Focus on core subjects that align with your intended field of study.</li>
        <li>Seek tutoring or additional help in subjects where you're struggling.</li>
        <li>Develop effective study habits and time management skills.</li>
        <li>Participate in study groups with peers to enhance your understanding.</li>
        <li>Consult with teachers for feedback on areas of improvement.</li>
      </ul>
    `;
    return;
  }

  // Create a prompt for the Cohere API
  const prompt = `You are an expert in Ontario universities. Based on the following preferences, provide detailed and actionable university recommendations in Ontario only, without bullet points or dashes:
  - Field of interest: ${field}
  - Estimated Average: ${average}%
  
  Provide specific Ontario universities that offer programs related to ${field} and briefly explain the key features of their programs, including admission requirements, tuition fees, rankings, extracurricular opportunities, and any relevant details that would help a student make an informed decision.`;

  try {
    // Send a request to Cohere's API
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: prompt,     // Your generated prompt
        max_tokens: 400,    // Increased max tokens for more detailed responses
        temperature: 0.7    // Control the randomness of the output
      })
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    // Parse the response data
    const data = await response.json();
    const recommendations = data.generations[0]?.text?.trim() || 'No recommendations available.';

    // Format and display the recommendations as paragraphs
    const formattedResponse = recommendations.split('\n').map(line => `<p>${line}</p>`).join('');
    document.getElementById('results').innerHTML = formattedResponse;
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('results').innerHTML = `<p>Sorry, there was an error processing your request: ${error.message}</p>`;
  }
}