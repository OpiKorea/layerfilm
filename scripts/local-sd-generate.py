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
    print(f"❌ SAFETY ERROR: All outputs must be on Z: drive. Requested: {args.output}")
    exit(1)

# Model Path (RealVisXL)
# We use the local file path if available, otherwise fallback (but user wants local)
model_path = "models/Stable-diffusion/RealVisXL_V3.0.safetensors"
if not os.path.exists(model_path):
    print(f"⚠️ Model not found at {model_path}. Please wait for download.")
    # Fallback to standard SDXL if needed, but we want to force RealVis
    # model_id = "stabilityai/stable-diffusion-xl-base-1.0"
    exit(1) 

print(f"🚀 Initializing RealVisXL... (Device: CUDA)")

# Load Pipeline (Single file)
pipe = StableDiffusionXLPipeline.from_single_file(
    model_path,
    torch_dtype=torch.float16,
    use_safetensors=True
)
pipe.to("cuda")

# Scheduler
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config, use_karras_sigmas=True)

# Cinematic Prompt Enhancer
base_negative = "(deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, (mutated hands and fingers:1.4), disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, (3d render, cartoon, anime:1.2), text, watermark"
final_negative = f"{base_negative}, {args.neg}" if args.neg else base_negative

enhanced_prompt = f"{args.prompt}, (cinematic lighting, 35mm lens, f/1.8, film grain, hyperrealistic, 8k, raw photo:1.2)"

# Seed
generator = None
if args.seed != -1:
    generator = torch.Generator("cuda").manual_seed(args.seed)

print(f"🎨 Generating: '{args.prompt}'")
print(f"🚫 Negative: '{args.neg}'")
print(f"📐 Resolution: {args.width}x{args.height}")

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
print(f"✅ Saved to: {args.output}")
