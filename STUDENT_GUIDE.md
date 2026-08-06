# QA Ticket Board (Sprint 1)

Welcome to your new team. Unfortunately, the MVP was rushed and QA has reported several critical issues in production. 
Your job is to investigate, isolate the root cause, and fix the following bugs.

## 🐛 TICKET-001: Task List Pagination Duplication
**Reporter:** QA Team
**Description:** "When I go to the Tasks page and sort by 'Status', I noticed that some tasks appear on Page 1, but when I click 'Next' to go to Page 2, the exact same tasks show up again! And some tasks are missing completely."

## 🐛 TICKET-002: Security Data Leak on Logout
**Reporter:** Security Audit
**Description:** "I logged out of my admin account on a shared computer. Then I logged into a guest account. For a split second before I refreshed the page, I saw all the Admin's tasks on the dashboard! We are leaking data."

## 🐛 TICKET-003: Browser Freezing over time
**Reporter:** Customer Success
**Description:** "Customers who leave the app open all day say their laptops get incredibly hot and the app slows down to a crawl. The console is full of 'Warning: Can't perform a React state update on an unmounted component'."

## 🐛 TICKET-004: Duplicate Tasks on Slow Network
**Reporter:** QA Team
**Description:** "If I simulate a 'Slow 3G' connection in Chrome DevTools and click the 'Create Task' button 5 times quickly, it literally creates 5 identical tasks in the database."

## 🐛 TICKET-005: 500 Server Error on Login
**Reporter:** Sentry Error Logs
**Description:** "If a user accidentally deletes the '@' symbol in their email when logging in, the entire backend crashes with a 500 Internal Server Error instead of just telling them it's an invalid email."
