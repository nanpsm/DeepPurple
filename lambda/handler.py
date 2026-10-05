import json
import os
from openai import OpenAI


def handler(event, context):
    text = event.get("text", "")
    source = event.get("source", "UNKNOWN").lower().replace("_", " ")

    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

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

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert emotion analysis engine. "
                    "Always respond with valid JSON only, no prose or markdown."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
        response_format={"type": "json_object"},
    )

    return json.loads(response.choices[0].message.content)


if __name__ == "__main__":
    import sys

    sample_text = (
        sys.argv[1]
        if len(sys.argv) > 1
        else "I am really frustrated with the service, this is completely unacceptable!"
    )
    test_event = {"text": sample_text, "source": "SUPPORT_TICKET"}
    print(json.dumps(handler(test_event, None), indent=2))
