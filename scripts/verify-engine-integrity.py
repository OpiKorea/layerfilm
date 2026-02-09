import os
import struct

def check_gguf(path):
    try:
        with open(path, 'rb') as f:
            magic = f.read(4)
            if magic == b'GGUF':
                return "OK (GGUF Magic found)"
            else:
                return f"FAILED (Invalid Magic: {magic.hex()})"
    except Exception as e:
        return f"ERROR: {e}"

def check_safetensors(path):
    try:
        with open(path, 'rb') as f:
            header_size_bytes = f.read(8)
            if len(header_size_bytes) < 8:
                return "FAILED (File too small for header)"
            header_size = struct.unpack('<Q', header_size_bytes)[0]
            if header_size < 2 or header_size > 100_000_000: # Practical limits
                return f"FAILED (Invalid Header Size: {header_size})"
            f.seek(8 + header_size)
            # Try to read some data after header to ensure file is not truncated
            test_data = f.read(1024)
            if len(test_data) == 0:
                return "FAILED (Truncated - No data after header)"
            return "OK (Header & Data found)"
    except Exception as e:
        return f"ERROR: {e}"

models = {
    "UNET_HIGH": r"Z:\layerfilm\programs\ComfyUI\models\unet\Wan2.2-T2V-A14B-HighNoise-Q4_K_M.gguf",
    "UNET_LOW": r"Z:\layerfilm\programs\ComfyUI\models\unet\Wan2.2-T2V-A14B-LowNoise-Q4_K_M.gguf",
    "IP_ADAPTER": r"Z:\layerfilm\programs\ComfyUI\models\ipadapter\ip-adapter.bin",
    "CONTROLNET_DEPTH": r"Z:\layerfilm\programs\ComfyUI\models\controlnet\wan2.2_depth.safetensors",
    "SUPIR_BASE": r"Z:\layerfilm\programs\ComfyUI\models\checkpoints\SUPIR-v0Q_fp16.safetensors",
    "SDXL_BASE": r"Z:\layerfilm\programs\ComfyUI\models\checkpoints\sd_xl_base_1.0.safetensors"
}

print("--- Grand Master Engine Integrity Report ---")
for name, path in models.items():
    if not os.path.exists(path):
        print(f"{name}: MISSING ({path})")
        continue
    
    size_gb = os.path.getsize(path) / (1024**3)
    if path.endswith(".gguf"):
        status = check_gguf(path)
    elif path.endswith(".safetensors"):
        status = check_safetensors(path)
    else:
        status = "OK (Size checked)"
        
    print(f"{name}: {status} | Size: {size_gb:.2f} GB")
