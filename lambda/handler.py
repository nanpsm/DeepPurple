import json
import os
import google.generativeai as genai


def handler(event, context):
    text = event.get("text", "")
    source = event.get("source", "UNKNOWN").lower().replace("_", " ")

    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            temperature=0.2,
        ),
    )

    prompt = (
        f"Analyze the following {source} text for emotions and sentiment.\n"
        "Return ONLY a JSON object with these exact fields:\n"
        "- primaryEmotion: one of JOY, ANGER, FEAR, SADNESS, SURPRISE, DISGUST, TRUST\n"
        "- sentimentScore: float from -1.0 (very negative) to 1.0 (very positive)\n"
        "- emotionScores: object with keys joy, anger, fear, sadness, surprise, disgust, trust "
        "where each value is a float 0-1 and all values sum to 1.0\n"
        "- topics: array of up to 5 short topic strings relevant to the text\n"
        "- summary: one sentence summarizing the emotional content\n\n"
        f"Text:\n{text}"
    )

    response = model.generate_content(prompt)
    return json.loads(response.text)


if __name__ == "__main__":
    import sys

    sample_text = (
        sys.argv[1]
        if len(sys.argv) > 1
        else "I am really frustrated with the service, this is completely unacceptable!"
    )
    test_event = {"text": sample_text, "source": "SUPPORT_TICKET"}
    print(json.dumps(handler(test_event, None), indent=2))
