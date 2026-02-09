import sys

def create_srt(lines, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        for i, (start, end, text) in enumerate(lines, 1):
            f.write(f"{i}\n")
            f.write(f"{start} --> {end}\n")
            f.write(f"{text}\n\n")
    print(f"[SRT] Saved: {output_file}")

if __name__ == "__main__":
    # Example usage for Scene 1
    scene_1_lines = [
        ("00:00:01,000", "00:00:05,000", "아주 아주 옛날, 산과 숲이 끝없이 이어진 깊은 산골 마을에 착하고 마음 고운 오누이가 살고 있었어요."),
        ("00:00:06,000", "00:00:09,000", "여동생아, 오늘은 내가 밥을 지을게."),
        ("00:00:10,000", "00:00:12,000", "정말? 그럼 난 마당을 쓸게!")
    ]
    create_srt(scene_1_lines, "Z:/layerfilm/exports/The_Sun_and_the_Moon_S01.srt")
