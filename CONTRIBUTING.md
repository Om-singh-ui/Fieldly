# Contributing to Fieldly 🌱

Welcome, and thank you for your interest in contributing to **Fieldly**! We're building a revolutionary platform at the intersection of **regenerative agriculture** and **financial technology**, designed to empower farmers, connect institutional investors, and create a sustainable future. Your contributions—whether code, design, documentation, or ideas—play a crucial role in shaping that vision.

This guide outlines how both new and experienced contributors can get involved: from reporting bugs and suggesting new features to improving documentation or contributing production-ready code. Whether you're fixing a typo or architecting a major feature, every contribution helps strengthen the Fieldly ecosystem.

**Audience:** Developers, designers, financial analysts, agricultural experts, writers, and community members who want to help make Fieldly better.

---

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Report a Bug](#report-a-bug)
  - [Request a Feature](#request-a-feature)
  - [Improve Documentation](#improve-documentation)
  - [Submit Code (PRs)](#submit-code-prs)
  - [Domain Expertise](#domain-expertise)
- [Getting Started (Local Development)](#getting-started-local-development)
- [Project Structure](#project-structure)
- [Branching & Workflow](#branching--workflow)
- [Commit Message Convention](#commit-message-convention)
- [Coding Style & Linting](#coding-style--linting)
- [Testing](#testing)
- [Review Process](#review-process)
- [Security & Responsible Disclosure](#security--responsible-disclosure)
- [License and Copyright](#license-and-copyright)
- [Acknowledgements & Contacts](#acknowledgements--contacts)
- [Templates](#templates)

---

## 📜 Code of Conduct

This project follows a **Contributor Covenant (v2.1)** — we expect all community members to be professional, respectful, and inclusive. By participating, you agree to abide by this code. If you experience or witness unacceptable behavior, contact the maintainers immediately (see [Contacts](#acknowledgements--contacts)).

**Our Pledge:**
- Be respectful and considerate
- Provide constructive feedback
- Welcome newcomers and diverse perspectives
- Focus on what's best for the community and end-users (farmers, investors)
- Show empathy towards other community members

**Unacceptable Behavior:**
- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

---

## 🚀 How Can I Contribute?

### 🐛 Report a Bug
Found a bug in the platform? Help us fix it:

1. **Search existing issues** to avoid duplicates
2. **Open a new issue** with the bug template
3. **Include**:
   - Clear title (what's broken)
   - Steps to reproduce
   - Expected vs. actual behavior
   - Environment (OS, Node version, browser, device)
   - Relevant logs or screenshots
   - User role (Farmer/Investor/Admin) if applicable

**Label:** `bug`

---

### 💡 Request a Feature
Have an idea to improve Fieldly? We'd love to hear it:

1. **Check existing discussions/issues** to see if it's already suggested
2. **Create a feature request** using the template
3. **Include**:
   - Problem statement (what need does it address?)
   - Proposed solution or user flow
   - Who benefits (Farmers? Investors? Both?)
   - Possible alternatives considered
   - Any relevant research or examples

**Label:** `enhancement`

---

### 📚 Improve Documentation
Documentation improvements are the easiest way to start contributing. Good documentation helps farmers access loans and investors understand opportunities.

Areas to contribute:
- `/docs` folder
- README files
- API documentation
- Code comments
- User guides for farmers
- Investor onboarding guides
- Setup instructions

**Process:**
1. Fork the repo
2. Make changes to relevant markdown files
3. Add examples, clarify steps, or fix typos
4. Submit a PR referencing the issue (if any)

**Label:** `documentation`

---

### 💻 Submit Code (PRs)
Ready to write some code? Follow these steps:

1. **Fork the repository** and create a branch (see [Branching](#branching--workflow))
2. **Implement focused changes** (one feature/fix per PR)
3. **Add or update tests** where applicable
4. **Run linters and tests locally**
5. **Open a Pull Request** against `develop` with:
   - Descriptive title following [commit conventions](#commit-message-convention)
   - What problem the PR solves
   - Notes on migration, breaking changes, or runtime impact
   - Screenshots or screencasts for UI changes
   - Link to related issue (if any)

**Label:** `needs-review`

---

### 🌾 Domain Expertise
Not a developer? You can still contribute valuable domain knowledge:

- **Agricultural Experts:** Review features from a farmer's perspective
- **Financial Analysts:** Validate loan calculations and investment models
- **UX Designers:** Improve the user experience for both farmers and investors
- **Content Writers:** Help craft clear, accessible copy
- **Translators:** Help localize the platform for different regions

Reach out via our community channels to get involved!

---

## 🛠️ Getting Started (Local Development)

### Prerequisites
- Node.js 18.x or higher (LTS recommended)
- npm 9.x or higher / pnpm 8.x
- Git
- PostgreSQL 14+ (or Neon DB account)
- Clerk account (for authentication)

### Step-by-Step Setup

```bash
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/Fieldly.git
cd Fieldly

# 2. Add upstream remote
git remote add upstream https://github.com/Om-singh-ui/Fieldly.git

# 3. Install dependencies
npm install
# or
pnpm install

# 4. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials:
# - Clerk API keys
# - Database URL
# - Other service credentials

# 5. Run database migrations
npm run db:migrate
npm run db:seed  # Optional: seed with test data

# 6. Start development server
npm run dev