import numpy as np
from scipy.io.wavfile import write
import os

# Output setup
output_dir = "Z:/layerfilm/drama-assets/noir-city-short/audio"
os.makedirs(output_dir, exist_ok=True)
output_path = f"{output_dir}/noir_OST.wav"

print("🎵 Generating Cyberpunk Dark Drone (Mathematical Audio)...")

# Parameters
duration = 30  # seconds
sample_rate = 44100
t = np.linspace(0, duration, int(sample_rate * duration))

# Oscillators (Cyberpunk Drone Style)
# Low frequency drone (55Hz - A1)
drone_low = 0.5 * np.sin(2 * np.pi * 55 * t)

# Detuned oscillators for "Reese Bass" feel
drone_sub1 = 0.3 * np.sin(2 * np.pi * (55 + 0.5) * t)
drone_sub2 = 0.3 * np.sin(2 * np.pi * (55 - 0.5) * t)

# High pitch "Scanner" noise (Sine wave with FM modulation)
modulator = np.sin(2 * np.pi * 0.2 * t) # Slow LFO
carrier = 0.1 * np.sin(2 * np.pi * (880 + 200 * modulator) * t)

# Noise layer (Rain texture)
noise = 0.05 * np.random.normal(0, 1, len(t))

# Mix
audio = drone_low + drone_sub1 + drone_sub2 + carrier + noise

# Normalize to 16-bit integer range
audio = audio / np.max(np.abs(audio))
audio = (audio * 32767).astype(np.int16)

# Save
write(output_path, sample_rate, audio)
print(f"✅ Generated Mathematical Ambience: {output_path}")
