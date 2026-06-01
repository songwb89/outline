import argparse
import json
from pathlib import Path


def remove_words_field(obj):
    """Recursively remove any key named 'words' from dicts."""
    if isinstance(obj, dict):
        if "words" in obj:
            obj = dict(obj)
            obj.pop("words", None)
        for k, v in list(obj.items()):
            obj[k] = remove_words_field(v)
        return obj
    if isinstance(obj, list):
        return [remove_words_field(x) for x in obj]
    return obj


def main():
    parser = argparse.ArgumentParser(description="Remove 'words' field from ASR processed json")
    parser.add_argument("--input", "-i", required=True, help="Input json file path")
    parser.add_argument(
        "--output",
        "-o",
        default=None,
        help="Output json file path (default: <input>_no_words.json)",
    )
    args = parser.parse_args()

    in_path = Path(args.input)
    if args.output:
        out_path = Path(args.output)
    else:
        out_path = in_path.with_name(f"{in_path.stem}_no_words{in_path.suffix}")

    with in_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    cleaned = remove_words_field(data)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(cleaned, f, ensure_ascii=False)

    print(f"Wrote: {out_path}")


if __name__ == "__main__":
    main()
