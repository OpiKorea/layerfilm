import torch
from diffusers import StableVideoDiffusionPipeline
from diffusers.utils import load_image, export_to_video
import argparse
import os

# Argument Parser
parser = argparse.ArgumentParser(description="Local SVD Video Generation Script")
parser.add_argument("--image", type=str, required=True, help="Input image path")
parser.add_argument("--output", type=str, required=True, help="Output video path")
parser.add_argument("--seed", type=int, default=42, help="Random seed")
parser.add_argument("--frames", type=int, default=21, help="Number of frames (21=3s)")
parser.add_argument("--motion", type=int, default=32, help="Motion Bucket ID (1-255)")
parser.add_argument("--noise", type=float, default=0.2, help="Noise Aug Strength (0-1)")

args = parser.parse_args()

# Z: Drive Safety Check
if not os.path.abspath(args.output).lower().startswith("z:\\"):
    print(f"[ERROR] All outputs must be on Z: drive. Requested: {args.output}")
    exit(1)

# Model Path (Z Drive)
model_path = "Z:/layerfilm/models/SVD/svd_xt.safetensors"

print(f"[INFO] Initializing SVD-XT... (Device: CUDA)")

# Load Pipeline
try:
    pipe = StableVideoDiffusionPipeline.from_single_file(
        model_path,
        torch_dtype=torch.float16,
        variant="fp16"
    )
except AttributeError:
    print("[WARN] 'from_single_file' not found on Pipeline. Trying legacy load...")
    from diffusers.loaders import FromSingleFileMixin
    print("[INFO] Downloading/Loading from Hub to Z: cache...")
    pipe = StableVideoDiffusionPipeline.from_pretrained(
        "stabilityai/stable-video-diffusion-img2vid-xt",
        torch_dtype=torch.float16,
        variant="fp16",
        cache_dir="Z:/layerfilm/models/cache"
    )

pipe.enable_model_cpu_offload()

print(f"[INFO] Loading and Resizing image: {args.image}")
image = load_image(args.image)
image = image.resize((1024, 576))

generator = torch.manual_seed(args.seed)

# 1. Motion Generation
print(f"[INFO] Generating {args.frames} frames (ULTRA STABILITY MODE)...")
frames = pipe(
    image, 
    decode_chunk_size=2,
    generator=generator,
    motion_bucket_id=args.motion,
    noise_aug_strength=args.noise,
    num_frames=args.frames
).frames[0]

# Ensure directory
os.makedirs(os.path.dirname(args.output), exist_ok=True)

# SAVE LAST FRAME FOR CHAINING
last_frame_path = args.output.replace(".mp4", "_last.png")
frames[-1].save(last_frame_path)
print(f"[INFO] Last frame saved for chaining: {last_frame_path}")

# 2. Save Raw Interim Video
temp_output = args.output.replace(".mp4", "_raw.mp4")
print(f"[INFO] Saving raw 7fps video to: {temp_output}")
export_to_video(frames, temp_output, fps=7)

# 3. MANDATORY 60FPS INTERPOLATION + TEMPORAL SMOOTHING + 4K
print(f"[INFO] MANDATORY STEP: Mastering (60FPS + Shimmer Killer + 4K)...")
ffmpeg_path = "C:\\layerfilm\\.venv\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe"

# Added 'hqdn3d' (Temporal Denoiser) and 'atadenoise' to stabilize pixel shimmer
# and 'minterpolate' with improved settings for smoothness
filter_str = (
    "hqdn3d=2:2:3:3," + # Temporal noise reduction
    "atadenoise=0.04:0.04:0.04," + # Adaptive temporal averager
    "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1," +
    "scale=3840:2160:flags=lanczos"
)

import subprocess
cmd = [
    ffmpeg_path, "-i", temp_output,
    "-vf", filter_str,
    "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-pix_fmt", "yuv420p",
    "-y", args.output
]

try:
    subprocess.run(cmd, check=True)
    print(f"[SUCCESS] ULTRA-STABLE 60FPS 4K MASTER READY: {args.output}")
    if os.path.exists(temp_output):
        os.remove(temp_output)
except Exception as e:
    print(f"[ERROR] FFMPEG Mastering Failed: {e}")
