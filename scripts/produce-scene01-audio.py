import asyncio
import edge_tts
import sys
import os

# Scene 1 Script - Differentiated Voices
S01_LINES = [
    {"id": "Narrator", "text": "아주 아주 옛날, 어느 산골 마을에 마음씨 고운 오누이가 살고 있었어요.", "voice": "ko-KR-HyunsuMultilingualNeural"},
    {"id": "Brother", "text": "여동생아, 오늘은 내가 밥을 지을게.", "voice": "ko-KR-InJoonNeural"},
    {"id": "Sister", "text": "정말? 그럼 난 마당을 쓸게!", "voice": "ko-KR-SunHiNeural"}
]

async def generate_all():
    if not os.path.exists("Z:/layerfilm/exports"):
        os.makedirs("Z:/layerfilm/exports")
        
    for line in S01_LINES:
        output_file = f"Z:/layerfilm/exports/S01_{line['id']}.mp3"
        try:
            communicate = edge_tts.Communicate(line['text'], line['voice'])
            await communicate.save(output_file)
            print(f"[VOICE] Generated: {output_file} ({line['voice']})")
        except Exception as e:
            print(f"[VOICE] Error for {line['id']}: {e}")

if __name__ == "__main__":
    asyncio.run(generate_all())
