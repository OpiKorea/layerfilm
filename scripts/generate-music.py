import torchaudio
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write
import os

# Ensure Z: drive output
output_dir = "Z:/layerfilm/drama-assets/noir-city-short/audio"
os.makedirs(output_dir, exist_ok=True)

print("🚀 Loading MusicGen-Large (Facebook)...")
model = MusicGen.get_pretrained('facebook/musicgen-large')

print("🎵 Generating Music: 'Dark Cyberpunk Noir Jazz'...")
model.set_generation_params(duration=30)  # Generate 30 seconds

descriptions = [
    "Dark cinematic cyberpunk noir jazz with heavy rain ambiance and slow synthesizer pads",
]

wav = model.generate(descriptions)  # generates 30 seconds.

for idx, one_wav in enumerate(wav):
    # Will save as {idx}.wav, with loudness normalization at -14 db LUFS.
    audio_write(f'{output_dir}/noir_OST', one_wav.cpu(), model.sample_rate, strategy="loudness", loudness_headroom_db=16)

print(f"✅ Music Generated at: {output_dir}/noir_OST.wav")
