"""
ASR数据预处理脚本 v2
功能：
1. 丢弃逐字数据（words数组），只保留句子级别
2. 简化结构，去除additions嵌套
3. 调用阿里千问模型判断角色映射
4. 输出干净的JSON
"""

import json
import os
import requests
from pathlib import Path


# ============== 阿里千问配置 ==============
QWEN_API_KEY = os.getenv("QWEN_API_KEY", "sk-f7927ecff1824b8bacdf041d7cd57c31")
QWEN_MODEL = os.getenv("QWEN_MODEL", "qwen3.6-plus")
QWEN_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
# ===========================================


def load_asr_data(input_path: str) -> dict:
    """加载ASR原始数据"""
    with open(input_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def simplify_utterances(utterances: list, mapping: dict) -> list:
    """
    简化utterances结构：
    1. 丢弃逐字数据（words数组）
    2. 去除additions嵌套，直接展平
    3. 应用角色映射，去掉speaker字段
    """
    simplified = []

    for utt in utterances:
        # 原始ASR格式：start_time, end_time, additions.speaker
        speaker = utt.get('additions', {}).get('speaker', '')
        role = mapping.get(speaker, 'unknown')
        simplified.append({
            'start': utt.get('start_time', 0),
            'end': utt.get('end_time', 0),
            'text': utt.get('text', '').strip(),
            'role': role
        })

    # 按时间排序
    simplified.sort(key=lambda x: x['start'])

    return simplified


def extract_conversation_snippet(utterances: list, start_idx: int, count: int = 30) -> list:
    """
    提取连续的对话片段用于角色判断
    """
    end_idx = min(start_idx + count, len(utterances))
    return utterances[start_idx:end_idx]


def format_time(ms: int) -> str:
    """毫秒转换为 MM:SS 格式"""
    seconds = ms // 1000
    minutes = seconds // 60
    seconds = seconds % 60
    return f"{minutes:02d}:{seconds:02d}"


def build_role_detection_prompt(snippet: list) -> str:
    """
    构建角色检测的prompt（适配原始ASR格式）
    """
    lines = []
    for utt in snippet:
        time_str = format_time(utt.get('start_time', 0))
        speaker = utt.get('additions', {}).get('speaker', '?')
        text = utt.get('text', '')
        lines.append(f"[{time_str}] {speaker}: {text}")

    conversation = "\n".join(lines)

    prompt = f"""你是一个课堂分析助手。请分析以下课堂对话片段，判断哪个说话人是教师。

【对话片段】
{conversation}

【分析要求】
1. 教师特征：引导课堂、组织教学、提问学生、点评回答、讲解知识
2. 学生特征：响应提问、表达观点、朗读背诵、提问较少
3. 通常课堂上教师说话时间更长，问题更多

请直接输出JSON格式的判断结果：
{{"teacher_speaker": "X", "reason": "简要说明（20字内）"}}

只输出JSON，不要其他内容。"""

    return prompt


def detect_teacher_speaker(snippet: list) -> str:
    """
    调用阿里千问模型判断哪个speaker是教师
    """
    prompt = build_role_detection_prompt(snippet)

    headers = {
        "Authorization": f"Bearer {QWEN_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": QWEN_MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 200,
        "temperature": 0.1
    }

    try:
        response = requests.post(QWEN_API_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()

        result = response.json()
        content = result['choices'][0]['message']['content'].strip()

        # 解析JSON响应
        # 可能包含markdown代码块，需要提取
        if content.startswith("```"):
            lines = content.split("\n")
            lines = [l for l in lines if not l.startswith("```")]
            content = "\n".join(lines).strip()

        parsed = json.loads(content)
        teacher_speaker = parsed.get('teacher_speaker', '1')

        print(f"    [LLM] 判断教师为: speaker_{teacher_speaker}")
        print(f"    [LLM] 理由: {parsed.get('reason', '')}")

        return teacher_speaker

    except Exception as e:
        print(f"    [ERROR] LLM调用失败: {e}")
        # 默认返回 speaker_1
        return "1"


def map_speakers_to_roles(utterances: list) -> dict:
    """
    1. 提取包含多个speaker的片段
    2. 调用LLM判断教师角色
    3. 返回角色映射 {speaker_id: role}
    """
    # 获取所有speaker（从原始格式 additions.speaker）
    speakers = list(set(u.get('additions', {}).get('speaker', '1') for u in utterances))
    print(f"\n[INFO] 发现 {len(speakers)} 个说话人: {sorted(speakers)}")

    # 如果只有1个speaker，直接标记为教师
    if len(speakers) == 1:
        mapping = {speakers[0]: "teacher"}
        print(f"[INFO] 只有一个说话人，标记为教师")
        return mapping

    # 找到包含多个speaker的连续片段
    snippet_start = 0
    for i, utt in enumerate(utterances):
        snippet = extract_conversation_snippet(utterances, i, 30)
        snippet_speakers = set(u.get('additions', {}).get('speaker', '?') for u in snippet)
        if len(snippet_speakers) >= 2:
            snippet_start = i
            print(f"\n[INFO] 找到包含多个speaker的片段（索引 {i}）")
            break
    else:
        snippet_start = 0
        print(f"\n[INFO] 未找到多speaker片段，使用开头片段")

    # 提取片段
    snippet = extract_conversation_snippet(utterances, snippet_start, 30)
    snippet_speakers = set(u.get('additions', {}).get('speaker', '?') for u in snippet)
    print(f"    片段包含speaker: {sorted(snippet_speakers)}")

    # 调用LLM判断
    teacher_speaker = detect_teacher_speaker(snippet)

    # 构建映射
    mapping = {}
    for sp in speakers:
        if sp == teacher_speaker:
            mapping[sp] = "teacher"
        else:
            mapping[sp] = "student"

    print(f"\n[INFO] 角色映射结果:")
    for sp, role in sorted(mapping.items()):
        print(f"    speaker_{sp} -> {role}")

    return mapping


def save_processed_data(data: dict, output_path: str):
    """保存处理后的数据"""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def main(input_file: str = None, output_file: str = None):
    """
    主处理流程
    """
    base_dir = Path(__file__).parent

    if input_file is None:
        input_file = base_dir / 'kt4ys_asr_result.json'
    else:
        input_file = Path(input_file)

    if output_file is None:
        output_file = base_dir / 'kt4ys_processed.json'
    else:
        output_file = Path(output_file)

    print("=" * 60)
    print("ASR数据预处理")
    print("=" * 60)
    print(f"\n[1] 加载原始数据: {input_file}")

    raw_data = load_asr_data(str(input_file))
    original_utterances = raw_data.get('utterances', [])

    print(f"    - 原始句子数: {len(original_utterances)}")

    # 2. 调用LLM判断角色
    print(f"\n[2] 调用LLM进行角色映射...")
    speaker_mapping = map_speakers_to_roles(original_utterances)

    # 3. 简化结构
    print(f"\n[3] 简化utterances结构...")
    simplified = simplify_utterances(original_utterances, speaker_mapping)
    print(f"    - 简化后句子数: {len(simplified)}")

    # 4. 构建输出（无metadata）
    print(f"\n[4] 保存结果: {output_file}")
    output_data = {'utterances': simplified}
    save_processed_data(output_data, str(output_file))

    print(f"\n" + "=" * 60)
    print(f"[处理完成] 共 {len(simplified)} 条记录")
    print("=" * 60)

    return output_data


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description="ASR数据预处理 v2")
    parser.add_argument('--input', '-i', help='输入文件路径')
    parser.add_argument('--output', '-o', help='输出文件路径')

    args = parser.parse_args()

    main(args.input, args.output)
