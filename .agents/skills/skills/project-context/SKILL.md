---
name: project-context
description: Maintain a "project context.md" file at the project root to preserve architectural history, tech stack details, and current progress across AI-agent sessions. Use this skill to initialize and update the context file after every significant milestone or architectural decision.
---

# Project Context Maintenance Skill

This skill ensures that project knowledge is preserved in a human-readable and agent-parsable "project context.md" file. This file acts as a persistent memory anchor for future conversations and development cycles.

## 1. Trigger Conditions

- After creating a new project.
- After making significant architectural decisions (e.g., changing state management, adding new libraries).
- After completing a major feature or milestone.
- When the user explicitly requests to "update context" or "remember our conversation".

## 2. File Structure: "project context.md"

The file MUST be located at the root of the project and should follow this structure:

- **1. Core Technology Stack**: List all frameworks, libraries, and tools used (e.g., React, Redux, Tailwind, Zod).
- **2. Architectural Patterns**: Describe project-specific patterns (e.g., Folder-per-component, Atomic Design).
- **3. Global Infrastructure**: Detail any centralized utilities (e.g., `test-utils.tsx`, `validation.ts`).
- **4. Current State & Routing**: summarize the current feature set and routing logic (e.g., AuthLayout vs RootLayout).
- **5. Strict Policies**: Document any project-wide rules (e.g., "Zero `any` policy", "Mandatory test coverage").
- **6. Recent Significant Updates**: A bulleted list of the most recent changes made in the current session.

## 3. Implementation Process

1. **Initialize**: If the file doesn't exist, create it with the structure above.
2. **Scan**: Read the existing file before updating to ensure continuity.
3. **Draft**: Update the sections based on the latest development session.
4. **Timestamp**: Always update the "Last Updated" field at the bottom of the file.

## 4. Best Practices

- **Conciseness**: Keep descriptions brief but technically accurate.
- **Agent Parsability**: Use standard Markdown headers and lists to make it easy for future agents to grep and understand.
- **Explicit Decisions**: Don't just list features; document the _why_ behind architectural choices.
