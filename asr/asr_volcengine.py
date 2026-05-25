"""
火山引擎豆包语音识别 - 录音文件识别脚本
用于识别课堂录音等长音频文件

使用前提：
1. 安装依赖: pip install requests
2. 配置环境变量或在代码中设置凭证
"""

import os
import json
import time
import uuid
import requests
from pathlib import Path

# ============== 配置区域 ==============
# 音频文件路径
AUDIO_FILE_PATH = "data/kt4ys.mp3"

# 火山引擎凭证
# 方式1: 设置环境变量
# 方式2: 直接在下面填写

# 旧版认证: App ID + Access Token
APP_ID = os.getenv("VOLC_APP_ID", "7019546525")
ACCESS_TOKEN = os.getenv("VOLC_ACCESS_TOKEN", "cRDU2zgz_1dle6kDMNKKfQ6-p5rN3jMU")

# API版本选择
# - "v1": 标准版 (volc.bigasr) - 旧版服务
# - "v3": 大模型版 (volc.seedasr.auc) - 新版服务
API_VERSION = os.getenv("VOLC_API_VERSION", "v3")

# 资源ID和集群根据API版本自动设置
RESOURCE_ID = os.getenv("VOLC_RESOURCE_ID", "volc.bigasr.auc")  # 大模型版
CLUSTER = os.getenv("VOLC_CLUSTER", "volc.bigasr")  # 火山引擎大模型服务集群

# 识别参数
ENABLE_ITN = True           # 逆文本归一化（数字、日期等转换）
ENABLE_PUNC = True          # 标点符号
ENABLE_SPEAKER_INFO = True  # 说话人分离
LANGUAGE_HINTS = "zh"       # 语言提示: zh(中文), en(英文), ja(日语), auto(自动检测)
# ======================================


def get_file_url(file_path: str) -> str:
    """
    获取音频文件的公网可访问URL

    火山引擎ASR只支持公网可访问的URL，不支持本地文件直传。
    需要先将音频上传到可访问的存储服务（如自己的服务器、OSS等）。

    这里提供几种方案：
    1. 如果本地有公网服务器，可以直接放在服务器上
    2. 使用阿里云OSS、腾讯云COS等云存储
    3. 使用ngrok等工具创建临时公网访问
    """
    file_path = Path(file_path).resolve()

    # 检查文件是否存在
    if not file_path.exists():
        raise FileNotFoundError(f"音频文件不存在: {file_path}")

    print(f"本地文件: {file_path}")
    print("\n[WARNING] 重要提示:")
    print("  火山引擎ASR只支持公网可访问的URL，不支持本地文件。")
    print("  请选择以下方案之一:")
    print("  1. 将音频上传到云存储(OSS/COS等)，获取公网URL")
    print("  2. 部署到有公网IP的服务器")
    print("  3. 使用ngrok等内网穿透工具")
    print()

    # 返回本地文件路径（仅用于演示，实际调用需要替换为公网URL）
    return str(file_path)


def get_resource_id():
    """获取资源ID (使用Demo中的值)"""
    return "volc.bigasr.auc"


def get_api_url(action: str) -> str:
    """获取API URL (使用Demo中的域名)"""
    return f"https://openspeech-direct.zijieapi.com/api/v3/auc/bigmodel/{action}"


