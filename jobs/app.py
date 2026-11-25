import hmac
import os
from urllib.parse import quote

import pandas as pd
import streamlit as st
from jobspy import scrape_jobs
from pypdf import PdfReader

from lookup import PATTERNS, company_domain, draft_email, email_guess, find_people

st.set_page_config(page_title="Job Search", page_icon="🔎", layout="wide")

# --- login: whole app is behind APP_PASSWORD (it spends your API credits) ---
password = os.environ.get("APP_PASSWORD")
if password and not st.session_state.get("authed"):
    st.title("🔒 Job Search")
    pw = st.text_input("Password", type="password")
    if pw and hmac.compare_digest(pw, password):
        st.session_state["authed"] = True
        st.rerun()
    elif pw:
        st.error("Wrong password")
    st.stop()

st.title("🔎 Job Search")

with st.sidebar:
    st.header("Your CV")
    cv = st.file_uploader("Upload CV (PDF or TXT)", type=["pdf", "txt"])
    if cv and st.session_state.get("cv_name") != cv.name:
        text = ("\n".join(p.extract_text() or "" for p in PdfReader(cv).pages)
                if cv.name.lower().endswith(".pdf") else cv.read().decode("utf-8", "ignore"))
        st.session_state.update(cv_text=text, cv_name=cv.name)
    if st.session_state.get("cv_text"):
        st.caption(f"✅ {st.session_state['cv_name']} loaded ({len(st.session_state['cv_text'])} chars)")
        if not st.session_state["cv_text"].strip():
            st.warning("No text found in this PDF (scanned image?). Upload a text PDF or .txt.")

    st.header("Search")
    search_term = st.text_input("Job title / keywords", "software engineer")
    location = st.text_input("Location", "Jakarta, Indonesia")
    country = st.text_input("Country (for Indeed/Glassdoor)", "Indonesia")
    sites = st.multiselect(
        "Sites",
        ["indeed", "linkedin", "google", "glassdoor", "zip_recruiter", "bayt", "naukri"],
        default=["indeed", "linkedin", "google"],
    )
    results_wanted = st.slider("Results per site", 5, 100, 20, step=5)
    hours_old = st.number_input("Posted within (hours, 0 = any)", 0, 720, 72, step=24)
    job_type = st.selectbox("Job type", ["any", "fulltime", "parttime", "internship", "contract"])
    is_remote = st.checkbox("Remote only")
    linkedin_desc = st.checkbox("Fetch LinkedIn descriptions (slower, more emails)")
    proxies = st.text_input("Proxies (optional, comma-separated user:pass@host:port)")
    run = st.button("Search", type="primary", use_container_width=True)

if run:
    if not search_term.strip() or not sites:
        st.error("Enter a job title and pick at least one site.")
        st.stop()
    with st.spinner("Scraping job boards… this can take a minute"):
        try:
            jobs = scrape_jobs(
                site_name=sites,
                search_term=search_term,
                google_search_term=f"{search_term} jobs near {location}",
                location=location or None,
                country_indeed=country or "usa",
                results_wanted=results_wanted,
                hours_old=hours_old or None,
                job_type=None if job_type == "any" else job_type,
                is_remote=is_remote,
                linkedin_fetch_description=linkedin_desc,
                proxies=[p.strip() for p in proxies.split(",") if p.strip()] or None,
            )
        except Exception as e:  # sites block / bad country name etc. — show it, don't crash
            st.error(f"Search failed: {e}")
            st.stop()
    st.session_state["jobs"] = jobs.reset_index(drop=True)
    st.session_state.pop("people", None)

jobs = st.session_state.get("jobs")
if jobs is None:
    st.info("Upload your CV, set your search on the left and press **Search**.")
    st.stop()
if jobs.empty:
    st.warning("No jobs found. Try fewer filters, other sites, or add proxies if a site is blocking you.")
    st.stop()

DEFAULT_ROLES = '"talent acquisition" OR recruiter OR HR OR "hiring manager"'


