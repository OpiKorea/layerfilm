import torch
from diffusers import StableDiffusionXLImg2ImgPipeline, DPMSolverMultistepScheduler
from diffusers.utils import load_image
import argparse
import os

# Argument Parser
parser = argparse.ArgumentParser(description="Local SDXL Img2Img Chaining Script")
parser.add_argument("--prompt", type=str, required=True, help="Text prompt")
parser.add_argument("--init_image", type=str, required=True, help="Path to previous scene image")
parser.add_argument("--output", type=str, required=True, help="Output file path")
parser.add_argument("--strength", type=float, default=0.3, help="Img2Img Strength (Lower = closer to original)")
parser.add_argument("--seed", type=int, default=-1, help="Random seed")
parser.add_argument("--neg", type=str, default="", help="Negative prompt")

args = parser.parse_args()

# Z: Drive Safety
if not os.path.abspath(args.output).lower().startswith("z:\\"):
    print(f"❌ SAFETY ERROR: Output must be on Z: drive.")
    exit(1)

model_path = "Z:/layerfilm/models/Stable-diffusion/RealVisXL_V3.0.safetensors"
if not os.path.exists(model_path):
    print(f"⚠️ Model not found: {model_path}")
    exit(1)

print(f"🚀 Initializing RealVisXL (Img2Img Mode)...")

pipe = StableDiffusionXLImg2ImgPipeline.from_single_file(
    model_path,
    torch_dtype=torch.float16,
    use_safetensors=True
)
pipe.to("cuda")
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config, use_karras_sigmas=True)

# Prompts
# PROTOCOL ENFORCEMENT: Identity & Anatomy Compatibility (The "200" Check)
base_neg = (
    "(deformed:1.3), bad anatomy, mutation, ugly, (cartoon:1.2), "
    "morphing, extra limbs, missing limbs, disconnected limbs, "
    "distorted face, changing face, aging, different person, "
    "floating limbs, blurry, out of focus, low quality, "
    "text, watermark, signature, username, error, "
    "bad color, oversaturated, undersaturated, color shift, "
    "glitch, noise, pixelated"
)
final_neg = f"{base_neg}, {args.neg}" if args.neg else base_neg
enhanced_prompt = f"{args.prompt}, (cinematic lighting, 8k, photorealism:1.2)"

# Load Init Image
print(f"🖼️ Loading Reference: {args.init_image}")
init_img = load_image(args.init_image).convert("RGB")
init_img = init_img.resize((1280, 720)) # Ensure 16:9

generator = torch.Generator("cuda").manual_seed(args.seed) if args.seed != -1 else None

print(f"🎨 Generating Chain Link... (Strength: {args.strength})")
image = pipe(
    prompt=enhanced_prompt,
    negative_prompt=final_neg,
    image=init_img,
    strength=args.strength, # Critical for narrative flow
    num_inference_steps=40,
    guidance_scale=7.5,
    generator=generator
).images[0]

os.makedirs(os.path.dirname(args.output), exist_ok=True)
image.save(args.output)
print(f"✅ Chained Scene Saved: {args.output}")
