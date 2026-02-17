# agents/WORKFLOW.md
# GLOBAL WORKFLOW - State Machine, Dispatch, Loops

## Purpose
This document describes a workflow driven by an Orchestrator. It is a state machine with gates and repair loops.

## State Machine
INTAKE -> DESIGN -> PLAN -> IMPLEMENT_LOOP -> INTEGRATE -> RELEASE -> DONE

### INTAKE
Agent: SpecAgent
Produces: spec.md, acceptance.json
Gate: both files exist and have testable ACs

### DESIGN
Agent: Architect
Produces: architecture.md, adr/ADR-001.md (if needed)
Gate: architecture consistent with spec, risks recorded

### PLAN
Agent: Planner
Produces: tasks.yaml
Gate: tasks have dependencies, acceptance_checks and done_when

### IMPLEMENT_LOOP
For each task ready (deps done):
- Coder implements
- Reviewer reviews
- QA tests (if the task concerns behavior/logic or acceptance)
- Security (if risk_flags contains security or affects auth/input/network)
Gate per task:
- Reviewer OK
- QA OK (if required)
- Security OK (if required)
- Task marked completed in status.json

### INTEGRATE
Agent: Integrator
Purpose: green build, conflicts, full pipeline
Gate: CI/build green OR if no CI, local commands from acceptance_checks pass

### RELEASE
Agents:
- Docs updates README/report
- Integrator finalizes release artifacts (tag/release notes if applicable)
Gate: README current, report.md ready, all ACs met

### DONE
Orchestrator final report in report.md and status.json current_state=DONE

## Repair loops
- If Reviewer BLOCKED -> FIX_REVIEW -> Coder updates -> back to Reviewer
- If QA BLOCKED -> FIX_TESTS -> Coder/QA updates -> back to QA
- If Security BLOCKED -> FIX_SECURITY -> Coder updates -> back to Security
- If build/CI red -> FIX_BUILD -> Integrator/Coder -> back to INTEGRATE

## Dispatch rules (must)
Orchestrator MUST use all agents at least once in a full run:
- SpecAgent, Architect, Planner, Coder, Reviewer, QA, Security, Integrator, Docs
Exception: Security can be "OK no findings," but must be run.

## Definition of Done (global)
DONE only if:
- All criteria from acceptance.json are met
- status.json is up-to-date and current_state=DONE
- report.md contains: what was done, how to run, how to test, known issues