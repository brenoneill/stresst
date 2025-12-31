import { generateText } from "ai";

/** Stress level configuration */
type StressLevel = "low" | "medium" | "high";

interface StressConfig {
  bugCountMin: number;
  bugCountMax: number;
  subtlety: string;
  description: string;
}

const STRESS_CONFIGS: Record<StressLevel, StressConfig> = {
  low: {
    bugCountMin: 1,
    bugCountMax: 2,
    subtlety: "relatively obvious",
    description: "The bugs should be somewhat noticeable - things like obvious operator mistakes, clear logic inversions, or simple typos in variable names. A junior developer should be able to spot them with careful review. Keep the code structure simple and don't add extra abstraction layers.",
  },
  medium: {
    bugCountMin: 2,
    bugCountMax: 3,
    subtlety: "subtle but findable",
    description: "The bugs should require careful code review to find - off-by-one errors, missing awaits that cause Promise objects to be used as values, edge case failures. A mid-level developer should need to trace through the logic to find them. You SHOULD add 1-2 'data layer' helper functions that data passes through before being used - mimicking technical debt where someone added abstraction layers 'for future flexibility'. The bug can be hidden in these intermediate functions. All bugs must be deterministic and reproducible.",
  },
  high: {
    bugCountMin: 2,
    bugCountMax: 3,
    subtlety: "deviously subtle",
    description: "The bugs should be very hard to find but ALWAYS reproducible - subtle state mutations, edge cases with specific inputs, cascading errors where one bug masks another. Even senior developers should need debugging tools and careful analysis. You MUST add multiple 'data layer' functions that pipe data through 2-4 transformation steps before it reaches its destination - realistic 'legacy code' technical debt where data flows through normalizers, formatters, validators, mappers, etc. Hide bugs deep in these pipelines where a developer must trace the entire data flow to find them. This should mimic real legacy codebases with accumulated abstractions. IMPORTANT: All bugs must be 100% deterministic - no race conditions or timing-dependent issues.",
  },
};

/**
 * Custom error class for AI stress generation failures.
 */
export class AIStressError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "AIStressError";
  }
}

/**
 * Uses AI to introduce subtle but nasty breaking changes to code.
 * The changes should be realistic bugs that require debugging skills to find and fix.
 * 
 * Requires ANTHROPIC_API_KEY environment variable to be set.
 * 
 * @param content - Original file content
 * @param filename - Name of the file
 * @param context - Optional context about what specific areas to focus bugs on (max 200 chars)
 * @param stressLevel - Stress level: "low", "medium", or "high"
 * @param targetBugCount - Optional specific number of bugs to introduce (overrides stress level bug count)
 * @returns Modified content with AI-generated breaking changes, descriptions, and user-facing symptoms
 * @throws AIStressError if AI is unavailable or fails to generate bugs
 */
