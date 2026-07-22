"""
Naim CRM MCP Server
Exposes CRM operations as MCP tools for Hermes Agent.
"""

import os
import json
from datetime import datetime
from dotenv import load_dotenv
from fastmcp import FastMCP
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
mcp = FastMCP("Naim CRM", instructions="Tools for managing the Naim Investments Recruitment CRM system.")

# ============================================================
# CANDIDATE TOOLS
# ============================================================

@mcp.tool()
def list_candidates(
    search: str = "",
    stage: str = "",
    country: str = "",
    limit: int = 20,
    offset: int = 0,
) -> str:
    """List and search candidates. Filter by stage, country, or search by name/email/phone."""
    query = supabase.table("candidates").select("*").is("deleted_at", "null")

    if search:
        query = query.or(
            f"name.ilike.%{search}%,email.ilike.%{search}%,phone.ilike.%{search}%,passport_number.ilike.%{search}%"
        )
    if stage:
        query = query.eq("stage", stage)
    if country:
        query = query.eq("country_applying_to", country)

    result = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    candidates = result.data

    if not candidates:
        return "No candidates found."

    lines = [f"Found {len(candidates)} candidate(s):"]
    for c in candidates:
        lines.append(
            f"- [{c['id'][:8]}] {c['name']} | Stage: {c['stage']} | "
            f"Phone: {c.get('phone', 'N/A')} | Country: {c.get('country_applying_to', 'N/A')}"
        )
    return "\n".join(lines)


@mcp.tool()
def get_candidate(candidate_id: str) -> str:
    """Get full details of a candidate by ID."""
    result = supabase.table("candidates").select("*").eq("id", candidate_id).single().execute()
    c = result.data
    if not c:
        return "Candidate not found."

    lines = [
        f"Name: {c['name']}",
        f"Email: {c.get('email', 'N/A')}",
        f"Phone: {c.get('phone', 'N/A')}",
        f"Stage: {c['stage']}",
        f"Job Title: {c.get('job_title', 'N/A')}",
        f"Salary: {c.get('salary', 'N/A')} {c.get('currency', '')}",
        f"Country Applying To: {c.get('country_applying_to', 'N/A')}",
        f"Passport: {c.get('passport_number', 'N/A')}",
        f"Nationality: {c.get('nationality', 'N/A')}",
        f"Gender: {c.get('gender', 'N/A')}",
        f"Education: {c.get('education_level', 'N/A')}",
        f"Created: {c.get('created_at', 'N/A')}",
    ]
    return "\n".join(lines)


@mcp.tool()
def add_candidate(
    name: str,
    phone: str = "",
    email: str = "",
    stage: str = "New",
    job_title: str = "",
    country_applying_to: str = "",
    passport_number: str = "",
    nationality: str = "",
    notes: str = "",
) -> str:
    """Add a new candidate to the CRM."""
    data = {
        "name": name,
        "phone": phone,
        "email": email,
        "stage": stage,
        "job_title": job_title,
        "country_applying_to": country_applying_to,
        "passport_number": passport_number,
        "nationality": nationality,
        "notes": notes,
    }
    result = supabase.table("candidates").insert(data).execute()
    candidate = result.data[0] if result.data else None
    if candidate:
        return f"Candidate added successfully! ID: {candidate['id']}, Name: {candidate['name']}"
    return "Failed to add candidate."


@mcp.tool()
def update_candidate(candidate_id: str, updates: str) -> str:
    """Update a candidate. Pass updates as a JSON string, e.g. '{"stage": "Interview", "notes": "Rescheduled"}'."""
    try:
        update_data = json.loads(updates)
    except json.JSONDecodeError:
        return "Invalid JSON. Provide updates as a JSON string, e.g. " + '{"stage": "Interview"}'

    update_data["updated_at"] = datetime.utcnow().isoformat()
    result = supabase.table("candidates").update(update_data).eq("id", candidate_id).execute()
    if result.data:
        return f"Candidate {candidate_id[:8]} updated: {json.dumps(update_data, indent=2)}"
    return "Failed to update candidate."


@mcp.tool()
def move_candidate_stage(candidate_id: str, new_stage: str) -> str:
    """Move a candidate to a new recruitment stage."""
    valid_stages = [
        "New", "Source", "Screening", "Interview", "Assessment", "Shortlist",
        "Offer", "Contract Signing", "Visa Processing", "Onboarding",
        "Placed", "Completed", "Rejected", "Withdrawn", "Pending", "Draft",
    ]
    if new_stage not in valid_stages:
        return f"Invalid stage. Valid stages: {', '.join(valid_stages)}"

    result = supabase.table("candidates").update(
        {"stage": new_stage, "updated_at": datetime.utcnow().isoformat()}
    ).eq("id", candidate_id).execute()

    if result.data:
        c = result.data[0]
        return f"Candidate '{c['name']}' moved to stage: {new_stage}"
    return "Failed to update candidate stage."