def clean(v):
    return None if not isinstance(v, (list, dict)) and pd.isna(v) else v


def lookup(company, keywords):
    with st.spinner(f"Searching LinkedIn for people at {company}…"):
        try:
            st.session_state["people"] = ((company, keywords), find_people(company, keywords))
        except Exception as e:
            st.error(f"Lookup failed: {e}")


st.success(f"Found {len(jobs)} jobs — click a row to find people to email")
cols = [c for c in ["site", "title", "company", "emails", "location", "date_posted",
                    "job_type", "is_remote", "min_amount", "max_amount", "currency", "job_url"]
        if c in jobs.columns]
picked = st.dataframe(
    jobs[cols],
    use_container_width=True,
    hide_index=True,
    on_select="rerun",
    selection_mode="single-row",
    column_config={"job_url": st.column_config.LinkColumn("Link", display_text="Open")},
)
rows = picked.selection.rows
i = rows[0] if rows else None
st.download_button("Download CSV", jobs.to_csv(index=False), "jobs.csv", "text/csv")

if i is None:
    st.stop()

job = {k: clean(v) for k, v in jobs.iloc[i].to_dict().items()}
st.divider()
st.subheader(f"📧 {job['title']} — {job['company']}")

# --- recipients: emails in the posting + people found on LinkedIn ---
recipients = [{"name": "", "title": "From job posting", "email": e.strip(), "linkedin": ""}
              for e in str(job.get("emails") or "").split(",") if e.strip()]

c1, c2, c3 = st.columns([2, 2, 1])
company = c1.text_input("Company name to search", job["company"] or "", key=f"company_{i}")
domain = c2.text_input("Company email domain",
                       company_domain(job.get("company_url_direct"), job.get("company_url")),
                       placeholder="e.g. manulife.co.id", key=f"domain_{i}")
pattern = c3.selectbox("Email pattern", PATTERNS)
keywords = st.text_input("Roles to look for", DEFAULT_ROLES, key=f"roles_{i}")

key = (company, keywords)
if st.button("Find people at this company"):
    lookup(company, keywords)

found_key, people = st.session_state.get("people", (None, []))
if found_key == key and people:
    recipients += [{**p, "email": email_guess(p["name"], pattern, domain)} for p in people]
elif found_key == key:
    st.info("No LinkedIn profiles found. Try a shorter company name or broader roles.")

if not recipients:
    st.caption("No emails in this posting. Click **Find people** to look up recruiters on LinkedIn.")
    st.stop()

st.dataframe(pd.DataFrame(recipients), hide_index=True, use_container_width=True,
             column_config={"linkedin": st.column_config.LinkColumn("LinkedIn", display_text="Profile")})
if people and found_key == key:
    st.caption("⚠️ LinkedIn emails are **guesses** from the pattern above — not verified. "
               "Check the company's real pattern (e.g. on Hunter.io) before sending.")

# --- draft ---
labels = [f"{r['name'] or r['email']} — {r['title']} <{r['email'] or 'no email'}>" for r in recipients]
who = recipients[st.selectbox("Draft an email to", range(len(recipients)), format_func=lambda i: labels[i])]

if st.button("✍️ Draft email with AI", type="primary"):
    if not st.session_state.get("cv_text", "").strip():
        st.error("Upload your CV in the sidebar first.")
    else:
        with st.spinner("Drafting…"):
            try:
                st.session_state["subject"], st.session_state["body"] = draft_email(
                    st.session_state["cv_text"], job, who["name"], who["title"])
            except Exception as e:
                st.error(f"Drafting failed: {e}")

if "body" in st.session_state:
    to = st.text_input("To", who["email"])
    subject = st.text_input("Subject", key="subject")
    body = st.text_area("Body", key="body", height=300)
    # ponytail: opens your own mail app, nothing is sent from here; auto-send comes later
    st.link_button("Open in my mail app",
                   f"mailto:{quote(to)}?subject={quote(subject)}&body={quote(body)}")
