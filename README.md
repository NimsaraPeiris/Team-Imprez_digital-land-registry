# Digital Land Registry Hub

A full-stack web application for a Digital Land Registry Hub, with a Next.js frontend and a FastAPI backend. This project provides a secure platform for citizens and officers to manage land registration, property records, and related services.

### Features

  * **User Management**: Secure user registration, login, and authentication with JWT tokens.
  * **Multi-language Support**: The frontend supports English, Sinhala, and Tamil.
  * **User Dashboard**: A personalized dashboard for authenticated users to view available services and track application status.
  * **Available Services**: Services such as Land Transfer, Application for Certified Copy of a Land, Application for Search of Land Registers, and Application for Search Duplicate of Deeds.
  * **File Uploads**: Functionality to attach documents to applications.
  * **Admin/Officer Functionality**: A separate set of API endpoints for officers to review and update application and document statuses.

-----

### Technologies Used

#### Frontend

  * **Framework**: Next.js 15.2.4
  * **Language**: TypeScript
  * **Styling**: Tailwind CSS, `tailwindcss-animate`
  * **UI Components**: Shadcn/ui, Radix UI
  * **State Management**: React Context (`AuthContext`, `TranslationContext`)
  * **Forms**: `react-hook-form` with `zod` validation

#### Backend

  * **Framework**: FastAPI
  * **Language**: Python
  * **Database**: PostgreSQL
  * **ORM**: SQLAlchemy with `asyncio`
  * **Authentication**: JWT (JSON Web Tokens), `passlib` for password hashing

-----

### File and Folder Structure

```
Team-Imprez_digital-land-registry/
├── backend/
│   ├── db/
│   │   ├── lro_backend_models.py     # SQLAlchemy models, DB session, and password hashing utilities
│   ├── routers/
│   │   ├── admin/
│   │   │   ├── applications.py       # Admin routes for application management
│   │   │   └── documents.py          # Admin routes for document management
│   │   └── user/
│   │       ├── applications.py       # User routes for application management
│   │       ├── auth.py               # User authentication routes (register, login)
│   │       ├── documents.py          # User routes for document management
│   │       └── payments.py           # User routes for payments
│   ├── schemas/
│   │   ├── admin_schemas.py          # Pydantic models for admin endpoints
│   │   ├── common.py                 # Common enums shared across schemas
│   │   └── user_schemas.py           # Pydantic models for user endpoints
│   ├── main.py                       # Main FastAPI application entry point
│   └── requirements.txt              # Python dependencies
└── Frontend/
    ├── app/
    │   ├── dashboard/
    │   │   └── page.tsx              # User dashboard page
    │   ├── register/
    │   │   └── page.tsx              # User registration page
    │   ├── globals.css               # Global CSS styles
    │   └── layout.tsx                # Main application layout
    ├── components/
    │   ├── announcements-section.tsx # Component for news and announcements
    │   ├── contact-section.tsx       # Component for contact information
    │   ├── dashboard-navigation-bar.tsx # Dashboard-specific navigation bar
    │   ├── faq-section.tsx           # Component for frequently asked questions
    │   ├── footer.tsx                # Footer component
    │   ├── government-header.tsx     # Government header with language switcher
    │   ├── hero-section.tsx          # Hero section component
    │   ├── home-navigation-bar.tsx   # Home page navigation bar
    │   ├── login-overlay.tsx         # Login modal/overlay component
    │   ├── navigation-bar.tsx        # General navigation bar logic
    │   ├── process-section.tsx       # "How it works" section
    │   ├── services-section.tsx      # Services list component
    │   └── theme-provider.tsx        # Theme provider
    ├── contexts/
    │   ├── auth-context.tsx          # React context for authentication state
    │   └── translation-context.tsx   # React context for multi-language support
    ├── lib/
    │   ├── use-smooth-scroll.ts      # Custom hook for smooth scrolling
    │   └── utils.ts                  # Utility functions
    ├── public/
    │   └── ...                       # Image and asset files
    ├── .gitignore                    # Git ignore file for frontend
    ├── next.config.mjs               # Next.js configuration
    ├── package.json                  # Node.js dependencies and scripts
    └── tsconfig.json                 # TypeScript configuration
```

### Database Schema

The database models are defined using SQLAlchemy in `backend/db/lro_backend_models.py`. Here's a summary of the key tables:

