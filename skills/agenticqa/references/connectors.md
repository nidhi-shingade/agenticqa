# Connectors

AgenticQA reads from four systems. Each connector should be configured with the least privilege that works, and every connector used by this skill is read-only.

## Jira

- Purpose: read ticket fields, acceptance criteria, attachments, and linked issues.
- Access: read-only API token or OAuth scope held by the tester. Do not grant write scopes.
- Setup: configure the Atlassian MCP server for the organization's Jira Cloud site. Store the credential in the team's secret store, not in the repo.

## Azure DevOps

- Purpose: read work items (Test Case, Bug, User Story) and their acceptance criteria, reproduction steps, and attachments.
- Access: Entra ID sign-in with a read-only role on the project, or a PAT limited to Work Items (Read). Do not use Full access.
- Setup: configure the Azure DevOps MCP server for the organization URL. Set the default project in the connector config.

## GitHub

- Purpose: create the isolated branch, read the base branch, and open no pull requests from this skill.
- Access: `gh` CLI signed in with the tester's account, or a fine-grained token limited to the repository with Contents (read and write, for the QA branch only) and no merge permission.
- Setup: `gh auth status` must show the correct account before Step 0 runs.

## Dynatrace

- Purpose: read application error rates, JavaScript exceptions, failed requests, and page-load timings for the environment under test.
- Access: an API token with read scopes only (for example `metrics.read`, `logs.read`, `problems.read`, and `environment.read`, adjusted to what the team uses). Do not use tokens with settings-write or ingest scopes.
- Setup: configure the Dynatrace MCP server with the tenant URL and token from the vault. Confirm the tenant is the non-production environment before querying.
- Data handling: query aggregates by default. Do not export raw user sessions or request payloads into the report.

## Verifying the setup

Before the first run, confirm each connector returns one ticket, one branch listing, and one Dynatrace metric. If any connector fails, record it in the report under "Not verified and why" and continue with the rest of the pipeline.
