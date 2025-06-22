// This function is triggered when the user clicks the 'Generate Story' button
async function generateStory() {
  const dream = document.getElementById('dream').value;
  const storyDiv = document.getElementById('story');

  // Show message if dream input is empty
  if (!dream.trim()) {
    storyDiv.innerHTML = 'Please enter a dream first.';
    return;
  }

  // Display loading message while waiting for AI response
  storyDiv.innerHTML = '✨ Generating story... Please wait ✨';

  try {
    // Send POST request to backend API
    const response = await fetch('http://localhost:3000/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dream }) // Send the dream to the backend
    });

    const data = await response.json();

    // If a story is returned, display it; otherwise show error
    if (data.story) {
      storyDiv.innerHTML = `📖 <b>Your Story:</b><br><br>${data.story}`;
    } else {
      storyDiv.innerHTML = `❌ Error: ${data.error || 'Something went wrong'}`;
    }
  } catch (err) {
    // Handle fetch/network errors
    storyDiv.innerHTML = `❌ Error: ${err.message}`;
  }
}
