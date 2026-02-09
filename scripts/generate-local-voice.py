import asyncio
import edge_tts
import sys
import os

async def generate_voice(text, output_file, voice="ko-KR-SunHiNeural"):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)
    print(f"[TTS] Saved: {output_file}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate-local-voice.py <text> <output_file> [voice]")
        sys.exit(1)
    
    text = sys.argv[1]
    output_path = sys.argv[2]
    voice = sys.argv[3] if len(sys.argv) > 3 else "ko-KR-SunHiNeural"
    
    asyncio.run(generate_voice(text, output_path, voice))
