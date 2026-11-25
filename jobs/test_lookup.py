from lookup import company_domain, email_guess, parse_linkedin_result

p = parse_linkedin_result("Jane Doe, SHRM-CP - Talent Acquisition Lead - Manulife | LinkedIn",
                          "https://id.linkedin.com/in/janedoe")
assert p == {"name": "Jane Doe", "title": "Talent Acquisition Lead", "linkedin": "https://id.linkedin.com/in/janedoe"}, p
assert parse_linkedin_result("Michael Shelsen CPA - VP - Manulife | LinkedIn", "https://linkedin.com/in/m")["name"] == "Michael Shelsen"
assert parse_linkedin_result("Wening Anggun Sari - HR | LinkedIn", "https://linkedin.com/in/w")["name"] == "Wening Anggun Sari"
assert parse_linkedin_result("Budi Santoso S.Kom - HR | LinkedIn", "https://linkedin.com/in/b")["name"] == "Budi Santoso"
assert parse_linkedin_result("I KADEK AGUS DWI SAPUTRA - HR | LinkedIn", "https://linkedin.com/in/k")["name"] == "I KADEK AGUS DWI SAPUTRA"
assert parse_linkedin_result("Manulife Indonesia | LinkedIn", "https://linkedin.com/company/manulife") is None

assert email_guess("Jane Marie Doe", "{first}.{last}", "acme.co.id") == "jane.doe@acme.co.id"
assert email_guess("Jane Doe", "{f}{last}", "acme.com") == "jdoe@acme.com"
assert email_guess("Jane Doe", "{first}", "") == ""

assert company_domain(None, "https://id.indeed.com/cmp/x", "https://www.manulife.co.id/about") == "manulife.co.id"
assert company_domain("https://www.linkedin.com/company/x") == ""
print("ok")
