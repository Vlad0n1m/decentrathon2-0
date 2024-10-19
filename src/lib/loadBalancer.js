const API_KEYS = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : [];
let currentIndex = 0;
const cooldownPeriod = 1000; // 1 second cooldown
const lastRequestTime = new Map();

export function getNextApiKey() {
  if (API_KEYS.length === 0) {
    console.error('No API keys available. Please set the GEMINI_API_KEYS environment variable.');
    return null;
  }

  const now = Date.now();
  let apiKey;
  let cooldownRemaining = 0;

  for (let i = 0; i < API_KEYS.length; i++) {
    currentIndex = (currentIndex + 1) % API_KEYS.length;
    apiKey = API_KEYS[currentIndex];
    const lastRequest = lastRequestTime.get(apiKey) || 0;
    cooldownRemaining = Math.max(0, cooldownPeriod - (now - lastRequest));

    if (cooldownRemaining === 0) {
      lastRequestTime.set(apiKey, now);
      return apiKey;
    }
  }

  // If all keys are on cooldown, wait for the shortest remaining cooldown
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getNextApiKey());
    }, cooldownRemaining);
  });
}
