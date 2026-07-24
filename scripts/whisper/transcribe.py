"""Transcribe an audio file with OpenAI Whisper.

Setup:
    pip install -r requirements.txt

Usage:
    python transcribe.py <audio-file> [--model base] [--output transcript.txt]
"""

import argparse
from pathlib import Path

import static_ffmpeg

static_ffmpeg.add_paths()  # downloads ffmpeg/ffprobe on first run and adds them to PATH

import whisper


def main() -> None:
    parser = argparse.ArgumentParser(description="Transcribe audio with Whisper")
    parser.add_argument("audio", help="Path to the audio file (mp3, wav, m4a, ...)")
    parser.add_argument(
        "--model",
        default="base",
        choices=whisper.available_models(),
        help="Whisper model size (default: base)",
    )
    parser.add_argument("--output", help="Write transcript to this file instead of stdout")
    args = parser.parse_args()

    model = whisper.load_model(args.model)
    result = model.transcribe(args.audio)
    text = result["text"].strip()

    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
        print(f"Transcript written to {args.output}")
    else:
        print(text)


if __name__ == "__main__":
    main()
