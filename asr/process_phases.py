import json

# 读取教学环节数据
with open('asr/教学环节.json', 'r', encoding='utf-8') as f:
    teaching_data = json.load(f)

# 读取课堂对话数据
with open('asr/kt4ys_processed_no_words.json', 'r', encoding='utf-8') as f:
    utterances_data = json.load(f)

utterances = utterances_data['utterances']

# 构建执行环节数据
execution_phases = []

for phase in teaching_data['teaching_phases']:
    phase_name = phase['name']
    details = phase['details']

    # 取第一个子环节的 start_ms 和最后一个子环节的 end_ms
    start_ms = details[0]['start_ms']
    end_ms = details[-1]['end_ms']

    # 筛选该时间区间的 utterances
    phase_transcript = [
        {
            "text": u['text'],
            "role": u['role']
        }
        for u in utterances
        if start_ms <= u['start_ms'] and u['end_ms'] <= end_ms
    ]

    execution_phases.append({
        "name": phase_name,
        "transcript": phase_transcript
    })

# 构建最终输出
output = {
    "execution_phases": execution_phases
}

# 保存到 20.json
with open('asr/20.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=4)

print(f"已生成 asr/20.json，包含 {len(execution_phases)} 个执行环节")
for ep in execution_phases:
    print(f"  - {ep['name']}: {len(ep['transcript'])} 条对话")
