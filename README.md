# Task Force Pro Edition - Wallet Web Application

A comprehensive wallet management system that helps users track their expenses, income, and manage multiple accounts in one place.

## Features

- **Multi-Account Management**
  - Track transactions across different accounts (bank, mobile money, cash)
  - View individual account balances and history

- **Transaction Tracking**
  - Record income and expenses
  - Categorize transactions
  - Add notes and attachments to transactions

- **Budgeting**
  - Set budget limits for different categories
  - Receive notifications when approaching or exceeding budget limits
  - Track budget progress

- **Categories & Subcategories**
  - Create custom categories and subcategories
  - Link transactions to specific categories
  - Organize spending patterns

- **Reporting & Analytics**
  - Generate detailed reports for any time period
  - Visual representations of spending patterns
  - Export reports in different formats

- **Data Visualization**
  - Interactive charts and graphs
  - Spending trends analysis
  - Category-wise breakdown

## Tech Stack

- **Frontend**
  - React.js
  - Redux for state management
  - Material-UI for components
  - Chart.js for visualizations

- **Backend**
  - Node.js
  - Express.js
  - MongoDB for database
  - JWT for authentication

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

## Getting Started

1. Clone the repository
2. Install dependencies for backend
3. Install dependencies for frontend
4. Run the backend server
5. Run the frontend server

The application will be available at `http://localhost:3000`

Web-bank-wallet/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middleware/
│ │ └── config/
│ ├── package.json
└── frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── redux/
│ ├── services/
│ └── utils/
└── package.json