@mcp.tool()
def delete_candidate(candidate_id: str) -> str:
    """Soft-delete a candidate (moves to recycle bin)."""
    result = supabase.table("candidates").update(
        {"deleted_at": datetime.utcnow().isoformat()}
    ).eq("id", candidate_id).execute()
    if result.data:
        return f"Candidate {candidate_id[:8]} moved to recycle bin."
    return "Failed to delete candidate."


@mcp.tool()
def get_candidate_stats() -> str:
    """Get candidate statistics: count by stage, total count, etc."""
    all_result = supabase.table("candidates").select("stage").is("deleted_at", "null").execute()
    candidates = all_result.data

    if not candidates:
        return "No candidates in the system."

    stage_counts = {}
    for c in candidates:
        s = c.get("stage", "Unknown")
        stage_counts[s] = stage_counts.get(s, 0) + 1

    lines = [f"Total Candidates: {len(candidates)}", "", "By Stage:"]
    for stage, count in sorted(stage_counts.items(), key=lambda x: -x[1]):
        lines.append(f"  {stage}: {count}")
    return "\n".join(lines)


# ============================================================
# JOB TOOLS
# ============================================================

@mcp.tool()
def list_jobs(
    search: str = "",
    status: str = "",
    limit: int = 20,
) -> str:
    """List jobs. Filter by status (Active/Draft/Closed) or search by title."""
    query = supabase.table("jobs").select("*").is("deleted_at", "null")
    if search:
        query = query.or(f"title.ilike.%{search}%,description.ilike.%{search}%")
    if status:
        query = query.eq("status", status)

    result = query.order("created_at", desc=True).limit(limit).execute()
    jobs = result.data

    if not jobs:
        return "No jobs found."

    lines = [f"Found {len(jobs)} job(s):"]
    for j in jobs:
        lines.append(
            f"- [{j['id'][:8]}] {j['title']} | Country: {j.get('country', 'N/A')} | "
            f"Salary: {j.get('salary_min', 'N/A')}-{j.get('salary_max', 'N/A')} | Status: {j['status']}"
        )
    return "\n".join(lines)


@mcp.tool()
def add_job(
    title: str,
    country: str = "",
    salary_min: str = "",
    salary_max: str = "",
    currency: str = "KWD",
    description: str = "",
    requirements: str = "",
) -> str:
    """Create a new job posting."""
    data = {
        "title": title,
        "country": country,
        "salary_min": float(salary_min) if salary_min else None,
        "salary_max": float(salary_max) if salary_max else None,
        "currency": currency,
        "description": description,
        "requirements": requirements,
        "status": "Active",
    }
    result = supabase.table("jobs").insert(data).execute()
    if result.data:
        j = result.data[0]
        return f"Job created! ID: {j['id'][:8]}, Title: {j['title']}"
    return "Failed to create job."


@mcp.tool()
def update_job(job_id: str, updates: str) -> str:
    """Update a job. Pass updates as JSON, e.g. '{"status": "Closed"}'."""
    try:
        update_data = json.loads(updates)
    except json.JSONDecodeError:
        return "Invalid JSON."

    update_data["updated_at"] = datetime.utcnow().isoformat()
    result = supabase.table("jobs").update(update_data).eq("id", job_id).execute()
    if result.data:
        return f"Job {job_id[:8]} updated."
    return "Failed to update job."


# ============================================================
# APPOINTMENT TOOLS
# ============================================================

@mcp.tool()
def list_appointments(status: str = "", limit: int = 20) -> str:
    """List upcoming appointments."""
    query = supabase.table("appointments").select("*, candidates(name)")
    if status:
        query = query.eq("status", status)
    result = query.order("date", desc=False).limit(limit).execute()
    appts = result.data

    if not appts:
        return "No appointments found."

    lines = [f"Found {len(appts)} appointment(s):"]
    for a in appts:
        cand = a.get("candidates", {})
        cand_name = cand.get("name", "N/A") if cand else "N/A"
        lines.append(
            f"- [{a['id'][:8]}] {a['title']} | Candidate: {cand_name} | "
            f"Date: {a['date']} {a.get('time', '')} | Status: {a['status']}"
        )
    return "\n".join(lines)


