---
name: skill-creator
description: Create new skills, modify and improve existing skills, and measure skill performance for the Antigravity agent system. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, or optimize a skill's description for better triggering accuracy.
---

# Skill Creator

A skill for creating new Antigravity skills and iteratively improving them.

At a high level, the process of creating a skill goes like this:

- Decide what you want the skill to do and roughly how it should do it.
- **Always check the Knowledge Items (KIs) summaries first** to see if relevant skills or architectural patterns already exist before designing from scratch.
- Write a draft of the skill.
- Create a few test prompts and run the agent with access to the skill on them.
- Help the user evaluate the results both qualitatively and quantitatively.
  - While runs process in the background, draft quantitative evals if there aren't any. Explain them to the user.
  - Generate an artifact (e.g., `eval_results.md`) using **Carousels** to show the user the qualitative results sequentially, along with quantitative metrics, and use the `notify_user` tool with `PathsToReview` to collect their feedback.
- Rewrite the skill based on the user's feedback (and any glaring flaws from quantitative benchmarks).
- Repeat until you're satisfied.
- Expand the test set and try again at a larger scale.

Your job when using this skill is to figure out where the user is in this process and help them progress. For instance, if they say "I want to make a skill for X", help narrow down what they mean, write a draft, write the test cases, figure out how they want to evaluate, run all the prompts, and repeat. Use the `task_boundary` tool effectively (with modes like `PLANNING`, `EXECUTION`, `VERIFICATION`) to clearly communicate progress.

If the user already has a draft, you can go straight to the eval/iterate part of the loop. Always be flexible based on user cues.

## Communicating with the user

Pay attention to context cues to understand how to phrase your communication. The skill creator might be used by a wide variety of users. Use `notify_user` strategically — keep notifications concise and focus on decisions that require the user's expertise or preference. Batch independent questions into a single `notify_user` call to minimize interruptions.

---

## Creating a skill

### Capture Intent

Start by understanding the user's intent:

1. What should this skill enable the agent to do?
2. When should this skill trigger? (what user phrases/contexts)
3. What is the expected output format?
4. Should we set up test cases? (Recommend test cases for objectively verifiable outputs like file transforms, code generation, etc. Subjective outputs may not need them.)

### Interview and Research

Proactively ask questions about edge cases, formats, examples, and success criteria. Wait to write test prompts until this is ironed out. **Check your available KI summaries** and file system to research available tools or similar patterns to reduce the burden on the user.

### Write the SKILL.md

Based on the interview, fill in:

- **name**: Skill identifier (used in YAML frontmatter)
- **description**: When to trigger, what it does. This determines when the agent will invoke the skill. Be slightly "pushy" in the description so it triggers reliably when needed. For instance, instead of "How to build a dashboard", write "How to build a dashboard. Make sure to use this skill whenever the user mentions dashboards, data visualization, or wants to display company data."
- **compatibility**: Required tools, dependencies (optional).
- **the rest of the skill**

### Skill Writing Guide

#### Anatomy of a Skill

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/    - Executable code for deterministic/repetitive tasks
    ├── references/ - Docs to load into context
    └── assets/     - Files used in output
```

**Key patterns:**

- Keep `SKILL.md` under 500 lines. If larger, use clear pointers to reference files.
- Remember that Antigravity agents use specific tools (like `write_to_file`, `grep_search`, `multi_replace_file_content`). Your skill should instruct the model on the _best practices_ for using these tools if relevant.
- Emphasize the principle of least surprise. No malicious payloads or destructive scripts without explicit warnings.

### Test Cases

After writing the draft, generate 2-3 realistic test prompts. Save these to `evals/evals.json` without assertions first.

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's task prompt",
      "expected_output": "Description of expected result",
      "files": []
    }
  ]
}
```

## Running and evaluating test cases

Put results in a `<skill-name>-workspace/` directory sibling to the skill directory. Organize by iteration (`iteration-1/`, `iteration-2/`).

### Step 1: Spawn eval tasks

For each test case, execute the task utilizing the newly drafted skill. You can run baselines (without the skill) to compare. Create `eval_metadata.json` for each case.

### Step 2: Draft assertions

Draft quantitative assertions for each test case. Good assertions are objectively verifiable. Update `eval_metadata.json` and `evals/evals.json`.

### Step 3: Grade and compile evaluation artifact

Use a script or an inline assessment to grade each run based on your assertions. Save results to `grading.json`.

Once graded, **generate an evaluation artifact** (`eval_results.md` inside the Antigravity artifact directory) to present the results to the user.

**Use Antigravity Carousels** in this artifact to display multiple related outputs sequentially! This is critical for keeping the document clean and easy to review.

Example format for `eval_results.md`:

````markdown
# Evaluation Results: Iteration 1

## Benchmark Stats

- **Pass Rate**: 2/3 (66%)
- **Average Time**: 15s

## Qualitative Review

Please review the generated outputs below.

`` ` `carousel
![Output 1](/absolute/path/to/eval-1/output.png)

<!-- slide -->

```python
# Output 2 code
```
````

<!-- slide -->

![Output 3](/absolute/path/to/eval-3/output.png)
`` ` `

```
*(Note: use 4 backticks for carousels)*

### Step 4: Request user review
Use the `notify_user` tool with `PathsToReview` pointing to your newly created `eval_results.md` artifact. Set `BlockedOnUser: true` to halt and ask for their feedback on the evaluation.

Tell the user: "I've compiled the evaluation results into an artifact. Please review the Carousel for the qualitative outputs and the Benchmark stats, then let me know your feedback."

### Step 5: Read feedback and iterate
When the user replies with feedback, focus improvements on cases where they had specific complaints.

---

## Improving the skill

- Generalize from feedback. Don't overfit to the test cases.
- Explain the **why** behind instructions in the skill so the underlying LLM understands the goal.
- Look for repeated work: If the agent constantly writes the same helper script across test cases, extract that into a reusable script in `scripts/` and tell the skill to use it.

Run the iteration loop (apply improvements -> rerun tests -> generate new `eval_results.md` carousel -> `notify_user`) until the user is satisfied.

---

## Description Optimization

To optimize the `description` for triggering:
1. Generate a JSON file of 20 realistic eval queries (mix of `should_trigger` and `not_trigger`). Create a mix of formal, casual, ambiguous, and near-miss phrasings.
2. Present this JSON to the user using `notify_user` (and an artifact) for quick review.
3. Use an evaluation loop to test the triggering rate of the current description against the queries. Propose new descriptions based on what failed, test again, and pick the best one.
4. Update `SKILL.md` frontmatter with the winning description.
```
