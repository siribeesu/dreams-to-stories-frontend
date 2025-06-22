const apiUrl = 'https://dreams-to-stories-backend.onrender.com'; // Your backend URL

const dreamInput = document.getElementById('dreamInput');
const storyOutput = document.getElementById('storyOutput');
const generateBtn = document.getElementById('generateBtn');

generateBtn.addEventListener('click', async () => {
  const userDream = dreamInput.value.trim();

  if (!userDream) {
    alert('Please enter a dream.');
    return;
  }

  storyOutput.innerText = 'Generating your story... Please wait...';

  try {
    const response = await fetch(`${apiUrl}/generate-story`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dream: userDream })
    });

    const data = await response.json();

    if (response.ok && data.story) {
      storyOutput.innerText = data.story;
    } else {
      storyOutput.innerText = `❌ Error: ${data.error?.message || 'Something went wrong'}`;
    }
  } catch (error) {
    console.error('Error:', error);
    storyOutput.innerText = '❌ Failed to connect to the server.';
  }
});
