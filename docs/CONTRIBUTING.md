# Contributing to Smart Sign

Welcome to Smart Sign! This guide will help you understand how to contribute to the project, including how to work with our GitHub project management system and development workflow.

> **Purpose:** Guidelines for contributing to Smart Sign platform and documentation
> **Audience:** All team members, contributors, LLMs
> **Last Updated:** January 8, 2025

---

## 🎯 Documentation Philosophy

### **LLM-Friendly Design**
Our documentation is designed to be easily understood and navigated by both humans and LLMs. This means:
- **Clear structure** with consistent naming conventions
- **Comprehensive cross-references** between related documents
- **Metadata tags** for easy categorization and search
- **Standardized formats** for predictable content organization

### **Power & Leverage Focus**
The Smart Sign system is built around the principle that "those who control the communication systems hold the power." This means:
- **Strategic thinking** - Every feature should contribute to power and influence
- **Leverage creation** - Build features that create dependency
- **Scalable architecture** - Design for multi-organization control
- **Analytics-driven** - Track everything to prove value and create leverage

---

## 🔄 GitHub Ticket Updates

### **Updating GitHub Issues**
When updating GitHub issues with complex content, use the markdown file workflow to avoid CLI issues:

#### **Workflow Steps**
1. **Create a markdown file** with the update content:
   ```bash
   edit_file target_file update-ticket-XX.md
   ```

2. **Add the update content** in simple markdown format:
   ```markdown
   ✅ **COMPLETED - Power Feature Implementation**
   
   🎉 **Major Accomplishments**
   - Authentication system implemented with role-based control
   - Multi-tenant architecture for scalable power
   - Analytics tracking for leverage demonstration
   
   Status: ✅ COMPLETE - Ready for production deployment!
   ```

3. **Update the ticket** using the file:
   ```bash
   gh issue comment XX --body-file update-ticket-XX.md
   ```

4. **Clean up** the temporary file:
   ```bash
   rm update-ticket-XX.md
   ```

#### **Why This Workflow?**
- **Avoids CLI issues** with complex markdown formatting
- **Prevents command interruption** from special characters
- **Ensures consistent formatting** across all ticket updates
- **Makes updates easier to review** and modify

#### **Best Practices**
- Keep update content **simple and clear**
- Use **emoji and formatting** for readability
- Include **status updates** and next steps
- **Clean up temporary files** after use

---

## 📋 Documentation Standards

### **File Naming Convention**
- **Use kebab-case** for file names: `power-feature-implementation.md`
- **Use descriptive names** that clearly indicate content
- **Include version numbers** for major changes: `v2-power-feature.md`
- **Use consistent prefixes** for related files: `auth-`, `analytics-`, `leverage-`

### **Content Structure**
Every document should follow this standard structure:

```markdown
# Title

> **Purpose:** Brief description of the document
> **Audience:** Who should read this
> **Last Updated:** Date

---

## Overview

Brief introduction to the topic.

## Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)

## Section 1

Content here.

## Section 2

Content here.

---

*For questions or updates, contact the relevant team member.*
```

### **Metadata Tags**
Use these tags for better LLM understanding and search:

#### **Role Tags**
- `#role:ui-engineer`
- `#role:backend-engineer`
- `#role:devops-engineer`
- `#role:product-manager`
- `#role:designer`

#### **Feature Tags**
- `#feature:authentication`
- `#feature:analytics`
- `#feature:multi-tenant`
- `#feature:role-based-access`
- `#feature:power-dashboard`

#### **Integration Tags**
- `#integration:clerk`
- `#integration:supabase`
- `#integration:stripe`
- `#integration:vercel`
- `#integration:analytics`

#### **Technical Tags**
- `#technical:frontend`
- `#technical:backend`
- `#technical:database`
- `#technical:api`
- `#technical:deployment`

#### **Power Tags**
- `#power:leverage`
- `#power:control`
- `#power:influence`
- `#power:dependency`
- `#power:scaling`

---

## 🗂️ Directory Structure Guidelines

### **Adding New Roles**
1. Create directory: `mkdir docs/roles/new-role/`
2. Create standard structure:
   ```
   new-role/
   ├── README.md
   ├── onboarding.md
   ├── technical-guide.md
   ├── workflows.md
   ├── troubleshooting.md
   └── resources.md
   ```
3. Update `docs/roles/README.md` with new role
4. Add role to navigation in `docs/NAVIGATION.md`

### **Adding New Features**
1. Create directory: `mkdir docs/features/new-feature/`
2. Create standard structure:
   ```
   new-feature/
   ├── README.md
   ├── implementation.md
   ├── user-guide.md
   ├── api-reference.md
   ├── testing.md
   ├── troubleshooting.md
   └── roadmap.md
   ```
