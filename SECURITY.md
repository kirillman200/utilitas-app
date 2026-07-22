# Security policy

## Supported surface

Security reports are accepted for the public Utilitas hub and its deployment configuration. Individual projects maintain their own security boundaries and reporting guidance.

## Reporting

Use private vulnerability reporting on the relevant GitHub repository when available. Include the affected URL, impact, reproducible steps, and a minimal proof. Do not include secrets or private user data in public issues.

Do not degrade service, access data that is not yours, perform broad automated scanning, or publish an uncorrected vulnerability.

## Deployment boundary

Only the generated `dist/` directory is public. Environment files, repository contents, dependencies, source files, tests, and local configuration must not be deployed.
