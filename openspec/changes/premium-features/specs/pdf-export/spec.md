## ADDED Requirements

### Requirement: PDF Report Generation
The system SHALL generate a downloadable PDF report for a given audit ID via GET /api/audit/[id]/pdf. The PDF SHALL contain: branded header with "AuditPro Report", platform and username, generation date, health score, dimension grade table, and suggestion list.

#### Scenario: Valid audit ID
- **WHEN** GET /api/audit/{id}/pdf is called with a valid audit ID
- **THEN** return a response with Content-Type "application/pdf" and Content-Disposition attachment header with filename "auditpro-{platform}-{username}.pdf"

#### Scenario: Invalid audit ID
- **WHEN** GET /api/audit/{id}/pdf is called with a non-existent ID
- **THEN** return 404 with error "Report not found"

#### Scenario: PDF content structure
- **WHEN** a PDF is generated for an audit with healthScore=72, 6 dimension grades, and 3 suggestions
- **THEN** the PDF contains: teal "AuditPro Report" header, platform/username line, date line, large health score number, a table with 6 rows (one per dimension) showing name/score/grade, and 3 bullet-pointed suggestions

### Requirement: Download Button UI
The system SHALL render a DownloadButton component that shows a functional download link for PRO+ users and a disabled locked state for FREE users.

#### Scenario: PRO user sees download button
- **WHEN** DownloadButton renders with userPlan="PRO" and a valid auditId
- **THEN** display a teal "Download PDF" link pointing to /api/audit/{auditId}/pdf with download icon

#### Scenario: FREE user sees locked button
- **WHEN** DownloadButton renders with userPlan="FREE"
- **THEN** display a disabled gray button with lock icon and text "Download PDF — Pro"

#### Scenario: No auditId available
- **WHEN** DownloadButton would render but auditId is undefined
- **THEN** the button is not rendered at all