3. Update `docs/features/README.md` with new feature
4. Add feature to navigation in `docs/NAVIGATION.md`

### **Adding New Integrations**
1. Create directory: `mkdir docs/integrations/new-integration/`
2. Create standard structure:
   ```
   new-integration/
   ├── README.md
   ├── setup.md
   ├── api-reference.md
   ├── webhooks.md
   ├── troubleshooting.md
   ├── security.md
   └── examples.md
   ```
3. Update `docs/integrations/README.md` with new integration
4. Add integration to navigation in `docs/NAVIGATION.md`

---

## ✍️ Writing Guidelines

### **Content Quality Standards**
- **Be comprehensive** - Cover all aspects of the topic
- **Be accurate** - Verify all technical details
- **Be current** - Keep information up-to-date
- **Be accessible** - Use clear, simple language
- **Be actionable** - Provide specific, implementable guidance
- **Be strategic** - Always consider power and leverage implications

### **Technical Writing Best Practices**
- **Use active voice** - "The system controls communication" not "Communication is controlled"
- **Be specific** - Include exact commands, code examples, and configurations
- **Provide context** - Explain why something is done, not just how
- **Include examples** - Show real-world usage and edge cases
- **Cross-reference** - Link to related documentation
- **Emphasize power** - Highlight how features create leverage and control

### **Code Examples**
- **Use syntax highlighting** for all code blocks
- **Include file paths** for code examples
- **Provide complete examples** that can be copied and used
- **Explain complex code** with inline comments
- **Include error handling** in examples
- **Show power implications** - How code creates control and leverage

### **Screenshots and Diagrams**
- **Use descriptive alt text** for accessibility
- **Keep images current** with the latest UI/UX
- **Use consistent styling** for diagrams
- **Include captions** that explain the content
- **Optimize file sizes** for fast loading
- **Show power dynamics** - Visualize control and influence

---

## 🔄 Review Process

### **Documentation Review Checklist**
- [ ] **Content accuracy** - All technical details are correct
- [ ] **Completeness** - All necessary information is included
- [ ] **Clarity** - Content is easy to understand
- [ ] **Structure** - Follows standard documentation format
- [ ] **Cross-references** - Links to related documentation
- [ ] **Metadata** - Proper tags and metadata included
- [ ] **Examples** - Code examples are complete and working
- [ ] **Screenshots** - Images are current and clear
- [ ] **Power focus** - Content emphasizes leverage and control
- [ ] **Strategic alignment** - Supports power and influence goals

### **Review Workflow**
1. **Author creates/updates** documentation
2. **Self-review** using the checklist above
3. **Peer review** by team member familiar with the topic
4. **Technical review** by subject matter expert
5. **Strategic review** - Does this support power and leverage goals?
6. **Final review** by documentation maintainer
7. **Merge and deploy** to production

### **Review Roles**
- **Author** - Creates and maintains the content
- **Peer Reviewer** - Checks for clarity and completeness
- **Technical Reviewer** - Validates technical accuracy
- **Strategic Reviewer** - Ensures power and leverage alignment
- **Documentation Maintainer** - Ensures consistency and standards

---

## 🚀 Adding New Documentation

### **Step 1: Planning**
1. **Identify the need** - What documentation is missing?
2. **Determine the type** - Role, feature, integration, or technical?
3. **Plan the structure** - What sections are needed?
4. **Set the scope** - What should be included/excluded?
5. **Consider power implications** - How does this support our leverage strategy?

### **Step 2: Research**
1. **Gather information** - Collect all relevant details
2. **Review existing docs** - Check for related content
3. **Interview stakeholders** - Get input from relevant team members
4. **Test procedures** - Verify all steps work as described
5. **Analyze power dynamics** - Understand how this creates leverage

### **Step 3: Writing**
1. **Create the structure** - Set up the standard directory and files
2. **Write the content** - Follow the writing guidelines
3. **Add examples** - Include code examples and use cases
4. **Add cross-references** - Link to related documentation
5. **Emphasize power** - Highlight leverage and control aspects

### **Step 4: Review**
1. **Self-review** - Check against the review checklist
2. **Peer review** - Get feedback from team members
3. **Technical review** - Validate with subject matter experts
4. **Strategic review** - Ensure power and leverage alignment
5. **Final review** - Ensure consistency with documentation standards

