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
parser.add_argument("--skip-master", action="store_true", help="Skip 60fps/4k mastering (Output raw 7fps only)")

args = parser.parse_args()

# Z: Drive Safety Check
if not os.path.abspath(args.output).lower().startswith("z:\\"):
    print(f"[ERROR] All outputs must be on Z: drive. Requested: {args.output}")
    exit(1)

# Model Path (Z Drive)
model_path = "Z:/layerfilm/models/SVD/svd_xt.safetensors"

print(f"[INFO] Initializing SVD-XT... (Device: CUDA)")

# Silence all underlying noise
os.environ["DIFFUSERS_VERBOSITY"] = "error"
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

# Load Pipeline
try:
    pipe = StableVideoDiffusionPipeline.from_single_file(
        model_path,
        torch_dtype=torch.float16,
        variant="fp16"
    )
except Exception:
    print("[INFO] Falling back to pretrained load...")
    pipe = StableVideoDiffusionPipeline.from_pretrained(
        "stabilityai/stable-video-diffusion-img2vid-xt",
        torch_dtype=torch.float16,
        variant="fp16",
        cache_dir="Z:/layerfilm/models/cache"
    )

pipe.to("cuda") # Force to CUDA for stability if memory allows
# pipe.enable_model_cpu_offload() # Keeping this as fallback if needed, but pipe.to("cuda") is faster

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

if args.skip_master:
    print(f"[INFO] Skip Master Flag Active. Renaming raw output to target.")
    if os.path.exists(temp_output):
        if os.path.exists(args.output):
            os.remove(args.output)
        os.rename(temp_output, args.output)
    exit(0)

# 3. MANDATORY 60FPS INTERPOLATION + TEMPORAL SMOOTHING + 4K
print(f"[INFO] MANDATORY STEP: Mastering (Split Protocol for Stability)...")
ffmpeg_path = "C:\\layerfilm\\.venv\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe"
import subprocess
import time

try:
    # --- PASS 1: INTERPOLATION (CPU Intensive) ---
    # We keep resolution low (1024x576) for the heavy interpolation
    print(f"[INFO] PASS 1/2: Interpolating to 60FPS...")
    interp_output = args.output.replace(".mp4", "_60fps_raw.mp4")
    
    # Using 'mci' (Motion Compensation) but strictly at source resolution
    filter_interp = "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
    
    cmd_1 = [
        ffmpeg_path, "-i", temp_output,
        "-vf", filter_interp,
        "-c:v", "libx264", "-preset", "fast", "-crf", "18", 
        "-y", interp_output
    ]
    subprocess.run(cmd_1, check=True)
    
    # --- COOLDOWN ---
    print(f"[INFO] Cooldown Protocol (3s)...")
    time.sleep(3)

    # --- PASS 2: MASTERING (GPU/RAM Intensive) ---
    # Upscale to 4K + Denoise the now-smooth 60fps video
    print(f"[INFO] PASS 2/2: Upscaling to 4K + Denoising...")
    
    filter_master = (
        "hqdn3d=2:2:3:3," + 
        "atadenoise=0.04:0.04:0.04," +
        "scale=3840:2160:flags=lanczos"
    )
    
    cmd_2 = [
        ffmpeg_path, "-i", interp_output,
        "-vf", filter_master,
        "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-pix_fmt", "yuv420p",
        "-y", args.output
    ]
    subprocess.run(cmd_2, check=True)

    print(f"[SUCCESS] ULTRA-STABLE 60FPS 4K MASTER READY: {args.output}")
    
    # Cleanup
    # DISABLE cleanup of temp_output because generate-recursive-chain.ps1 NEEDS it for concatenation!
    # if os.path.exists(temp_output): os.remove(temp_output)
    if os.path.exists(interp_output): os.remove(interp_output)

except Exception as e:
    print(f"[ERROR] FFMPEG Mastering Failed: {e}")
