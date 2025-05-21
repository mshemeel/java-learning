# Contributing to Java Learning Platform

Thank you for your interest in contributing to the Java Learning Platform! This document provides guidelines and instructions for contributing to our documentation.

## Ways to Contribute

There are several ways you can contribute to the Java Learning Platform:

1. **Content Improvements**: Correct errors, clarify explanations, or expand on existing content
2. **New Content**: Add new topics or sections that are missing
3. **Code Examples**: Improve or add new code examples
4. **Technical Improvements**: Enhance the platform's functionality, search capabilities, etc.
5. **Feedback**: Provide feedback on existing content

## Getting Started

### Prerequisites

- GitHub account
- Git installed locally
- Basic knowledge of Markdown
- Python 3.8+ for local testing

### Setup Process

1. Fork the repository
2. Clone your fork locally
   ```bash
   git clone https://github.com/mshemeel/java-learning.git
   cd java-learning
   ```
3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```
4. Run the documentation locally
   ```bash
   mkdocs serve
   ```
5. If the above steps are not working try the below
   ```bash
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python -m mkdocs serve
   ```

## Contribution Workflow

1. Create a new branch for your work
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test your changes locally using `mkdocs serve`
4. Commit your changes with a clear commit message
   ```bash
   git commit -am "Add explanation of Spring Boot profiles"
   ```
5. Push your changes to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a pull request from your fork to the main repository

## Content Guidelines

### Style and Formatting

- Use clear, concise language
- Follow the existing document structure
- Use proper Markdown formatting
- Include code examples where appropriate
- Ensure code examples are correct and runnable

### Adding New Content

1. Create new Markdown files in the appropriate subdirectory
2. Update the `nav` section in `mkdocs.yml` to include your new file
3. Ensure your content includes:
   - Clear introduction
   - Well-structured content with proper headings
   - Code examples where applicable
   - References or further reading

## Review Process

All contributions go through the following review process:

1. Initial review by maintainers
2. Technical accuracy verification
3. Style and formatting check
4. Feedback and suggested changes
5. Final approval and merge

## Code of Conduct

Please note that this project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Questions?

If you have any questions or need help with the contribution process, please open an issue on GitHub or contact the maintainers directly.

Thank you for contributing to the Java Learning Platform! 