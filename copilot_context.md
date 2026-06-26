# IT360 - Sales Force Automation (SFA)
## Project Context for GitHub Copilot

---

# Project Overview

This project is part of a commercial enterprise software named **IT360**, an integrated business management platform being developed by our company.

IT360 consists of multiple modules including:

- CRM
- SFA (Sales Force Automation)
- VMS (Vendor Management System)
- DMS
- HRMS
- ERP
- POS
- Marketing Automation
- Logistics
- LMS
- Finance
- Reports

Each module is being developed independently by separate teams and will later be integrated into the complete IT360 platform.

Our team is responsible only for the **SFA (Sales Force Automation)** module.

This is NOT a college project.
This is a real commercial SaaS product.

---

# Technology Stack

Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation

Frontend
- React
- Vite
- Tailwind CSS

Version Control
- Git
- GitHub

API Testing
- Postman

Architecture
- REST API

---

# Development Philosophy

Follow enterprise-grade software engineering practices.

Code should be:

- Modular
- Scalable
- Reusable
- Maintainable
- Clean
- Production Ready

Never generate tutorial-level code.

Always generate code suitable for a commercial SaaS application.

---

# Current Project Status

Sprint 0 (Foundation)

Completed:

- Repository initialized
- Backend initialized
- Frontend initialized
- Prisma initialized
- Folder structure created
- Git repository configured
- Branch strategy configured

No business logic has been implemented yet.

---

# Folder Structure

backend/

frontend/

docs/

assets/

scripts/

Inside backend/src/modules:

- auth
- organization
- users
- catalog
- sales-config
- lead-intelligence
- leads
- customers
- opportunities
- quotations
- orders
- field-force
- team
- performance
- dashboard
- reports
- notifications
- ai-assistant
- settings

Each backend module follows:

module-name/

- module.controller.js
- module.service.js
- module.repository.js
- module.routes.js
- module.validation.js
- module.schema.js
- module.constants.js
- module.permissions.js
- index.js

Frontend follows the same module-based architecture.

---

# Coding Standards

Use CommonJS syntax for backend.

Example:

const express = require("express");

Do NOT use ES Modules.

---

Use async/await.

Never use callbacks.

---

Business logic belongs inside Service.

Database queries belong inside Repository.

Controller should only:

- validate request
- call service
- return response

---

Validation must use Zod.

---

Never access Prisma directly inside Controller.

---

Never write SQL queries.

Always use Prisma.

---

Use proper HTTP status codes.

---

Always return JSON.

---

# Standard API Response

Success

{
    "success": true,
    "message": "",
    "data": {}
}

Failure

{
    "success": false,
    "message": "",
    "errors": []
}

---

# Authentication

Authentication will use:

JWT

Role Based Access Control (RBAC)

Multi-tenant architecture

Authentication is NOT implemented yet.

Do not assume auth already exists.

---

# Roles

Super Admin

Admin

Head of Sales

National Sales Manager

Regional Sales Manager

Sales Manager

Senior Sales Executive

Sales Executive

Every future API should consider role-based authorization.

---

# SFA Modules

The project contains the following business modules.

1. Lead Intelligence
2. Leads
3. Customers
4. Opportunities
5. Quotations
6. Orders
7. Field Force
8. Performance
9. Team Management
10. Dashboard
11. Reports
12. Notifications

---

# Lead Intelligence

Lead Intelligence is AI-assisted.

Workflow:

Raw Data

↓

Import

↓

AI Email Campaign

↓

Email Sent

↓

Reply Tracking

↓

Interest Detection

↓

Qualified Lead

↓

Lead Created

↓

Assigned to Sales Executive

↓

Opportunity

↓

Quotation

↓

Order

This is the official lead generation workflow.

---

# Important Rules

Never change folder structure.

Never rename modules.

Never move files.

Always follow existing architecture.

When adding a feature:

Controller

↓

Service

↓

Repository

↓

Prisma

Follow separation of concerns.

---

# Coding Style

Write readable code.

Use descriptive variable names.

Add professional comments where necessary.

Avoid unnecessary comments.

Never generate placeholder code if a production implementation is possible.

---

# Current Goal

We are currently in Sprint 0.

We are preparing the project foundation.

The next milestone will be:

Database Design

↓

RBAC

↓

Authentication

↓

Organization

↓

Users

↓

Lead Intelligence

↓

Leads

Do not jump ahead unless requested.

Always build incrementally.

---

You are acting as a Senior Software Engineer on this project.

Whenever asked to generate code, follow the architecture and standards described above.