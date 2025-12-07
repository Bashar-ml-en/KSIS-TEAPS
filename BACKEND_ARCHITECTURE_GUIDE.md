# 📘 KSIS Backend Architecture - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Core Components](#core-components)
4. [Controllers](#controllers)
5. [Models](#models)
6. [Services](#services)
7. [Routes](#routes)
8. [Database](#database)
9. [Configuration](#configuration)
10. [Why This Architecture?](#why-this-architecture)

---

## Project Overview

**Technology Stack:**
- **Framework:** Laravel 10.x (PHP 8.1+)
- **Database:** PostgreSQL
- **Authentication:** Laravel Sanctum (Token-based)
- **Architecture Pattern:** MVC + Service Layer
- **API Style:** RESTful

**Purpose:** Backend API for KSIS Teacher Evaluation and Performance System

---

## Folder Structure

```
ksis-laravel/
├── app/                    # Application core
│   ├── Http/              # HTTP layer
│   │   ├── Controllers/   # Request handlers
│   │   ├── Middleware/    # Request filters
│   │   └── Requests/      # Form validations
│   ├── Models/            # Database models (Eloquent ORM)
│   ├── Services/          # Business logic layer
│   ├── Observers/         # Model event listeners
│   └── Providers/         # Service providers
│
├── bootstrap/             # App initialization
│   └── cache/            # Framework cache
│
├── config/                # Configuration files
│   ├── app.php           # App settings
│   ├── database.php      # Database config
│   ├── cors.php          # CORS settings
│   ├── sanctum.php       # API auth config
│   └── ...
│
├── database/              # Database layer
│   ├── migrations/       # Database schema
│   ├── seeders/          # Sample data
│   └── factories/        # Test data generators
│
├── public/                # Web root (entry point)
│   └── index.php         # Application entry
│
├── resources/             # Frontend resources
│   ├── views/            # Blade templates
│   └── lang/             # Translations
│
├── routes/                # Application routes
│   ├── api.php           # API routes ⭐ MAIN
│   ├── web.php           # Web routes
│   └── channels.php      # Broadcasting
│
├── storage/               # Generated files
│   ├── app/              # Uploaded files
│   ├── logs/             # Application logs
│   └── framework/        # Framework cached data
│
├── tests/                 # Automated tests
│   ├── Feature/          # Integration tests
│   └── Unit/             # Unit tests
│
├── vendor/                # Composer dependencies
├── .env                   # Environment variables
├── composer.json          # PHP dependencies
└── artisan                # Laravel CLI tool
```

---

## Core Components

### 1. **app/Http/Controllers/** (20 Controllers)

Controllers handle HTTP requests and return responses. Each controller focuses on a specific resource.

#### **Purpose:** Separate concerns and keep code organized

| Controller | Purpose | Why Needed |
|------------|---------|------------|
| **AuthController.php** | Handles login, register, logout, profile | User authentication is the foundation of the system |
| **UserController.php** | User CRUD operations | Manage all system users |
| **TeacherController.php** | Teacher-specific operations, KPIs, evaluations | Teachers are the primary entity |
| **PrincipalController.php** | Principal dashboard, department oversight | Principals need aggregated data |
| **HrAdminController.php** | HR admin functions, system-wide reports | HR manages personnel |
| **DepartmentController.php** | Department CRUD, teacher assignments | Organize teachers by department |
| **KpiController.php** | KPI management, progress tracking | Track performance indicators |
| **KpiRequestController.php** | KPI modification requests | Teachers request KPI changes |
| **EvaluationController.php** | General evaluations | Core evaluation functionality |
| **ClassroomObservationController.php** | Observation records | Track classroom performance |
| **AnnualAppraisalController.php** | Annual performance reviews | Yearly comprehensive evaluation |
| **FeedbackController.php** | Feedback collection and analysis | Collect stakeholder input |
| **ReevaluationRequestController.php** | Re-evaluation workflow | Allow teachers to contest evaluations |
| **MycpeRecordController.php** | CPE tracking and compliance | Professional development requirements |
| **ReportController.php** | Generate reports (teacher, dept, school) | Data analytics and insights |
| **NotificationController.php** | User notifications | Keep users informed |
| **ConfigurationController.php** | System settings management | Configurable system parameters |
| **ContractController.php** | Teacher contracts | HR contract management |
| **EngagementController.php** | Engagement metrics | Track user interaction |
| **VerificationController.php** | Email verification | Secure user accounts |

#### **Code Example: Why Controller Pattern?**

```php
// app/Http/Controllers/TeacherController.php

public function index()
{
    // Controller only handles HTTP logic
    $teachers = Teacher::with('department')->paginate(20);
    return response()->json($teachers);
}

public function store(Request $request)
{
    // 1. Validate input
    $validated = $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
    ]);
    
    // 2. Create record
    $teacher = Teacher::create($validated);
    
    // 3. Return response
    return response()->json(['teacher' => $teacher], 201);
}
```

**Why?** Keeps HTTP concerns separate from business logic. Makes testing easier.

---

### 2. **app/Models/** (17 Models)

Models represent database tables using Eloquent ORM. Each model corresponds to a table.

#### **Purpose:** Interact with database using objects instead of raw SQL

| Model | Table | Purpose |
|-------|-------|---------|
| **User.php** | `users` | All users (teachers, principals, admins) |
| **Teacher.php** | References `users` with `role='teacher'` | Teacher-specific methods |
| **Principal.php** | References `users` with `role='principal'` | Principal-specific methods |
| **HrAdmin.php** | References `users` with `role='hr_admin'` | HR-specific methods |
| **Department.php** | `departments` | School departments (Math, Science, etc.) |
| **Kpi.php** | `kpis` | Key Performance Indicators |
| **KpiRequest.php** | `kpi_requests` | KPI modification requests |
| **Evaluation.php** | `evaluations` | General evaluation records |
| **ClassroomObservation.php** | `classroom_observations` | Classroom visit records |
| **AnnualAppraisal.php** | `annual_appraisals` | Yearly performance reviews |
| **AppraisalStatusHistory.php** | `appraisal_status_history` | Tracks status changes |
| **Feedback.php** | `feedbacks` | Feedback from stakeholders |
| **ReevaluationRequest.php** | `reevaluation_requests` | Re-evaluation submissions |
| **MycpeRecord.php** | `mycpe_records` | CPE activity records |
| **Notification.php** | `notifications` | User notifications |
| **SystemConfiguration.php** | `configurations` | System settings |
| **Contract.php** | `contracts` | Teacher contracts |

#### **Code Example: Model Relationships**

```php
// app/Models/Teacher.php

class Teacher extends Model
{
    // Define relationship with KPIs
    public function kpis()
    {
        return $this->hasMany(Kpi::class, 'teacher_id');
    }
    
    // Define relationship with Department
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    
    // Define relationship with Evaluations
    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'evaluatee_id');
    }
}
```

**Why?** Makes database queries intuitive:
```php
$teacher = Teacher::find(1);
$teacher->kpis;          // Get all KPIs
$teacher->department;    // Get department
$teacher->evaluations;   // Get evaluations
```

---

### 3. **app/Services/** (5 Service Folders)

Services contain business logic that doesn't belong in controllers or models.

#### **Purpose:** Complex operations, calculations, third-party integrations

| Service | Purpose | Why Separated |
|---------|---------|---------------|
| **ConfigurationService/** | Manage system configurations with versioning | Too complex for controller |
| **ScoringService/** | Calculate performance scores, weighted averages | Complex business rules |
| **ReportingService/** | Generate comprehensive reports | Data aggregation from multiple tables |
| **EvidenceService/** | Handle file uploads, evidence management | File handling logic |
| **WorkflowService/** | Manage approval workflows, state transitions | Complex state machine |

#### **Code Example: Service Layer**

```php
// app/Services/ScoringService/ScoringService.php

class ScoringService
{
    public function calculateTeacherScore($teacherId, $year)
    {
        // Complex calculation logic
        $kpiScore = $this->calculateKPIScore($teacherId, $year);
        $evaluationScore = $this->calculateEvaluationScore($teacherId, $year);
        $cpeScore = $this->calculateCPEScore($teacherId, $year);
        
        // Weighted average
        return ($kpiScore * 0.4) + 
               ($evaluationScore * 0.5) + 
               ($cpeScore * 0.1);
    }
    
    private function calculateKPIScore($teacherId, $year)
    {
        // KPI calculation logic
        $kpis = Kpi::where('teacher_id', $teacherId)
                   ->whereYear('created_at', $year)
                   ->get();
        
        return $kpis->avg('progress') * 5; // Convert to 5-point scale
    }
}
```

**Why?** Keeps controllers thin, makes testing easier, reusable across controllers.

---

### 4. **routes/api.php** - API Routes

All API endpoints are defined here. This is the **entry point** for all frontend requests.

#### **Purpose:** Map URLs to Controllers

```php
// routes/api.php

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    
    // User endpoints
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Teacher endpoints
    Route::get('teachers', [TeacherController::class, 'index']);
    Route::post('teachers', [TeacherController::class, 'store']);
    Route::get('teachers/{id}', [TeacherController::class, 'show']);
    
    // KPI endpoints
    Route::apiResource('kpis', KpiController::class);
    
    // ... and many more
});
```

**Why?** Centralized routing makes it easy to see all available endpoints.

---

### 5. **database/migrations/** - Database Schema

Migrations define database structure in code.

#### **Purpose:** Version control for database schema

```php
// database/migrations/2024_11_28_create_users_table.php

public function up()
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->string('password');
        $table->enum('role', ['teacher', 'principal', 'hr_admin']);
        $table->foreignId('department_id')->nullable()
              ->constrained()->onDelete('set null');
        $table->timestamps();
    });
}
```

**Why?** 
- Track schema changes over time
- Easy to rollback changes
- Team collaboration
- Consistent across environments

---

## Why This Architecture?

### 1. **MVC Pattern (Model-View-Controller)**

```
Request → Controller → Model → Database
                ↓
            Response
```

**Benefits:**
- ✅ Separation of concerns
- ✅ Easy to test
- ✅ Easy to maintain
- ✅ Scalable

### 2. **Service Layer Pattern**

```
Controller → Service → Model → Database
```

**Benefits:**
- ✅ Complex logic separated from HTTP
- ✅ Reusable business rules
- ✅ Easier unit testing
- ✅ Single Responsibility Principle

### 3. **RESTful API**

```
GET    /api/teachers      → List all teachers
POST   /api/teachers      → Create teacher
GET    /api/teachers/{id} → Get specific teacher
PUT    /api/teachers/{id} → Update teacher
DELETE /api/teachers/{id} → Delete teacher
```

**Benefits:**
- ✅ Standard conventions
- ✅ Predictable endpoints
- ✅ Easy for frontend to consume
- ✅ Works with any client (web, mobile)

### 4. **Token-based Authentication (Sanctum)**

```
Login → Receive Token → Include Token in Headers → Access Protected Routes
```

**Benefits:**
- ✅ Stateless (no sessions)
- ✅ Works for web and mobile
- ✅ Secure
- ✅ Scalable

---

## Key Design Decisions

### 1. **Why Laravel?**
- ✅ Built-in authentication
- ✅ Eloquent ORM (easy database access)
- ✅ Migration system
- ✅ Artisan CLI
- ✅ Large ecosystem
- ✅ Great documentation

### 2. **Why PostgreSQL?**
- ✅ Robust and reliable
- ✅ Advanced features (JSON, arrays)
- ✅ Good performance
- ✅ FREE and open-source

### 3. **Why Token Authentication?**
- ✅ Stateless (better for scaling)
- ✅ Works for API clients
- ✅ Mobile-ready
- ✅ No cookie dependencies

### 4. **Why Service Layer?**
- ✅ Keep controllers thin
- ✅ Reusable logic
- ✅ Testable
- ✅ Maintainable

---

## Request Flow Example

### Example: Teacher creates CPE record

```
1. Frontend: POST /api/mycpe-records
   Headers: { Authorization: Bearer token123 }
   Body: { title: "Workshop", hours: 8, ... }

2. Laravel Routing (routes/api.php):
   Route matches: POST /mycpe-records → MycpeRecordController@store
   
3. Middleware:
   - auth:sanctum → Validates token → Gets user
   
4. Controller (MycpeRecordController.php):
   - Validates input
   - Calls: MycpeRecord::create($data)
   
5. Model (MycpeRecord.php):
   - Inserts into 'mycpe_records' table
   
6. Database:
   - Row created with ID=123
   
7. Controller returns:
   { "record": { "id": 123, "title": "Workshop", ... } }
   
8. Frontend receives data and updates UI
```

---

## Database Schema Overview

### Core Tables:

1. **users** - All users (teachers, principals, admins)
2. **departments** - School departments
3. **kpis** - Performance indicators
4. **evaluations** - General evaluations
5. **classroom_observations** - Classroom visits
6. **annual_appraisals** - Yearly reviews
7. **feedbacks** - Stakeholder feedback
8. **reevaluation_requests** - Contest evaluations
9. **mycpe_records** - Professional development
10. **notifications** - User notifications
11. **configurations** - System settings
12. **contracts** - Teacher contracts

### Relationships:

```
users (1) → (many) kpis
users (1) → (many) evaluations
users (1) → (many) mycpe_records
departments (1) → (many) users
annual_appraisals (many) → (1) users
```

---

## Why Each File Exists

### Configuration Files:

| File | Purpose |
|------|---------|
| `.env` | Environment-specific settings (DB credentials, app URL) |
| `config/database.php` | Database connection settings |
| `config/cors.php` | Allow frontend to access API |
| `config/sanctum.php` | Token authentication settings |
| `config/app.php` | General app settings (timezone, locale) |

### Root Files:

| File | Purpose |
|------|---------|
| `artisan` | Laravel CLI tool (`php artisan serve`, `php artisan migrate`) |
| `composer.json` | PHP dependencies (Laravel, packages) |
| `.gitignore` | Files to exclude from git (vendor/, .env) |
| `README.md` | Project documentation |
| `phpunit.xml` | Testing configuration |

---

## Security Features

### 1. **Authentication**
- Token-based (Sanctum)
- Password hashing (bcrypt)
- CSRF protection

### 2. **Authorization**
- Role-based access control
- Middleware protection
- Route-level permissions

### 3. **Validation**
- Input validation on all endpoints
- SQL injection prevention (Eloquent)
- XSS protection

### 4. **Best Practices**
- Environment variables for secrets
- HTTPS enforcement
- Rate limiting
- CORS configuration

---

## Performance Optimizations

### 1. **Database**
- ✅ Indexes on foreign keys
- ✅ Eager loading (prevent N+1 queries)
- ✅ Pagination for large datasets

### 2. **Caching**
- ✅ Route caching
- ✅ Configuration caching
- ✅ Query result caching

### 3. **API**
- ✅ Resource transformation
- ✅ Partial responses
- ✅ Compression

---

## Summary

**This backend architecture provides:**

1. ✅ **Clear organization** - Easy to find code
2. ✅ **Separation of concerns** - Each file has one job
3. ✅ **Testability** - Unit and integration tests
4. ✅ **Scalability** - Can handle growth
5. ✅ **Security** - Protected by default
6. ✅ **Maintainability** - Easy to update
7. ✅ **Documentation** - Self-documenting code
8. ✅ **Mobile-ready** - RESTful API works anywhere

**Next:** See `MOBILE_SCALING_GUIDE.md` for how to convert this to a mobile app! 📱