export async function introduceAIStress(
  content: string,
  filename: string,
  context?: string,
  stressLevel: StressLevel = "medium",
  targetBugCount?: number
): Promise<{ content: string; changes: string[]; symptoms: string[] }> {
  // Dynamic import to handle optional dependency
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let anthropic: any;
  try {
    const anthropicModule = await import("@ai-sdk/anthropic");
    anthropic = anthropicModule.anthropic;
  } catch (error) {
    throw new AIStressError(
      "AI SDK not available. Please ensure @ai-sdk/anthropic is installed and ANTHROPIC_API_KEY is set.",
      error
    );
  }

  const config = STRESS_CONFIGS[stressLevel];

  // Generate a random seed to encourage variety
  const randomSeed = Math.random().toString(36).substring(2, 15);
  // Use targetBugCount if provided, otherwise calculate from stress level config
  const bugCount = targetBugCount !== undefined 
    ? targetBugCount 
    : Math.floor(Math.random() * (config.bugCountMax - config.bugCountMin + 1)) + config.bugCountMin;
  
  // Build optional focus area instruction
  const focusInstruction = context 
    ? `\n\nFOCUS AREA: The user wants to specifically test: "${context}"\nPrioritize bugs related to this focus area when possible, but still be unpredictable.`
    : "";
  
  const prompt = `You are a stress engineer tasked with introducing ${config.subtlety} breaking bugs into code.
  
STRESS LEVEL: ${stressLevel.toUpperCase()}
${config.description}

CRITICAL VARIETY REQUIREMENT - READ THIS FIRST:
You MUST use COMPLETELY DIFFERENT bug types for each bug. If you introduce ${bugCount} bugs, they MUST be ${bugCount} DIFFERENT bug categories/patterns. 

FORBIDDEN: Repeating the same bug pattern (e.g., multiple .slice() bugs, multiple property name typos, etc.)
REQUIRED: Each bug must use a DIFFERENT mechanism/approach. Mix string bugs, array bugs, object bugs, logic bugs, calculation bugs, etc.

The random seed ${randomSeed} should influence which bug types you choose - use it to ensure variety across different runs.

${focusInstruction}

CRITICAL - DO NOT REVEAL BUG LOCATIONS:
- Do NOT add comments near bugs like "// bug here" or "// TODO: fix this"
- Do NOT add comments that hint at what was changed
- Do NOT make the bugs obvious through naming or comments
- You MAY add realistic developer comments (like normal code would have), but these must NOT reveal the bug location
- The goal is for the developer to FIND the bugs through debugging, not through reading comments

THE SCENARIO - A careless developer:
This is for a learning game. Imagine the code was written by a careless, sloppy developer who:
- Never writes tests or double-checks their work
- Copies and pastes code without understanding it
- Makes "quick fixes" that break other things
- Over-engineers simple solutions
- Leaves half-finished refactors
- Doesn't handle edge cases
- Gets confused by their own code
- Makes typos and doesn't proofread

The bugs can be somewhat over-the-top - this is a game after all! Just keep a small thread of plausibility.
Think: "a bad developer COULD have done this" rather than "a good developer might accidentally do this"

Your goal is to make changes that:
1. Will cause the code to fail or behave incorrectly
2. Could plausibly be written by a careless/incompetent developer
3. Match the ${stressLevel} stress level described above
4. Are NOT obvious syntax errors that an IDE would immediately catch
5. Are MAXIMALLY VARIED - if introducing ${bugCount} bugs, use ${bugCount} COMPLETELY DIFFERENT bug types. NO REPEATS.
6. You MAY add NEW code (helper functions, utilities) that introduces bugs - not just modify existing code
7. Do NOT leave any hints in comments about where bugs are located
8. Can be over-the-top but should still have a thread of "someone could have written this"
9. ACTIVELY AVOID common patterns like .slice(1), .slice(0, -2), property name typos - use these SPARINGLY and only if no other bug type fits

CRITICAL - BUGS MUST BE DETERMINISTIC:
- Every bug MUST reproduce 100% of the time under the same conditions
- NO race conditions, timing-dependent bugs, or intermittent failures
- NO bugs that "sometimes" happen or depend on execution speed
- The bug should fail the SAME way every time the code runs with the same input
- Users need to be able to reliably reproduce and debug the issue

Random seed for this session: ${randomSeed}
Number of bugs to introduce: ${bugCount} (stress level: ${stressLevel})

FINAL VARIETY CHECKLIST - Before submitting, verify:
✓ Each of the ${bugCount} bugs uses a DIFFERENT bug category/mechanism
✓ You have NOT repeated the same pattern (e.g., multiple .slice() bugs)
✓ You have mixed different types (string bugs, array bugs, object bugs, calculation bugs, etc.)
✓ If you must use similar patterns, they are in COMPLETELY different contexts with different effects

CRITICAL: Bugs MUST be HIGH-IMPACT and CLEARLY VISIBLE. The user should immediately notice something is wrong when they use the app. Avoid subtle operator changes that don't affect behavior.

Choose ${bugCount} bugs RANDOMLY from this list - YOU MUST PICK ${bugCount} DIFFERENT CATEGORIES. Do NOT pick multiple bugs from the same category unless absolutely necessary:

=== HIGHEST PRIORITY: DATA VISIBILITY BUGS (pick from these first!) ===
These bugs cause OBVIOUS, VISIBLE problems that users notice immediately:

STRING/TEXT CORRUPTION (use MAX 1 per file):
- Reverse string order (split('').reverse().join(''))
- Uppercase/lowercase entire strings when they should be mixed case
- Replace all spaces with another character or remove all spaces
- Insert extra characters in the middle of strings
- Swap adjacent characters in strings
- Apply wrong encoding/decoding (e.g., encodeURIComponent when shouldn't)
- Use wrong string method (replace() when should use replaceAll(), or vice versa)
- String interpolation with wrong variable or missing variable
- Concatenate strings in wrong order or with wrong separator
- Truncate strings at wrong position (not just start/end - use middle positions too)

DATA DISAPPEARING (use MAX 1 per file):
- Array slice that removes items from middle (slice(0, n) + slice(n+2) instead of slice(0, n+2))
- Filter that removes items based on wrong condition (e.g., filter(item => item.id !== item.id) - always false)
- Splice that removes wrong number of items or from wrong index
- Shift/pop/unshift/push used incorrectly (removing when should add, or vice versa)
- FlatMap that flattens too much or not enough
- Reduce that returns wrong accumulator or initial value
- Find/findIndex that uses wrong comparison
- Some/every that uses inverted logic
- Condition that hides items based on wrong property comparison
- Return empty array/undefined/null for certain conditions
- Destructuring that extracts wrong properties or wrong number of properties

ALL ITEMS SHOW SAME VALUE (use MAX 1 per file):
- Set all IDs/values to first item's value (using items[0].id for all items)
- Use loop variable incorrectly (i never increments, or uses wrong variable)
- Cache value outside loop and reuse for all iterations
- Map that returns same object/array reference for all items
- Spread operator used incorrectly (spreading single item instead of array)
- Object.assign or {...obj} that overwrites with same source
- Default parameter that's shared across all calls
- Closure that captures wrong variable value

DATA SHOWING AS UNDEFINED/NULL (use MAX 1 per file):
- Access property with typo (item.nme instead of item.name) - USE SPARINGLY
- Destructure with wrong property names or missing properties
- Return undefined/null instead of actual data
- Delete property before it's used (delete obj.prop before accessing it)
- Access nested property without checking intermediate objects exist
- Optional chaining removed when it's needed (?.) or added when it's not
- Nullish coalescing used incorrectly (?? when should use ||, or vice versa)
- Type assertion that's wrong (as string when it's number)
- Property access on wrong object (this.prop when should be otherObj.prop)

PROPERTY DELETION/NULL POINTER (use MAX 1 per file):
- Delete property before accessing it
- Set property to null/undefined before use
- Reassign object to {} or null before accessing
- Clear array before iterating (length = 0, or splice(0))
- Overwrite function parameter before using it
- Mutate object in place when should create new object
- Shallow copy when should deep copy (or vice versa)
- Object.freeze() or Object.seal() used incorrectly

=== SECONDARY: OTHER IMPACTFUL BUGS ===

CALCULATION/DISPLAY BUGS (use MAX 1 per file):
- Off-by-one errors (length - 1 when should be length, or vice versa)
- Wrong array length calculation (length + 1, length - 2, etc.)
- Math operations wrong (multiply when should divide, add when should subtract)
- Price/total calculations wrong (off by fixed amount, wrong percentage)
- Date calculations wrong (add/subtract wrong number of days/hours)
- Counter starts at wrong number or increments/decrements wrong
- Modulo used incorrectly (% when shouldn't, or wrong modulo)
- Rounding errors (Math.floor when should Math.ceil, or vice versa)
- Comparison operators wrong (< when should be >, <= when should be >=)
- Min/max calculations reversed (Math.min when should Math.max)

RENDERING BUGS (use MAX 1 per file):
- Conditional rendering inverted (!condition when should be condition)
- Wrong index in list (using i+1, i-1, or wrong index variable)
- Map returns null/undefined for wrong items
- Filter with always-false/always-true condition
- Sort comparison function wrong (a - b when should be b - a, or wrong property)
- Reverse array when shouldn't (or don't reverse when should)
- Unique filter that doesn't work (wrong comparison in Set or filter)
- Grouping/partitioning logic wrong
- Pagination logic wrong (page size, offset calculations)

FORM/INPUT BUGS (use MAX 1 per file):
- Input value truncated or corrupted (slice, substring, etc.)
- Input handler clears field or resets to wrong value
- Form submission sends wrong field values or missing fields
- Validation logic inverted (rejects valid, accepts invalid)
- Input sanitization too aggressive or missing
- Event handler attached to wrong element or wrong event type
- Debounce/throttle applied incorrectly
- Input type wrong (text when should be number, etc.)
- Default value wrong or missing

=== LOWER PRIORITY: SUBTLE BUGS (use sparingly, MAX 1 per file) ===
Only use these if you've already added high-impact bugs or the code doesn't support visible bugs:

ASYNC/PROMISE BUGS:
- Missing await causing [object Promise] or undefined in UI
- Promise.all when should use Promise.allSettled (or vice versa)
- Wrong error handling in try/catch
- Async function not awaited
- Race condition in async code (though must still be deterministic)

LOGIC BUGS:
- Wrong comparison operators (< vs >, <= vs >=, == vs ===)
- Boolean logic inverted (!condition when should be condition)
- Ternary operator wrong (condition ? wrong : right)
- Short-circuit evaluation wrong (&& when should ||, or vice versa)
- Switch statement missing break or wrong case

TYPE COERCION:
- String + number when should be number + number
- Type coercion causing NaN or wrong values
- parseInt/parseFloat with wrong radix or on wrong value
- toString() called on wrong value or at wrong time

AVOID THESE - THEY RARELY HAVE VISIBLE IMPACT:
- Simple operator swaps that don't affect output (+ to - in non-displayed calculations)
- Changes to error handling that only affect edge cases
- Changes to logging or debugging code
- Changes to comments or type annotations
- Micro-optimizations or performance-only bugs

=== TECHNICAL DEBT / DATA LAYER COMPLEXITY (MEDIUM/HIGH STRESS ONLY) ===
For MEDIUM and HIGH stress levels, simulate legacy codebase technical debt by adding "data layer" functions that data must pass through. This makes bugs MUCH harder to trace because developers must follow the data flow through multiple transformations.

FOR MEDIUM STRESS - Add 1-2 intermediate functions:
- Add a "normalizer" function that transforms data before it's used
- Add a "formatter" that prepares data for display
- Add a "validator" that checks and potentially modifies data
- The bug should be in one of these intermediate functions, not the main code

Example pattern for MEDIUM:
\`\`\`
// Added "for consistency" by a previous developer
function normalizeUserData(user) {
  return {
    ...user,
    name: user.name.slice(1), // BUG: cuts off first character
    id: user.id
  };
}

// Original code now pipes through the normalizer
const displayUser = normalizeUserData(rawUser);
\`\`\`

FOR HIGH STRESS - Add 2-4 chained transformation functions (data pipeline):
- Create a pipeline where data flows: raw → validate → normalize → format → transform → display
- Each function should look "reasonable" but one contains the bug
- Add realistic-looking comments like "// TODO: refactor this" or "// Legacy - do not remove"
- The functions should have plausible names that suggest they serve a purpose

Example pattern for HIGH:
\`\`\`
// Data processing pipeline (added during Q3 refactor)
const processItems = (items) => {
  return items
    .map(validateItem)
    .map(normalizeItem)
    .filter(isValidItem)
    .map(formatForDisplay);
};

function validateItem(item) { /* looks fine */ return item; }
function normalizeItem(item) { 
  // Standardize IDs across system
  const baseId = items[0]?.id || item.id; // BUG: uses first item's ID for ALL items
  return { ...item, id: baseId };
}
function isValidItem(item) { return item.status !== 'deleted'; }
function formatForDisplay(item) { /* looks fine */ return item; }
\`\`\`

The goal is to make the developer trace through multiple functions to find where the data gets corrupted. This mimics real-world debugging of legacy systems with accumulated technical debt.

Here is the code to modify:

FILENAME: ${filename}
\`\`\`
${content}
\`\`\`

Respond with ONLY a JSON object in this exact format (no markdown, no explanation):
{
  "modifiedCode": "the complete modified code with bugs introduced",
  "changes": ["technical description of bug 1", "technical description of bug 2"],
  "symptoms": ["Detailed bug report 1", "Detailed bug report 2"]
}

IMPORTANT about "symptoms": These should be written like DETAILED bug reports from a QA tester or team member. Each symptom should be a mini bug report that gives enough context to reproduce and investigate the issue. Include:
- What action was being performed
- What was expected to happen
- What actually happened instead
- Any relevant context (e.g., specific data, conditions, or state)

Format each symptom as: "[Action/Context]: [What went wrong]. Expected [X] but got [Y]."

Examples of GOOD detailed symptoms (HIGHLY VISIBLE bugs):
- "In the search bar: The first letter of my search is being cut off. I typed 'Apple' but it searches for 'pple'. Every search term loses its first character."
- "On the product list page: The last 2 items are completely missing. We have 10 products but only 8 show up. Scrolling to the end, items 9 and 10 are nowhere to be found."
- "In the user cards: Every single card shows the same user ID (#1001). All 50 users display 'ID: 1001' even though they should each have unique IDs."
- "On the dashboard: All the user names are showing as 'undefined'. The email and avatar load fine but where the name should be it just says 'undefined'."
- "After loading the orders page: App crashes with white screen. Something about 'Cannot read property of null'. Looks like order data is being deleted before it's displayed."
- "In the item list: Half the items are completely blank. Items 1, 3, 5, 7 show correctly but items 2, 4, 6, 8 are empty cards with no content."
- "On the pricing page: All prices show $0.00. We have items ranging from $10-$500 but every single one displays as $0.00."
- "In the data table: The 'Status' column shows the wrong status for every row. Items marked 'Active' in the database show as 'Inactive' and vice versa."
- "When viewing comments: Every comment shows the exact same text - the first comment's text is repeated for all 20 comments."
- "On the counter display: It shows '3 items' but there are clearly 5 items visible on screen. The count is always 2 less than the actual number."

Do NOT mention specific variable names, function names, or line numbers. Describe from a tester's perspective who can see the UI and behavior but not the code.

IMPORTANT: Symptoms must describe REPRODUCIBLE issues - bugs that happen every single time under the described conditions. Do NOT write symptoms like "sometimes works" or "intermittently fails". The bug should be 100% reproducible.

The modifiedCode must be the COMPLETE file content with your bugs inserted. Do not truncate or summarize.
You CAN add new functions, helpers, or code - not just modify existing code. If you add a helper function, make sure to actually USE it somewhere in the existing code so the bug manifests.`;

  try {
    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt,
    });

    // Parse the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new AIStressError("Failed to parse AI response - no JSON found in output");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.modifiedCode || !parsed.changes) {
      throw new AIStressError("Invalid AI response structure - missing modifiedCode or changes");
    }

    return {
      content: parsed.modifiedCode,
      changes: parsed.changes,
      symptoms: parsed.symptoms || generateFallbackSymptoms(parsed.changes),
    };
  } catch (error) {
    if (error instanceof AIStressError) {
      throw error;
    }
    throw new AIStressError(
      "AI stress generation failed. Please check your API key and try again.",
      error
    );
  }
}

