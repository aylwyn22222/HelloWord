#!/usr/bin/env python3
"""Generate a weekly AI science-pop article and save to articles/.

Schedule target: every Tuesday 16:10 Beijing Time (08:10 UTC).
"""

from __future__ import annotations

import datetime as dt
import os
from pathlib import Path

try:
    from openai import OpenAI
except Exception as exc:  # dependency/environment fallback
    raise SystemExit(f"openai package missing: {exc}")

ROOT = Path(__file__).resolve().parents[1]
ARTICLES = ROOT / "articles"
ARTICLES.mkdir(parents=True, exist_ok=True)


def beijing_today() -> dt.date:
    utc_now = dt.datetime.now(dt.timezone.utc)
    bj_now = utc_now + dt.timedelta(hours=8)
    return bj_now.date()


def build_prompt(today: dt.date) -> str:
    return f"""
你是一名资深AI产业观察作者。请写一篇约2000字中文公众号文章，要求：
1) 领域：AI行业。
2) 主题：过去一周的热点趋势，自拟标题与角度。
3) 参考来源范围：36氪AI频道、钛媒体、虎嗅、机器之心、新智元、AIbase、arXiv、Awesome AI Agents Live、智源社区、斯坦福AI Index等。
4) 风格：观点鲜明、金句突出、结构清晰、可读性强。
5) 输出格式：Markdown。
6) 日期基准：{today.isoformat()}（北京时间）。

文末必须附“参考信息源”小节（列出来源平台，不要求逐条超链接）。
""".strip()


def main() -> None:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("OPENAI_API_KEY is not set")

    today = beijing_today()
    client = OpenAI(api_key=api_key)
    prompt = build_prompt(today)

    resp = client.responses.create(
        model=os.getenv("OPENAI_MODEL", "gpt-5"),
        input=prompt,
    )

    text = resp.output_text.strip()
    out = ARTICLES / f"{today.isoformat()}-ai-industry-weekly.md"
    out.write_text(text + "\n", encoding="utf-8")
    print(f"generated: {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
