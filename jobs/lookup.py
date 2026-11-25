"""People lookup (CrossLinked approach via Serper search API) and DeepSeek email drafting."""
import os
import re
from urllib.parse import urlparse

import requests
from unidecode import unidecode

JOB_BOARDS = ("indeed.", "linkedin.", "glassdoor.", "google.", "ziprecruiter.", "bayt.", "naukri.")
PATTERNS = ["{first}.{last}", "{first}", "{f}{last}", "{first}{last}", "{first}_{last}", "{f}.{last}"]


def company_domain(*urls):
    """First company website among the URLs, minus www. Skips job-board links."""
    for u in urls:
        if not isinstance(u, str) or not u.startswith("http"):
            continue
        host = urlparse(u).netloc.lower().removeprefix("www.")
        if host and not any(b in host for b in JOB_BOARDS):
            return host
    return ""


def parse_linkedin_result(title, link):
    """'Jane Doe - Talent Acquisition - Acme | LinkedIn' -> {name, title, url}. Same split CrossLinked uses."""
    if "linkedin.com/in/" not in (link or ""):
        return None
    text = unidecode(title).split("|")[0].split("...")[0]
    parts = [p.strip() for p in text.split(" - ")]
    name = re.sub(r",.*", "", parts[0]).strip()  # drop ", SHRM-CP" style suffixes
    name = re.sub(r"(\s+(CPA|MBA|PhD|MSc|BSc|SHRM-[A-Z]+|PHR|SPHR|CHRP|PMP|CFA|ACCA|S\.\w{1,4}\.?))+$", "", name)
    if not name or len(name.split()) > 5:
        return None
    return {"name": name, "title": parts[1] if len(parts) > 1 else "", "linkedin": link}


def email_guess(name, pattern, domain):
    words = [w for w in re.sub(r"[^a-z ]", "", unidecode(name).lower()).split() if w]
    if not words or not domain:
        return ""
    first, last = words[0], words[-1]
    local = pattern.format(first=first, last=last, f=first[0], l=last[0])
    return f"{local}@{domain}"


def find_people(company, keywords, location=""):
    """Google search (via Serper) for LinkedIn profiles at the company matching the keywords."""
    key = os.environ.get("SERPER_API_KEY")
    if not key:
        raise RuntimeError("SERPER_API_KEY is not set")
    q = f'site:linkedin.com/in "{company}" ({keywords}) {location}'.strip()
    r = requests.post("https://google.serper.dev/search", timeout=30,
                      headers={"X-API-KEY": key}, json={"q": q})  # ponytail: free tier rejects "num", so 10 results max
    r.raise_for_status()
    people, seen = [], set()
    for item in r.json().get("organic", []):
        p = parse_linkedin_result(item.get("title", ""), item.get("link", ""))
        if p and p["name"].lower() not in seen:
            seen.add(p["name"].lower())
            people.append(p)
    return people


def draft_email(cv_text, job, recipient_name, recipient_title):
    key = os.environ.get("DEEPSEEK_API_KEY")
    if not key:
        raise RuntimeError("DEEPSEEK_API_KEY is not set")
    prompt = f"""Write a short, warm, professional email from a job seeker to {recipient_name or 'the hiring team'}
({recipient_title or 'recruiter'}) at {job['company']} about the "{job['title']}" role.
Use specific, true facts from the CV that match the job. Do not invent anything not in the CV.
Max 150 words. Write in the same language as the job posting. End with the sender's name from the CV.
First line must be "Subject: ...", then a blank line, then the body.

JOB DESCRIPTION:
{(job.get('description') or 'not available')[:6000]}

CV:
{cv_text[:12000]}"""
    r = requests.post("https://api.deepseek.com/chat/completions", timeout=120,
                      headers={"Authorization": f"Bearer {key}"},
                      json={"model": "deepseek-chat", "messages": [{"role": "user", "content": prompt}]})
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"].strip()
    m = re.match(r"Subject:\s*(.+)\n+", text)
    return (m.group(1).strip(), text[m.end():].strip()) if m else ("", text)
