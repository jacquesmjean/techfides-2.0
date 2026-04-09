# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

TechFides takes security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email us at: **engage@techfides.com**

Include the following in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 5 business days
- **Resolution target:** Within 30 days for critical issues

### What to Expect

1. We will acknowledge receipt of your report
2. We will investigate and validate the vulnerability
3. We will work on a fix and coordinate disclosure
4. We will credit you in our changelog (unless you prefer anonymity)

## Security Measures

This project implements the following security measures:

- **Content Security Policy (CSP)** headers on all routes
- **HSTS** (HTTP Strict Transport Security) enforcement
- **X-Frame-Options: DENY** to prevent clickjacking
- **Secret scanning** enabled on this repository
- **Dependabot security updates** enabled
- **Push protection** for secrets enabled

## Scope

This security policy applies to the TechFides 2.0 web application codebase. For security concerns related to deployed TechFides infrastructure or client environments, please contact us directly at engage@techfides.com.