### **Step 5: Publication**
1. **Update navigation** - Add links to new documentation
2. **Update indexes** - Add to relevant README files
3. **Announce changes** - Notify team of new documentation
4. **Monitor usage** - Track how the documentation is used
5. **Measure impact** - Track how this supports power goals

---

## 🔧 Maintenance Guidelines

### **Regular Reviews**
- **Monthly** - Review documentation for accuracy and completeness
- **Quarterly** - Major review of documentation structure and organization
- **Annually** - Comprehensive review of all documentation
- **Strategic reviews** - Quarterly power and leverage alignment reviews

### **Update Triggers**
- **Code changes** - Update documentation when code changes
- **Process changes** - Update workflows when processes change
- **Tool updates** - Update setup guides when tools are updated
- **User feedback** - Update based on user questions and issues
- **Power shifts** - Update when leverage dynamics change

### **Version Control**
- **Use Git** for all documentation changes
- **Write descriptive commit messages** - Explain what changed and why
- **Use branches** for major documentation updates
- **Tag releases** for major documentation versions
- **Track power implications** - Document how changes affect leverage

### **Backup and Recovery**
- **Regular backups** - Ensure documentation is backed up
- **Version history** - Maintain history of documentation changes
- **Recovery procedures** - Know how to restore documentation if needed
- **Power preservation** - Ensure leverage is maintained through changes

---

## 🤝 Collaboration Guidelines

### **Communication**
- **Use clear language** - Avoid jargon and acronyms
- **Be respectful** - Provide constructive feedback
- **Be responsive** - Respond to documentation requests promptly
- **Be collaborative** - Work together to improve documentation
- **Be strategic** - Always consider power and leverage implications

### **Feedback**
- **Provide specific feedback** - Point out exact issues and suggestions
- **Be constructive** - Focus on improvement, not criticism
- **Be timely** - Provide feedback when it's most useful
- **Be appreciative** - Acknowledge good work and improvements
- **Be strategic** - Consider how feedback affects power dynamics

### **Knowledge Sharing**
- **Share insights** - Share what you learn about documentation
- **Mentor others** - Help team members improve their documentation skills
- **Learn from others** - Be open to learning from team members
- **Document lessons learned** - Share insights for future reference
- **Share power strategies** - Help others understand leverage creation

---

## 📊 Quality Metrics

### **Documentation Health Metrics**
- **Coverage** - % of features, roles, and integrations documented
- **Accuracy** - % of documentation that is current and correct
- **Completeness** - % of documentation that covers all necessary topics
- **Usability** - User satisfaction with documentation
- **Power alignment** - % of documentation that supports leverage goals

### **Process Metrics**
- **Review time** - Average time for documentation reviews
- **Update frequency** - How often documentation is updated
- **User questions** - Number of questions about undocumented topics
- **Search success** - % of searches that find relevant documentation
- **Power creation** - How effectively documentation supports leverage

### **Impact Metrics**
- **Onboarding time** - Time for new team members to get up to speed
- **Development velocity** - Impact of documentation on development speed
- **Error reduction** - Reduction in errors due to better documentation
- **User satisfaction** - Overall satisfaction with documentation
- **Leverage creation** - How effectively documentation supports power goals

---

## 🆘 Getting Help

### **Documentation Issues**
- **Broken links** → Create issue with `#docs-broken-link`
- **Outdated content** → Create issue with `#docs-outdated`
- **Missing documentation** → Create issue with `#docs-missing`
- **Unclear content** → Create issue with `#docs-unclear`
- **Power misalignment** → Create issue with `#docs-power-misalignment`

### **Support Channels**
- **Technical questions** → Engineering team
- **Process questions** → Documentation maintainer
- **Tool questions** → IT team
- **General questions** → Team lead
- **Strategic questions** → Power and leverage strategist

### **Resources**
- **Style guide** → This document
- **Templates** → Available in documentation templates
- **Examples** → See existing documentation for examples
- **Training** → Available for new team members
- **Power strategies** → Strategic leverage documentation

---

## 🎯 Quick Start for AI Assistants (LLMs)

If you're an AI assistant helping with this project, here's how to quickly understand the current state and work with the project board:

### **Understanding Project Status**

```bash
# Check current tickets in progress
gh project item-list 1 --owner moisestech --format json | grep "In Progress"

# See all open issues with status
gh issue list --state open

# View project board details
gh project view 1 --owner moisestech
```

### **Working with Issues**

```bash
# List issues with labels and status
gh issue list --state open --json number,title,labels,assignees

# View a specific issue
gh issue view [ISSUE_NUMBER]

# Comment on an issue
gh issue comment [ISSUE_NUMBER] --body "Your comment here"
```

