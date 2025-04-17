const moodMessages = {
  happy: [
    "That's wonderful to hear! I'm so happy for you!",
    "That's fantastic news! It makes me so glad to see you happy.",
    "Yay! I'm so thrilled for you!",
    "That's amazing! What a great feeling, right?",
    "I'm so happy things are going well for you.",
    "Your happiness makes me happy!",
    "That's just the best news! Congratulations!",
    "I'm so glad to see you smiling like that!",
    "Keep that happy feeling going!",
    "Tell me all about it! I love seeing you this happy.",
    "Share your joy with me! What made you so happy?",
    "This is fantastic! You deserve all the happiness.",
    "I'm absolutely delighted for you!",
    "Seeing you this happy brightens my day too!",
    "May this happiness continue for a long time!"
  ],
  sad: [
    "I'm so sorry you're feeling this way. Is there anything I can do?",
    "It's okay to feel sad. Take your time.",
    "I'm here for you if you want to talk or just need company.",
    "Remember that these feelings won't last forever.",
    "It sounds like you're going through a lot. Be kind to yourself.",
    "Don't hesitate to reach out if you need anything at all.",
    "Sending you a big hug. I hope things get better soon.",
    "It's alright to cry and let it out.",
    "Just know that you're not alone in this.",
    "What can I do to help take your mind off things, even for a little while?",
    "Let's do something gentle together, like watch a movie or listen to music.",
    "Remember all the times you've overcome challenges before. You're strong.",
    "Sometimes just letting yourself feel the sadness is the first step to healing.",
    "Don't feel pressured to be okay right now. It's alright to not be.",
    "Thinking of you and sending positive vibes your way."
  ],
  angry: [
    "Take a deep breath. What's making you so upset?",
    "It's understandable to feel angry, but let's try to talk about it calmly.",
    "What happened? Maybe we can find a solution together.",
    "I hear that you're really frustrated. Let's try to understand why.",
    "Sometimes it helps to take a break and cool down. Want to do that?",
    "Try to express what you're feeling without blaming.",
    "Is there anything I can do to help resolve this situation?",
    "Let's focus on finding a way forward that works for everyone.",
    "It's okay to be angry, but let's try not to let it control us.",
    "Maybe talking it through will help you feel a bit better.",
    "Maybe we can find a healthy way to release this anger, like going for a walk or exercising.",
    "Try to identify the root cause of your anger. Sometimes understanding helps.",
    "It's important to address this anger before it affects you or others negatively.",
    "Let's try to approach this situation with a problem-solving mindset, once you're ready.",
    "Sometimes writing down your feelings can help you process them."
  ],
  calm: [
    "It's nice to see you so peaceful.",
    "You seem so relaxed and calm, it's great.",
    "I'm glad you're feeling so centered.",
    "It's good to have moments of calm like this.",
    "You look so at ease, it's contagious.",
    "Enjoy this peaceful feeling.",
    "It's nice to just take a moment to be calm.",
    "That's a good way to be. Calm and collected.",
    "I appreciate your calm demeanor.",
    "Keep that peaceful energy with you.",
    "This sense of calm looks really good on you.",
    "It's inspiring to see you so composed.",
    "This peacefulness is exactly what you needed, I think.",
    "Enjoy this moment of tranquility.",
    "You've created such a calm atmosphere around you."
  ]
};

const moodIndex = { happy: 0, sad: 0, angry: 0, calm: 0 };
let currentMood = '';

// Helper to get shuffled indexes
function shuffleArray(length) {
  const array = [...Array(length).keys()];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getNextMoodMessageIndex(mood) {
  const storageKey = `mood-${mood}-shuffle`;
  let state = JSON.parse(localStorage.getItem(storageKey));

  if (!state || !Array.isArray(state.order) || typeof state.index !== 'number') {
    state = { order: shuffleArray(moodMessages[mood].length), index: 0 };
  }

  const messageIndex = state.order[state.index];
  state.index++;

  if (state.index >= state.order.length) {
    state.order = shuffleArray(moodMessages[mood].length);
    state.index = 0;
  }

  localStorage.setItem(storageKey, JSON.stringify(state));
  return messageIndex;
}

function selectMood(mood) {
  currentMood = mood;
  const messageBox = document.getElementById('mood-message');
  const messages = moodMessages[mood];
  const index = getNextMoodMessageIndex(mood);
  messageBox.innerHTML = `<p>${messages[index]}</p>`;
  document.getElementById('diary-entry').style.display = 'block';

  // Remove all mood classes, then add the selected one
  document.body.classList.remove('bg-happy', 'bg-sad', 'bg-angry', 'bg-calm');
  document.body.classList.add(`bg-${mood}`);
}

function saveEntry() {
  const text = document.getElementById('userMessage').value.trim();
  if (!text || !currentMood) return;

  const entry = {
    id: Date.now(),
    mood: currentMood,
    message: text,
    date: new Date().toLocaleString()
  };

  const entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
  entries.push(entry);
  localStorage.setItem('diaryEntries', JSON.stringify(entries));
  document.getElementById('userMessage').value = '';
  displayEntries();
}

function displayEntries() {
  const log = document.getElementById('diary-log');
  const entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
  log.innerHTML = '';

  entries.forEach(entry => {
    const div = document.createElement('div');
    div.classList.add('diary-entry'); // Add class for styling/animation
    div.innerHTML = `
      <strong>${entry.date} (${entry.mood.toUpperCase()}):</strong>
      <p>${entry.message}</p>
      <button onclick="editEntry(${entry.id})">Edit</button>
      <button onclick="deleteEntry(${entry.id})">Delete</button>
      <hr>
    `;
    log.appendChild(div);
  });
}

function deleteEntry(id) {
  const entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
  const updated = entries.filter(entry => entry.id !== id);
  localStorage.setItem('diaryEntries', JSON.stringify(updated));
  displayEntries();
}

function clearDiary() {
  if (confirm("Are you sure you want to clear all diary entries?")) {
    localStorage.removeItem('diaryEntries');
    displayEntries();
  }
}
function editEntry(id) {
  const entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
  const entry = entries.find(e => e.id === id);
  const newMessage = prompt("Edit your entry:", entry.message);
  if (newMessage !== null && newMessage.trim() !== '') {
    entry.message = newMessage.trim();
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
    displayEntries();
  }
}

window.onload = displayEntries;