def submit_recognition_task(audio_url: str) -> tuple:
    """提交语音识别任务"""
    url = get_api_url("submit")

    request_id = str(uuid.uuid4())
    resource_id = get_resource_id()

    headers = {
        "Content-Type": "application/json",
        "X-Api-App-Key": APP_ID,
        "X-Api-Access-Key": ACCESS_TOKEN,
        "X-Api-Resource-Id": resource_id,
        "X-Api-Request-Id": request_id,
        "X-Api-Sequence": "-1",
    }

    body = {
        "user": {"uid": "fake_uid"},
        "audio": {"url": audio_url},
        "request": {
            "model_name": "bigmodel",
            "enable_itn": ENABLE_ITN,
            "enable_punc": ENABLE_PUNC,
            "enable_speaker_info": ENABLE_SPEAKER_INFO,
            "enable_ddc": True,
            # enable_channel_split 默认为 False，不显式配置
            # 如需声道分离，设置为 True
            "corpus": {"correct_table_name": "", "context": ""}
        }
    }

    print(f"提交识别任务...")
    print(f"  请求ID: {request_id}")
    print(f"  资源ID: {resource_id}")
    print(f"  音频URL: {audio_url}")

    response = requests.post(url, data=json.dumps(body), headers=headers, timeout=30)

    if 'X-Api-Status-Code' in response.headers and response.headers["X-Api-Status-Code"] == "20000000":
        print(f"[OK] 任务提交成功")
        x_tt_logid = response.headers.get("X-Tt-Logid", "")
        print(f"  X-Tt-Logid: {x_tt_logid}")
        return request_id, x_tt_logid
    else:
        print(f"[X] 提交失败: {response.headers}")
        return None, None


def query_recognition_result(request_id: str, x_tt_logid: str) -> dict:
    """查询识别结果"""
    url = get_api_url("query")

    headers = {
        "Content-Type": "application/json",
        "X-Api-App-Key": APP_ID,
        "X-Api-Access-Key": ACCESS_TOKEN,
        "X-Api-Resource-Id": get_resource_id(),
        "X-Api-Request-Id": request_id,
        "X-Tt-Logid": x_tt_logid,
    }

    response = requests.post(url, data=json.dumps({}), headers=headers, timeout=30)
    
    code = response.headers.get('X-Api-Status-Code', "")
    msg = response.headers.get('X-Api-Message', "")
    print(f"  查询响应: code={code}, msg={msg}")
    
    return response


def wait_for_completion(request_id: str, x_tt_logid: str, max_wait_seconds: int = 3600) -> dict:
    """轮询等待识别任务完成"""
    print(f"\n等待识别完成...")

    start_time = time.time()
    last_status = None

    while True:
        elapsed = time.time() - start_time
        if elapsed > max_wait_seconds:
            print(f"[X] 等待超时({max_wait_seconds}秒)")
            return None

        response = query_recognition_result(request_id, x_tt_logid)

        code = response.headers.get('X-Api-Status-Code', "")

        if code == '20000000':  # 任务完成
            print(f"\n[OK] 识别完成!")
            return response.json()
        elif code == '20000001':
            status = "排队中"
        elif code == '20000002':
            status = "处理中"
        else:
            status = f"状态码: {code}"

        if status != last_status:
            print(f"  [{elapsed:.0f}s] {status}...")
            last_status = status

        time.sleep(2)


def parse_and_save_result(result: dict, output_path: str):
    """
    解析识别结果并保存到本地文件

    返回结果结构:
    {
        "result": {
            "text": "完整文本",
            "utterances": [
                {
                    "text": "句子文本",
                    "start_time": 1500,   # 毫秒
                    "end_time": 3000,     # 毫秒
                    "speaker": "1",       # 说话人ID
                    "words": [
                        {
                            "text": "词",
                            "start_time": 1500,
                            "end_time": 1600
                        }
                    ]
                }
            ]
        }
    }
    """
    print(f"\n保存结果到: {output_path}")

    # 提取识别结果 (v1和v3版本格式不同)
    recognition_result = result.get("result", {})
    # v1版本可能在不同的字段
    if not recognition_result:
        recognition_result = result

    # v1版本: {"text": "...", " utterances": [...]}
    # v3版本: {"result": {"text": "...", "utterances": [...]}}
    output_data = {
        "text": recognition_result.get("text", ""),
        "utterances": recognition_result.get("utterances", []),
    }

    # 保存为JSON
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"[OK] 已保存")

    # 打印统计信息
    utterances = output_data.get("utterances", [])
    total_chars = len(output_data.get("text", ""))

    print(f"\n[INFO] 识别统计:")
    print(f"  - 总字数: {total_chars}")
    print(f"  - 句子数: {len(utterances)}")

    if utterances:
        # 计算总时长
        if utterances[-1].get("end_time"):
            total_duration = utterances[-1]["end_time"] / 1000  # 转为秒
            print(f"  - 总时长: {total_duration:.1f}秒")
            if total_duration > 0:
                speed = total_chars / (total_duration / 60)
                print(f"  - 平均语速: {speed:.1f}字/分钟")

        # 说话人统计
        speakers = set()
        for utt in utterances:
            if utt.get("speaker"):
                speakers.add(utt["speaker"])

        if speakers:
            print(f"  - 说话人数: {len(speakers)} (ID: {', '.join(sorted(speakers))})")


