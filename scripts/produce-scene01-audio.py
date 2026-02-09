import asyncio
import edge_tts
import sys

# Scene 1 Script
S01_LINES = [
    {"id": "Narrator", "text": "아주 먼 옛날, 깊은 산속 어느 마을에 오누이가 살고 있었습니다.", "voice": "ko-KR-BongJinNeural"},
    {"id": "Brother", "text": "여동생아, 내가 밥 지을게.", "voice": "ko-KR-InJoonNeural"},
    {"id": "Sister", "text": "정말? 그럼 난 마당을 쓸게!", "voice": "ko-KR-SunHiNeural"}
]

async def generate_all():
    for line in S01_LINES:
        output_file = f"Z:/layerfilm/exports/S01_{line['id']}.mp3"
        communicate = edge_tts.Communicate(line['text'], line['voice'])
        await communicate.save(output_file)
        print(f"[VOICE] Generated: {output_file}")

if __name__ == "__main__":
    asyncio.run(generate_all())
