# How to Use SwiftHerb Skills

## Quick Start

1. **Choose a Skill**: Browse the available skills in this folder
2. **Read the Skill File**: Understand the role, competencies, and templates
3. **Use with AI**: Copy templates and use with ChatGPT, Claude, or DeepSeek
4. **Research**: Use web search to find real-world examples
5. **Iterate**: Refine suggestions based on your specific context

## Available Skills

### Creative Product Manager (`creative-product-manager.md`)
- Feature ideation and prioritization
- UX/UI improvements
- Growth strategies
- Competitive analysis

### Cloudflare Architect Expert (`cloudflare-architect.md`)
- Data architecture design for edge computing
- Cloudflare Workers, KV, R2 optimization
- Automated update strategies (scheduled workers)
- Performance tuning for API integrations
- Cost optimization strategies

## Using Skills with AI Assistants

### Method 1: Direct Consultation

1. Open the skill file (e.g., `creative-product-manager.md`)
2. Copy the "Role Definition" section
3. Paste it into your AI assistant
4. Ask your specific question
5. The AI will respond as that expert consultant

**Example (Product Manager)**:
```
[Paste Role Definition]

I'm working on SwiftHerb, an AI-powered supplement recommendation platform.
Question: How can I improve product card engagement to increase affiliate clicks?
```

**Example (Cloudflare Architect)**:
```
[Paste Role Definition]

I'm building SwiftHerb and need to store iHerb product data (50-500 products).
Requirements:
- Update data every 2-4 hours automatically
- Serve data to DeepSeek API quickly (< 100ms)
- Scale efficiently as catalog grows
- Minimize costs

What's the best Cloudflare architecture pattern?
```

### Method 2: Template-Based

1. Find the relevant template in the skill file
2. Fill in your specific context
3. Use web search to research examples
4. Get structured suggestions

**Example**:
```
[Use UX Improvement Template]

I have product cards in my chat interface where users can see recommended supplements.
The problem is: Only 15% of users click on product cards
Current metrics: 15% CTR, average 2.3 products viewed per session

Please analyze and suggest improvements...
```

### Method 3: Research-First

1. Define your problem clearly
2. Use the Research Framework to search for solutions
3. Synthesize findings
4. Apply to your product context

## Integration with Development Workflow

### During Planning
- Use Feature Suggestion Template to brainstorm
- Research competitor features
- Prioritize using frameworks

### During Development
- Consult UX Improvement Template for design decisions
- Research technical solutions
- Validate with user feedback

### During Growth Phase
- Use Growth Strategy Template
- Research growth tactics
- A/B test suggestions

## Tips for Best Results

1. **Be Specific**: Provide concrete context about your product
2. **Include Metrics**: Share current performance data
3. **Research First**: Look for real-world examples before asking
4. **Iterate**: Refine suggestions based on your constraints
5. **Validate**: Always test ideas with real users

## Example Workflow

```
1. Problem: "Users aren't clicking product cards"

2. Research: 
   - Search: "product card engagement best practices e-commerce"
   - Find examples: Amazon, Shopify stores, affiliate sites
   - Note patterns: hover effects, clear CTAs, social proof

3. Consult Skill:
   - Use UX Improvement Template
   - Fill in SwiftHerb context
   - Get structured suggestions

4. Prioritize:
   - Quick wins: Add hover effects (low effort, medium impact)
   - Strategic: Add reviews/ratings (high effort, high impact)

5. Implement & Test:
   - Build quick wins first
   - A/B test changes
   - Measure impact
```

## Adding Your Own Skills

Create new skill files following this structure:

```markdown
# [Skill Name]

## Role Definition
[What this expert does]

## Core Competencies
[Key areas of expertise]

## Prompt Templates
[Templates for common questions]

## Research Framework
[How to research solutions]

## Example Questions
[Specific to your product]
```

## Need Help?

- Review existing skills for structure examples
- Start with Creative Product Manager skill
- Adapt templates to your specific needs
- Combine multiple skills for comprehensive advice