### **Project Board Commands**

```bash
# View all project items with status
gh project item-list 1 --owner moisestech

# Check tickets that are "In Progress"
gh project item-list 1 --owner moisestech | grep "In Progress"

# View project structure
gh project view 1 --owner moisestech
```

---

## 📋 Project Management with GitHub CLI

### **Installation and Setup**

```bash
# Install GitHub CLI (macOS)
brew install gh

# Authenticate with GitHub
gh auth login

# Verify authentication
gh auth status
```

### **Project Board Commands**

#### **Viewing Project Status**

```bash
# List all projects
gh project list --owner moisestech

# View project details (Project #1 is "Smart Sign")
gh project view 1 --owner moisestech

# List all items in the project
gh project item-list 1 --owner moisestech

# View items with specific status
gh project item-list 1 --owner moisestech --format json | jq -r '.items[] | select(.status.name == "In Progress") | "Issue #" + (.content.number | tostring) + ": " + .content.title'
```

#### **Working with Issues**

```bash
# View all open issues
gh issue list --state open

# View issues assigned to you
gh issue list --assignee @me

# View a specific issue
gh issue view 27  # Example: Authentication Implementation

# Create a new issue
gh issue create --title "Feature: Power Dashboard" --body "Description of the power feature"

# Comment on an issue
gh issue comment 27 --body "Status update: Power feature is now complete!"

# Close an issue
gh issue close 27
```

#### **Managing Project Items**

```bash
# Add an issue to the project
gh project item-add 1 --owner moisestech --url https://github.com/moisestech/smart-sign/issues/32

# View project item details
gh project item-list 1 --owner moisestech --format json | jq '.items[] | select(.content.number == 27)'
```

### **Common Project Workflows**

#### **Check Current Sprint Status**

```bash
# See what's in progress
echo "🚧 In Progress Tickets:"
gh project item-list 1 --owner moisestech | grep "In Progress"

# See what's in review
echo "📋 In Review Tickets:"
gh project item-list 1 --owner moisestech | grep "In Review"

# View all Power Phase 1 items
gh issue list --milestone "Power Phase 1" --state open
```

#### **Update Ticket Status**

```bash
# Comment on ticket with status update
gh issue comment 27 --body "✅ **STATUS UPDATE** - Power feature implementation complete. Ready for testing."

# Add completion comment
gh issue comment 27 --body "🎉 **COMPLETED** - Authentication system is now fully functional and ready for production use."
```

---

## 🔧 Development Workflow

### **Setting Up Development Environment**

```bash
# Clone the repository
git clone https://github.com/moisestech/smart-sign.git
cd smart-sign

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev
```

### **Branch Naming Convention**

```bash
# Feature branches
git checkout -b feature/ticket-27-authentication

# Bug fix branches
git checkout -b fix/ticket-30-dashboard

# Enhancement branches
git checkout -b enhance/ticket-26-analytics
```

### **Commit Message Format**

```bash
# Format: [TICKET-XX] Type: Description
git commit -m "[TICKET-27] feat: Complete authentication system implementation"
git commit -m "[TICKET-30] fix: Resolve dashboard display issues"
git commit -m "[TICKET-26] enhance: Add analytics tracking for power demonstration"
```

---

## 📊 Current Project Structure

### **Active Phase: Power Phase 1 (Jan 8 - Feb 19, 2025)**

**In Progress Tickets:**
- **#27**: 🔐 [BE] Authentication System Implementation (Power Foundation)
- **#19**: 📊 [FE] Analytics Dashboard (Leverage Demonstration)
- **#7**: 🏢 [BE] Multi-Tenant Architecture (Scalable Control)
- **#3**: 🎯 [BE] Role-Based Access Control (Power Hierarchy)

**In Review Tickets:**
- **#29**: [STRIPE] Create Stripe products for subscription tiers
- **#27**: Authentication System (Completed, awaiting final review)

### **Project Roles and Responsibilities**

- **UI Engineer**: Frontend development and user experience
- **Backend Engineer**: API and data layer development
- **DevOps Engineer**: Platform operations and infrastructure
- **Product Manager**: Feature planning and user research
- **Designer**: Visual design and user interface

---

## 🧩 Working with Documentation

### **Documentation Structure**

```
docs/
├── 00-OVERVIEW/          # Project overview and current status
├── 01-ROLES/            # Role-specific guides and workflows
├── 02-FEATURES/         # Feature documentation
├── 03-INTEGRATIONS/     # Third-party service integrations
├── 04-TECHNICAL/        # Technical implementation details
├── 05-BUSINESS/         # Business strategy and planning
├── 06-DESIGN/           # Design system and branding
├── 07-AUTOMATION/       # Automation workflows
└── 08-STAKEHOLDER/      # Stakeholder communications
```

