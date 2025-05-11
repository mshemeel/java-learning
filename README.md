# Java Learning Platform

A comprehensive documentation platform for Java developers covering core concepts to advanced microservices architecture.

## Overview

The Java Learning Platform is a static documentation site built with MkDocs and hosted on GitHub Pages. It provides comprehensive guides and tutorials on:

- Java Core
- Spring Boot
- Microservices
- Kubernetes
- Design Patterns

## Deployment

The documentation is automatically deployed to GitHub Pages using GitHub Actions. Here's how to work with this project:

### Prerequisites

- Python 3.8+
- pip
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/mshemeel/java-learning.git
   cd java-learning
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the local development server:
   ```bash
   mkdocs serve
   ```

4. Open your browser and navigate to `http://127.0.0.1:8000/`

### Deployment Process

The documentation is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process is handled by GitHub Actions as configured in `.github/workflows/deploy.yml`.

To manually trigger a deployment:

1. Go to the GitHub repository
2. Navigate to Actions
3. Select the "Deploy Documentation" workflow
4. Click "Run workflow"

### Custom Domain (Optional)

To set up a custom domain:

1. Update the CNAME in the GitHub workflow file
2. Configure your DNS settings as per the deployment guide
3. Enable HTTPS in the GitHub Pages settings

## Project Structure

```
java-learning/
├── java/
│   ├── java-basics.md
│   ├── java-oop.md
│   └── java-collections.md
├── spring-boot/
│   └── (Spring Boot documentation files)
├── kubernetes/
│   ├── kubernetes-basics.md
│   ├── kubernetes-deployment.md
│   ├── kubernetes-services.md
│   ├── kubernetes-config-secrets.md
│   ├── kubernetes-storage.md
│   ├── kubernetes-scaling.md
│   ├── kubernetes-monitoring.md
│   ├── kubernetes-security.md
│   ├── kubernetes-networking.md
│   ├── kubernetes-troubleshooting.md
│   └── kubernetes-best-practices.md
├── microservices/
│   └── (Microservices documentation files)
└── design-patterns/
    ├── design-patterns-principles.md
    ├── design-patterns-best-practices.md
    ├── design-patterns-j2ee.md
    ├── design-patterns-behavioral.md
    ├── design-patterns-structural.md
    └── design-patterns-creational.md
```

## Documentation Index

### Java Core
- [Java Basics](java/java-basics.md) - Fundamental Java concepts, syntax, and basic operations
- [Java OOP](java/java-oop.md) - Object-oriented programming concepts in Java
- [Java Collections](java/java-collections.md) - Java Collections Framework guide

### Kubernetes
- [Kubernetes Basics](kubernetes/kubernetes-basics.md) - Introduction to Kubernetes concepts
- [Kubernetes Deployment](kubernetes/kubernetes-deployment.md) - Deployment strategies and configurations
- [Kubernetes Services](kubernetes/kubernetes-services.md) - Service types and networking
- [Kubernetes Config & Secrets](kubernetes/kubernetes-config-secrets.md) - Configuration and secrets management
- [Kubernetes Storage](kubernetes/kubernetes-storage.md) - Storage concepts and volume management
- [Kubernetes Scaling](kubernetes/kubernetes-scaling.md) - Scaling strategies and autoscaling
- [Kubernetes Monitoring](kubernetes/kubernetes-monitoring.md) - Monitoring and logging
- [Kubernetes Security](kubernetes/kubernetes-security.md) - Security concepts and best practices
- [Kubernetes Networking](kubernetes/kubernetes-networking.md) - Networking concepts and configurations
- [Kubernetes Troubleshooting](kubernetes/kubernetes-troubleshooting.md) - Debugging and problem-solving
- [Kubernetes Best Practices](kubernetes/kubernetes-best-practices.md) - Production best practices

### Design Patterns
- [Design Patterns Principles](design-patterns/design-patterns-principles.md) - SOLID, ACID, and 12-Factor methodology
- [Design Patterns Best Practices](design-patterns/design-patterns-best-practices.md) - Best practices and guidelines
- [J2EE Design Patterns](design-patterns/design-patterns-j2ee.md) - Enterprise Java design patterns
- [Behavioral Patterns](design-patterns/design-patterns-behavioral.md) - Behavioral design patterns
- [Structural Patterns](design-patterns/design-patterns-structural.md) - Structural design patterns
- [Creational Patterns](design-patterns/design-patterns-creational.md) - Creational design patterns

## Getting Started

1. Begin with the Java Core section if you're new to Java
2. Progress to Design Patterns to understand software design principles
3. Move on to Spring Boot for web application development
4. Learn Microservices architecture and patterns
5. Finally, master Kubernetes for container orchestration

## Learning Path

### Beginner Level
1. Java Basics
2. Java OOP
3. Java Collections
4. Basic Design Patterns

### Intermediate Level
1. Spring Boot Basics
2. J2EE Design Patterns
3. Microservices Fundamentals
4. Basic Kubernetes Concepts

### Advanced Level
1. Advanced Design Patterns
2. Complex Microservices Patterns
3. Advanced Kubernetes Features
4. Production Best Practices

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Feedback

We value your feedback! Please submit any comments or suggestions through our [feedback form](https://mshemeel.github.io/java-learning/feedback/) or by creating an issue in this repository.

## Acknowledgments

- Thanks to all contributors who have helped build this learning platform
- Special thanks to the open-source community for valuable resources
- Credits to various authors and organizations whose work has inspired this content 