def run_recognition(audio_file: str, audio_url: str = None):
    """运行完整的语音识别流程"""
    print("=" * 50)
    print("火山引擎豆包语音识别 - 录音文件识别")
    print("=" * 50)

    # 检查凭证
    if not APP_ID or not ACCESS_TOKEN:
        print("\n[X] 错误: 未配置凭证！")
        print("\n请设置以下环境变量:")
        print("  VOLC_APP_ID       - 应用ID")
        print("  VOLC_ACCESS_TOKEN - 访问令牌")
        print("\n或在脚本中直接修改配置区域")
        return

    # 获取音频URL
    if not audio_url:
        print("\n[WARNING] 注意: 火山引擎ASR需要公网可访问的音频URL")
        audio_url = input("请输入音频的公网URL: ").strip()

    if not audio_url:
        print("已跳过")
        return

    # 提交任务
    request_id, x_tt_logid = submit_recognition_task(audio_url)

    if not request_id:
        return

    # 等待完成
    result = wait_for_completion(request_id, x_tt_logid)

    if not result:
        print("[X] 识别失败或超时")
        return

    # 保存结果
    output_file = Path(audio_file).stem + "_asr_result.json"
    output_path = Path("data") / output_file
    output_path.parent.mkdir(parents=True, exist_ok=True)

    parse_and_save_result(result, str(output_path))

    print("\n" + "=" * 50)
    print("识别完成！")
    print("=" * 50)


def quick_test():
    """快速测试凭证是否正确配置"""
    print("快速测试凭证配置...")

    if not API_KEY and (not APP_ID or not ACCESS_TOKEN):
        print("[X] 凭证未配置")
        return False

    # 尝试提交一个空任务来测试凭证（会失败但可以看到错误信息）
    url = get_api_url("submit")

    headers = {
        "Content-Type": "application/json",
        "X-Api-Resource-Id": get_resource_id(),
        "X-Api-Request-Id": "test-" + os.urandom(8).hex(),
    }

    # 新版认证
    if API_KEY:
        headers["X-Api-Key"] = API_KEY
    else:
        headers["X-Api-App-Key"] = APP_ID
        headers["X-Api-Access-Key"] = ACCESS_TOKEN

    # v1和v3版本的请求体格式不同
    if API_VERSION == "v3":
        body = {
            "appid": APP_ID,
            "cluster": CLUSTER,
            "audio_url": "https://example.com/test.mp3",
        }
    else:
        body = {
            "app": {
                "appid": APP_ID,
                "token": ACCESS_TOKEN,
                "cluster": CLUSTER,
            },
            "user": {"uid": "0"},
            "audio": {
                "url": "https://example.com/test.mp3",
                "format": "mp3",
            },
        }

    response = requests.post(url, headers=headers, json=body, timeout=30)

    if response.status_code == 200:
        print("[OK] 凭证验证通过")
        return True
    else:
        print(f"[X] 凭证验证失败: {response.status_code}")
        try:
            print(f"   响应: {response.json()}")
        except:
            print(f"   响应: {response.text}")
        return False


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="火山引擎语音识别")
    parser.add_argument("--file", "-f", default=AUDIO_FILE_PATH, help="音频文件路径")
    parser.add_argument("--url", "-u", help="音频的公网URL（直接指定则跳过输入）")

    args = parser.parse_args()

    run_recognition(args.file, args.url)