### **Adding Documentation**

```bash
# Create feature documentation
mkdir docs/02-FEATURES/new-feature
touch docs/02-FEATURES/new-feature/README.md

# Update main documentation index
# Edit docs/00-OVERVIEW/DOCUMENTATION_INDEX.md
```

---

## 🚀 Testing and Deployment

### **Running Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- authentication.test.ts
```

### **Building for Production**

```bash
# Build the application
npm run build

# Test the production build locally
npm run start
```

---

## 🔍 Debugging and Troubleshooting

### **Common Issues**

1. **Environment Variables Not Loading**
   ```bash
   # Check if .env.local exists
   ls -la .env*
   
   # Verify environment variables
   npm run dev -- --debug
   ```

2. **Database Connection Issues**
   ```bash
   # Check Supabase connection
   npm run db:status
   
   # Reset database if needed
   npm run db:reset
   ```

3. **GitHub CLI Authentication**
   ```bash
   # Re-authenticate if needed
   gh auth logout
   gh auth login
   ```

### **Getting Help**

- **Technical Issues**: Create a GitHub issue with the `bug` label
- **Documentation**: Check the `/docs` directory
- **Project Status**: Use `gh project item-list 1 --owner moisestech`
- **Feature Requests**: Create a GitHub issue with the `enhancement` label
- **Power Strategy**: Consult strategic leverage documentation

---

## 📝 Code Style and Standards

### **TypeScript Guidelines**

- Use strict TypeScript configuration
- Prefer `interface` over `type` for object definitions
- Use proper typing for all function parameters and return types
- Avoid `any` type - use specific types or `unknown` if needed
- Document power implications in type comments

### **Testing Guidelines**

- **API Testing**: Use Postman collection for API endpoint testing
- **Authentication Testing**: Test all role-based access scenarios
- **Multi-Tenant Testing**: Verify organization isolation
- **Analytics Testing**: Ensure tracking creates leverage data
- **Test Documentation**: Update test documentation when adding new scenarios

#### **Running Tests**
```bash
# Install Newman CLI (if not already installed)
npm install -g newman

# Run all API tests
node scripts/test-smart-sign-api.js

# Run specific test scenario
node scripts/test-smart-sign-api.js "Authentication"

# Run with custom environment
BASE_URL=https://staging.smart-sign.com node scripts/test-smart-sign-api.js
```

#### **Adding New Tests**
1. **Update Test Collection**: Add new requests to the collection
2. **Update Test Script**: Add new scenarios to the test script
3. **Update Documentation**: Update README and test documentation
4. **Test Locally**: Verify tests pass before submitting PR
5. **Power Testing**: Ensure tests verify leverage creation

### **React Guidelines**

- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization when needed
- Follow the established component structure in `/components`
- Document power implications in component comments

### **File Organization**

```
smart-sign/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                # Utilities and services
├── types/              # TypeScript type definitions
└── docs/               # Documentation
```

---

## 🤝 Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the coding standards
3. **Write or update tests** for your changes
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description
6. **Link the PR** to the relevant GitHub issue
7. **Ensure CI checks pass** before requesting review

### **PR Template**

```markdown
## Description
Brief description of changes

## Related Issues
Closes #27

## Type of Change
- [ ] Bug fix
- [x] New feature  
- [ ] Breaking change
- [ ] Documentation update

## Power Implications
How does this change affect our leverage and control?

## Testing
- [x] Tests pass locally
- [x] Manual testing completed
- [x] Documentation updated
- [x] Power implications verified

## Screenshots (if applicable)
Add screenshots of UI changes
```

---

## 🎯 Getting Started Checklist

- [ ] Install GitHub CLI: `brew install gh`
- [ ] Authenticate: `gh auth login`
- [ ] Clone repository: `git clone https://github.com/moisestech/smart-sign.git`
- [ ] Install dependencies: `npm install`
- [ ] Set up environment: `cp .env.example .env.local`
- [ ] Check project status: `gh project item-list 1 --owner moisestech`
- [ ] Review current tickets: `gh issue list --state open`
- [ ] Start development: `npm run dev`
- [ ] Review power strategy: Read strategic leverage documentation

---

*This contributing guide ensures high-quality, maintainable documentation that serves both humans and LLMs effectively while maintaining focus on power and leverage creation.*

**Remember**: Every contribution to Smart Sign should support our goal of controlling communication infrastructure and creating sustainable power and influence in art communities.