| Table Name | Description | Key Fields |
| :--- | :--- | :--- |
| **users** | Stores user registration and authentication information. | `user_id`, `email`, `nic_number`, `password_hash` |
| **offices** | Manages the different land registry offices. | `office_id`, `office_name` |
| **lro\_officers** | Stores information for Land Registry Officer accounts. | `officer_id`, `user_id`, `employee_id` |
| **services** | Defines the types of land registry services available. | `service_id`, `service_name`, `service_code` |
| **application\_status** | A lookup table for application statuses. | `status_id`, `status_name` |
| **applications** | Core table for all user applications. | `application_id`, `user_id`, `service_id`, `status_id` |
| **payments** | Records payment details for applications. | `payment_id`, `application_id`, `amount` |
| **uploaded\_documents** | Stores metadata for documents attached to applications. | `document_id`, `application_id`, `file_name`, `verification_status` |
| **application\_log** | Logs actions and remarks for each application. | `log_id`, `application_id`, `action_taken` |
| **app\_land\_transfer** | Details specific to a Land Transfer application. | `land_transfer_id`, `application_id` |
| **app\_search\_duplicate\_deeds** | Details for a search for duplicate deeds application. | `search_duplicate_id`, `application_id` |
| **app\_copy\_of\_land\_registers** | Details for a copy of land registers application. | `copy_register_id`, `application_id` |
| **app\_search\_land\_registers** | Details for a search of land registers application. | `search_register_id`, `application_id` |
| **search\_register\_folios** | Stores folio details for search register applications. | `folio_request_id`, `search_register_id` |
| **app\_copy\_of\_document** | Details for a copy of a document application. | `copy_doc_id`, `application_id` |

-----

### API Structure

The API is built with FastAPI and includes separate routers for user and administrative functions. All endpoints are prefixed with `/api`.

#### User Endpoints (`/api/user/`)

These endpoints are for authenticated users (citizens) to manage their applications and related activities. All of these routes require a valid JWT token.

| Endpoint | Method | Description | Source File |
| :--- | :--- | :--- | :--- |
| `/api/user/auth/register` | `POST` | Registers a new user account. Returns the new user's details. | |
| `/api/user/auth/login` | `POST` | Authenticates a user with email and password. Returns an access token. | |
| `/api/user/applications/` | `GET` | Lists all applications submitted by the current user. | |
| `/api/user/applications/` | `POST` | Creates a new application for a specified service. | |
| `/api/user/applications/{application_id}` | `GET` | Retrieves the details of a specific application. | |
| `/api/user/applications/documents` | `POST` | Attaches metadata for an uploaded document to an application. | |
| `/api/user/applications/{application_id}/documents` | `GET` | Lists all documents associated with a specific application. | |
| `/api/user/documents/` | `GET` | Lists all documents uploaded by the current user across all applications. | |
| `/api/user/payments/` | `POST` | Creates a new payment record for an application. | |
| `/api/user/payments/application/{application_id}` | `GET` | Lists all payments made for a specific application. | |

-----

#### Admin Endpoints (`/api/admin/`)

These endpoints are for authenticated officers to review and manage applications and documents. All of these routes require a valid JWT token associated with an officer account.

| Endpoint | Method | Description | Source File |
| :--- | :--- | :--- | :--- |
| `/api/admin/applications/` | `GET` | Lists all applications in the system. | |
| `/api/admin/applications/{application_id}` | `GET` | Retrieves the details of a specific application for review. | |
| `/api/admin/applications/{application_id}/status` | `POST` | Updates the status of an application. | |
| `/api/admin/applications/{application_id}/logs` | `GET` | Retrieves the log history for a specific application. | |
| `/api/admin/documents/` | `GET` | Lists all documents uploaded across all applications. | |
| `/api/admin/documents/{document_id}/verify` | `POST` | Sets the verification status for a specific document. | |

-----

### Prerequisites

To set up and run this project, you will need the following installed on your machine:

  * Python (3.8+)
  * Node.js (18+)
  * pnpm (or npm/yarn if you prefer, but `pnpm` is used in the lockfile)
  * PostgreSQL database instance

-----

### Setup Instructions

Follow these steps to get the project running on your local machine.

#### 1\. Backend Setup

1.  Navigate to the `backend` directory.
    ```sh
    cd backend
    ```
2.  Install the required Python packages. If you face an issue with the `pip` command not being recognized, use `python -m pip` instead.
    ```sh
    python -m pip install -r requirements.txt
    ```
3.  **Database Configuration**: The project is set up to use PostgreSQL. You must have a database running. Open `backend/db/lro_backend_models.py` and update the `DATABASE_URL_ASYNC` with your database credentials.
    ```python
    DATABASE_URL_ASYNC = "postgresql+asyncpg://user:password@localhost:5432/lro_db"
    ```
4.  The database schema is defined in `backend/db/lro_backend_models.py`. You'll need to create the tables. The models file includes a helper function `create_all_tables()` for development purposes, but for a production environment, it is highly recommended to use a migration tool like Alembic.

#### 2\. Frontend Setup

1.  Navigate to the `Frontend` directory.
    ```sh
    cd Frontend
    ```
2.  Install the Node.js dependencies using pnpm.
    ```sh
    pnpm install
    ```

-----

### Running the Application

Once both the backend and frontend are configured, you can start them separately.

#### 1\. Start the Backend Server

From the `backend` directory, run the following command:

```sh
uvicorn main:app --reload
```

The backend API will be available at `http://127.0.0.1:8000`.

#### 2\. Start the Frontend Server

From the `Frontend` directory, run the following command:

```sh
pnpm dev
```

The frontend application will be available at `http://localhost:3000`.