/**
 * Generates detailed bug report descriptions from technical change descriptions.
 * Used as a fallback when AI doesn't provide symptoms.
 * 
 * @param changes - Array of technical change descriptions
 * @returns Array of detailed bug report descriptions
 */
function generateFallbackSymptoms(changes: string[]): string[] {
  const symptomTemplates = [
    "On the main list page: The last 2 items are completely missing. We have 10 items but only 8 show up on screen.",
    "In the search bar: The first letter of every search is being cut off. Typing 'Apple' searches for 'pple' instead.",
    "On the cards/list view: Every single item shows the same ID number. All 50 items display 'ID: 1001' even though they should be unique.",
    "In the user profile section: All names are showing as 'undefined'. The other fields load fine but names are blank.",
    "After loading the page: App crashes with white screen. Console shows 'Cannot read property of null' error.",
    "On the dashboard: All totals and prices show $0.00. We have items worth hundreds of dollars but everything displays as zero.",
    "In the item grid: Half the items are completely blank. Every other card (items 2, 4, 6, 8...) shows as empty.",
    "When viewing the list: Items that should be visible are hidden, and hidden items are showing. The display logic is completely inverted.",
    "On the counter display: Shows '3 items' but there are clearly 5 items on screen. The count is always 2 less than actual.",
    "In the text fields: The last few characters are cut off from every label. 'Description' shows as 'Descript', 'Username' shows as 'Userna'.",
  ];
  
  // Pick random symptoms based on number of changes
  const numSymptoms = Math.min(changes.length, 3);
  shuffleArray(symptomTemplates);
  return symptomTemplates.slice(0, numSymptoms);
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm.
 * 
 * @param array - Array to shuffle
 * @returns The shuffled array (same reference)
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