@mcp.tool()
def schedule_appointment(
    title: str,
    date: str,
    time: str = "",
    candidate_id: str = "",
    appointment_type: str = "Interview",
    notes: str = "",
) -> str:
    """Schedule a new appointment. Date format: YYYY-MM-DD."""
    data = {
        "title": title,
        "date": date,
        "time": time or None,
        "candidate_id": candidate_id or None,
        "type": appointment_type,
        "status": "Scheduled",
        "notes": notes,
    }
    result = supabase.table("appointments").insert(data).execute()
    if result.data:
        a = result.data[0]
        return f"Appointment scheduled! ID: {a['id'][:8]}, Title: {a['title']}, Date: {a['date']} {a.get('time', '')}"
    return "Failed to schedule appointment."


# ============================================================
# TASK TOOLS
# ============================================================

@mcp.tool()
def list_tasks(status: str = "", limit: int = 20) -> str:
    """List tasks. Filter by status (Pending/In Progress/Completed/Overdue)."""
    query = supabase.table("tasks").select("*")
    if status:
        query = query.eq("status", status)
    result = query.order("due_date", desc=False).limit(limit).execute()
    tasks = result.data

    if not tasks:
        return "No tasks found."

    lines = [f"Found {len(tasks)} task(s):"]
    for t in tasks:
        lines.append(
            f"- [{t['id'][:8]}] {t['title']} | Priority: {t['priority']} | "
            f"Status: {t['status']} | Due: {t.get('due_date', 'N/A')}"
        )
    return "\n".join(lines)


@mcp.tool()
def add_task(
    title: str,
    description: str = "",
    priority: str = "Medium",
    due_date: str = "",
) -> str:
    """Create a new task. Priority: Low/Medium/High/Urgent."""
    data = {
        "title": title,
        "description": description,
        "status": "Pending",
        "priority": priority,
        "due_date": due_date or None,
    }
    result = supabase.table("tasks").insert(data).execute()
    if result.data:
        t = result.data[0]
        return f"Task created! ID: {t['id'][:8]}, Title: {t['title']}"
    return "Failed to create task."


@mcp.tool()
def update_task(task_id: str, updates: str) -> str:
    """Update a task. Pass updates as JSON, e.g. '{"status": "Completed"}'."""
    try:
        update_data = json.loads(updates)
    except json.JSONDecodeError:
        return "Invalid JSON."

    update_data["updated_at"] = datetime.utcnow().isoformat()
    result = supabase.table("tasks").update(update_data).eq("id", task_id).execute()
    if result.data:
        return f"Task {task_id[:8]} updated."
    return "Failed to update task."


# ============================================================
# REPORTING TOOLS
# ============================================================

@mcp.tool()
def get_dashboard_stats() -> str:
    """Get dashboard statistics: total candidates, active jobs, pending tasks, placements."""
    candidates = supabase.table("candidates").select("stage").is("deleted_at", "null").execute().data
    jobs = supabase.table("jobs").select("id").eq("status", "Active").is("deleted_at", "null").execute().data
    tasks = supabase.table("tasks").select("status").execute().data
    placed = supabase.table("candidates").select("id").eq("stage", "Placed").is("deleted_at", "null").execute().data

    pending_tasks = sum(1 for t in tasks if t["status"] in ("Pending", "In Progress"))

    lines = [
        "=== Naim CRM Dashboard ===",
        f"Total Candidates: {len(candidates)}",
        f"Active Jobs: {len(jobs)}",
        f"Pending Tasks: {pending_tasks}",
        f"Candidates Placed: {len(placed)}",
        "",
        "Stage Breakdown:",
    ]
    stage_counts = {}
    for c in candidates:
        s = c.get("stage", "Unknown")
        stage_counts[s] = stage_counts.get(s, 0) + 1
    for stage, count in sorted(stage_counts.items(), key=lambda x: -x[1]):
        lines.append(f"  {stage}: {count}")

    return "\n".join(lines)


@mcp.tool()
def get_candidates_by_country() -> str:
    """Get candidate count grouped by destination country."""
    result = supabase.table("candidates").select("country_applying_to").is("deleted_at", "null").execute()
    candidates = result.data

    if not candidates:
        return "No candidates found."

    country_counts = {}
    for c in candidates:
        country = c.get("country_applying_to") or "Unknown"
        country_counts[country] = country_counts.get(country, 0) + 1

    lines = ["Candidates by Country:"]
    for country, count in sorted(country_counts.items(), key=lambda x: -x[1]):
        lines.append(f"  {country}: {count}")
    return "\n".join(lines)


if __name__ == "__main__":
    mcp.run(transport="stdio")
