# QA Ticket Board (Sprint 1)

Welcome to your new team. Unfortunately, the MVP was rushed and QA has reported several critical issues in production. 
Your job is to investigate, isolate the root cause, and fix the following bugs.

## 🐛 TICKET-001: Task List Pagination Duplication
**Reporter:** QA Team
**Description:** "When I go to the Tasks page and sort by 'Status', I noticed that some tasks appear on Page 1, but when I click 'Next' to go to Page 2, the exact same tasks show up again! And some tasks are missing completely."
**Root Cause & Fix:** MongoDB lacks a deterministic sort order when sorting by non-unique fields (like `status`). This causes identical records to shuffle positions across pages. Fixed by appending a unique tie-breaker (`_id`) to the Mongoose sort query.

