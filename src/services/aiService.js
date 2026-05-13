import { GEMINI_API_KEY } from '../utils/config';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * buildPrompt
 * Constructs a concise prompt for Gemini from places data.
 */
function buildPrompt(places, categoryLabel, userLat, userLng) {
  const placeList = places
    .map(
      (p, i) =>
        `${i + 1}. ${p.name} — ${p.address}` +
        (p.rating ? ` | ⭐ ${p.rating} (${p.totalRatings} reviews)` : '') +
        (p.openNow != null ? (p.openNow ? ' | Open now' : ' | Closed') : ''),
    )
    .join('\n');

  return `You are NearMind, a friendly AI local guide.
The user is near coordinates (${userLat.toFixed(4)}, ${userLng.toFixed(4)}).
They are looking for nearby ${categoryLabel}s.

Here are the top results from Google Places:
${placeList}

Write a helpful, natural recommendation in 2-3 sentences.
- Mention the best option by name and why it stands out.
- Add one secondary option if relevant.
- Keep it conversational and under 80 words.
- Do NOT use markdown or bullet points.`;
}

/**
 * getAIRecommendation
 * Sends places data to Gemini and returns AI-generated text.
 *
 * @param {Array}  places        - cleaned places array from placesService
 * @param {string} categoryLabel - 'Hotel' | 'Hospital' | 'Park' | 'School'
 * @param {number} userLat
 * @param {number} userLng
 * @returns {Promise<string>}    - AI recommendation text
 */
export async function getAIRecommendation(
  places,
  categoryLabel,
  userLat,
  userLng,
) {
  const prompt = buildPrompt(places, categoryLabel, userLat, userLng);

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 200,
    },
  };

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    'Sorry, I could not generate a recommendation right now.';

  return text.trim();
}
