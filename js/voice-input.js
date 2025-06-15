const micBtn = document.createElement('button');
micBtn.innerHTML = '🎤';
micBtn.id = 'mic-btn';
micBtn.style.marginLeft = '10px';
document.querySelector('.chat-input').appendChild(micBtn);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;

  micBtn.onclick = () => {
    recognition.start();
    micBtn.innerHTML = '🎙️';
  };

  recognition.onend = () => {
    micBtn.innerHTML = '🎤';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const inputField = document.getElementById('chat-input-field');
    inputField.value = transcript;
    inputField.dispatchEvent(new Event('input')); // To trigger auto-grow
  };

  recognition.onerror = (event) => {
    alert("Voice recognition error: " + event.error);
    micBtn.innerHTML = '🎤';
  };
} else {
  micBtn.disabled = true;
  micBtn.title = "Speech recognition not supported in this browser.";
}
