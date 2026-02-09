import torch
from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler
import argparse
import os

# Argument Parser
parser = argparse.ArgumentParser(description="Local SDXL Generation Script")
parser.add_argument("--prompt", type=str, required=True, help="Text prompt for generation")
parser.add_argument("--output", type=str, required=True, help="Output file path")
parser.add_argument("--steps", type=int, default=40, help="Number of inference steps")
parser.add_argument("--width", type=int, default=1280, help="Image width")
parser.add_argument("--height", type=int, default=720, help="Image height")
parser.add_argument("--seed", type=int, default=-1, help="Random seed (-1 for random)")
parser.add_argument("--neg", type=str, default="", help="Additional negative prompt")

args = parser.parse_args()

# Z: Drive Safety Check
if not os.path.abspath(args.output).lower().startswith("z:\\"):
    print(f"[ERROR] All outputs must be on Z: drive. Requested: {args.output}")
    exit(1)

# Model Path (RealVisXL on Z: Drive)
model_path = "Z:/layerfilm/models/Stable-diffusion/RealVisXL_V3.0.safetensors"
if not os.path.exists(model_path):
    print(f"[WARN] Model not found at {model_path}. Please check Z: drive connection.")
    exit(1)

print(f"[INFO] Initializing RealVisXL... (Device: CUDA)")

# Load Pipeline (Single file)
pipe = StableDiffusionXLPipeline.from_single_file(
    model_path,
    torch_dtype=torch.float16,
    use_safetensors=True
)
pipe.to("cuda")

# Scheduler
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config, use_karras_sigmas=True)

# --- Cinema Brain Integration ---
import json
brain_path = "c:/layerfilm/scripts/cinema_brain.json"
cinematic_suffix = "cinematic lighting, 35mm lens, 8k, raw photo"
base_neg_list = ["deformed", "ugly", "blurry"]

if os.path.exists(brain_path):
    try:
        with open(brain_path, "r", encoding="utf-8") as f:
            brain = json.load(f)
            dk = brain.get("directorial_knowledge", {})
            cinematic_suffix = ", ".join(dk.get("cinematic_foundation", []))
            base_neg_list = dk.get("negative_protocol", [])
            print(f"[INFO] Cinema Brain Synced (v{brain.get('version')})")
    except Exception as e:
        print(f"[WARN] Cinema Brain Error: {e}")

final_negative = f"{', '.join(base_neg_list)}, {args.neg}" if args.neg else ", ".join(base_neg_list)
enhanced_prompt = f"{args.prompt}, ({cinematic_suffix}:1.2)"

# Seed
generator = None
if args.seed != -1:
    generator = torch.Generator("cuda").manual_seed(args.seed)

print(f"[INFO] Generating: '{args.prompt}'")
print(f"[INFO] Negative: '{args.neg}'")
print(f"[INFO] Resolution: {args.width}x{args.height}")

image = pipe(
    prompt=enhanced_prompt,
    negative_prompt=final_negative,
    num_inference_steps=args.steps,
    width=args.width,
    height=args.height,
    guidance_scale=7.0,
    generator=generator
).images[0]

# Ensure directory
os.makedirs(os.path.dirname(args.output), exist_ok=True)

image.save(args.output)
print(f"[SUCCESS] Saved to: {args.output}")
