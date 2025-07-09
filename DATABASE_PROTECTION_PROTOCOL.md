# Database Protection Protocol

## CRITICAL: Content Database Protection Rules

### ABSOLUTE PROHIBITIONS
1. **NEVER** use `DELETE FROM` statements on content tables without explicit user approval
2. **NEVER** use `DROP TABLE` statements on any content tables
3. **NEVER** use `TRUNCATE` statements on content tables
4. **NEVER** suggest "clearing" or "resetting" content data as a solution

### Protected Tables (Require Explicit User Permission)
- `content_days`
- `content_lessons` 
- `content_set_up_questions`
- `content_quizzes`
- `content_dive_deeper`
- `content_metadata`
- `users` (user accounts)
- `user_quiz_answers` (user progress)
- `wallet_earnings` (user earnings)

### Safe Operations (No Permission Required)
- `SELECT` queries for reading data
- `INSERT` statements for adding new content
- `UPDATE` statements for modifying existing content
- Creating backup/export queries

### Required Process for Data Modifications
1. **Always backup first**: Create export queries before any destructive operations
2. **Ask permission explicitly**: "I need to modify/delete content in table X. Should I proceed?"
3. **Show the query**: Display exactly what will be executed
4. **Wait for approval**: Never proceed without explicit user "yes"

### Emergency Recovery
- All content tables have proper foreign key relationships
- Content can be restored from this file's documentation
- Week 1 curriculum (Days 1-7) is fully documented in replit.md changelog

### Violation Consequences
If this protocol is violated:
1. Immediately stop all database operations
2. Create full database backup
3. Document what was lost
4. Request user guidance for recovery

## User Trust Commitment
This protocol ensures the content database remains intact and the learning platform maintains its educational value. User progress and content are sacred - they represent real learning journeys and must be protected at all costs.