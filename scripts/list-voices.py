import asyncio
import edge_tts

async def list_voices():
    voices = await edge_tts.VoicesManager.create()
    ko_voices = voices.find(Locale="ko-KR")
    for v in ko_voices:
        print(f"{v['ShortName']} - {v['Gender']}")

if __name__ == "__main__":
    asyncio.run(list_voices())
