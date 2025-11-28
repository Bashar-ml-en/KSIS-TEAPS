# KSIS Backend API - Test Credentials

## Authentication Endpoints

### Login
**POST** `/api/login`

### Test Users Created by Seeder

#### HR Admin
- **Email**: `hr@ksis.edu.kw`
- **Password**: `password123`
- **Role**: `hr_admin`
- **Permissions**: Full access to all endpoints

#### Principal  
- **Email**: `principal@ksis.edu.kw`
- **Password**: `password123`
- **Role**: `principal`
- **Permissions**: Create/review evaluations, classroom observations, approve KPI requests

#### Teacher 1 (Math Department)
- **Email**: `sarah.teacher@ksis.edu.kw`
- **Password**: `password123`
- **Role**: `teacher`
- **Department**: Mathematics
- **Permissions**: View/update own data, submit evaluations and CPE records

#### Teacher 2 (Science Department)
- **Email**: `ahmed.teacher@ksis.edu.kw`
- **Password**: `password123`
- **Role**: `teacher`
- **Department**: Science
- **Permissions**: View/update own data, submit evaluations and CPE records

---

## API Endpoints Summary

### Authentication (Public)
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout (auth required)
- `GET /api/profile` - View profile (auth required)

### Departments
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create department
- `GET /api/departments/{id}` - View department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete department
- `GET /api/departments/{id}/teachers` - List department teachers

### Teachers
- `GET /api/teachers` - List all teachers (all roles)
- `POST /api/teachers` - Create teacher (HR Admin, Principal only)
- `GET /api/teachers/{id}` - View teacher details
- `PUT /api/teachers/{id}` - Update teacher (HR Admin, Principal only)
- `DELETE /api/teachers/{id}` - Delete teacher (HR Admin, Principal only)
- `GET /api/teachers/{id}/kpis` - View teacher's KPIs
- `GET /api/teachers/{id}/evaluations` - View teacher's evaluations

### Principals
- `GET /api/principals` - List all principals (all roles)
- `POST /api/principals` - Create principal (HR Admin only)
- `GET /api/principals/{id}` - View principal details
- `PUT /api/principals/{id}` - Update principal (HR Admin only)
- `DELETE /api/principals/{id}` - Delete principal (HR Admin only)
- `GET /api/principals/{id}/evaluations` - View principal's evaluations
- `GET /api/principals/{id}/classroom-observations` - View principal's observations

### HR Admins
- `GET /api/hr-admins` - List all HR admins (HR Admin only)
- `POST /api/hr-admins` - Create HR admin (HR Admin only)
- `GET /api/hr-admins/{id}` - View HR admin details (HR Admin only)
- `PUT /api/hr-admins/{id}` - Update HR admin (HR Admin only)
- `DELETE /api/hr-admins/{id}` - Delete HR admin (HR Admin only)
- `GET /api/hr-admins/{id}/reviewed-evaluations` - View reviewed evaluations (HR Admin only)

### KPIs
- `GET /api/kpis` - List KPIs (filtered by role)
- `POST /api/kpis` - Create KPI
- `GET /api/kpis/{id}` - View KPI
- `PUT /api/kpis/{id}` - Update KPI
- `DELETE /api/kpis/{id}` - Delete KPI
- `POST /api/kpis/{id}/progress` - Update KPI progress

### KPI Requests
- `GET /api/kpi-requests` - List KPI requests
- `POST /api/kpi-requests` - Create KPI request
- `GET /api/kpi-requests/{id}` - View KPI request
- `POST /api/kpi-requests/{id}/approve` - Approve request (Principal, HR Admin only)
- `POST /api/kpi-requests/{id}/reject` - Reject request (Principal, HR Admin only)

### Classroom Observations
- `GET /api/classroom-observations` - List observations (role-filtered)
- `POST /api/classroom-observations` - Create observation (Principal, HR Admin only)
- `GET /api/classroom-observations/{id}` - View observation
- `PUT /api/classroom-observations/{id}` - Update observation (Principal, HR Admin only)
- `DELETE /api/classroom-observations/{id}` - Delete observation (Principal, HR Admin only)
- `POST /api/classroom-observations/{id}/complete` - Mark as completed (Principal, HR Admin only)

### Annual Appraisals
- `GET /api/annual-appraisals` - List appraisals (role-filtered)
- `POST /api/annual-appraisals` - Create appraisal (Principal, HR Admin only)
- `GET /api/annual-appraisals/{id}` - View appraisal
- `PUT /api/annual-appraisals/{id}` - Update appraisal (Principal, HR Admin only)
- `DELETE /api/annual-appraisals/{id}` - Delete appraisal (HR Admin only)
- `POST /api/annual-appraisals/{id}/submit` - Teacher submits self-appraisal (Teacher only)
- `POST /api/annual-appraisals/{id}/principal-review` - Principal reviews (Principal only)
- `POST /api/annual-appraisals/{id}/hr-review` - HR finalizes (HR Admin only)

### MyCPE Records
- `GET /api/mycpe-records` - List CPE records (role-filtered)
- `POST /api/mycpe-records` - Create CPE record (Teacher only)
- `GET /api/mycpe-records/{id}` - View CPE record
- `PUT /api/mycpe-records/{id}` - Update CPE record (Teacher only)
- `DELETE /api/mycpe-records/{id}` - Delete CPE record (Teacher only)
- `POST /api/mycpe-records/{id}/approve` - Approve/reject record (Principal, HR Admin only)

### Re-evaluation Requests
- `GET /api/reevaluation-requests` - List requests (role-filtered)
- `POST /api/reevaluation-requests` - Create request (Teacher only)
- `GET /api/reevaluation-requests/{id}` - View request
- `PUT /api/reevaluation-requests/{id}` - Update request (Teacher only)
- `DELETE /api/reevaluation-requests/{id}` - Cancel request (Teacher only)
- `POST /api/reevaluation-requests/{id}/submit` - Submit request (Teacher only)
- `POST /api/reevaluation-requests/{id}/review` - Review request (Principal, HR Admin only)

### Evaluations
- `GET /api/evaluations` - List evaluations
- `POST /api/evaluations` - Create evaluation
- `GET /api/evaluations/{id}` - View evaluation
- `PUT /api/evaluations/{id}` - Update evaluation
- `DELETE /api/evaluations/{id}` - Delete evaluation
- `POST /api/evaluations/{id}/submit` - Submit to HR
- `POST /api/evaluations/{id}/review` - HR review (HR Admin only)

### Feedback
- `GET /api/feedback` - List feedback
- `POST /api/feedback` - Create feedback
- `GET /api/feedback/{id}` - View feedback
- `POST /api/feedback/{id}/analyze` - Analyze feedback with NLP

### Notifications
- `GET /api/notifications` - List notifications
- `GET /api/notifications/unread-count` - Get unread count
- `POST /api/notifications/{id}/mark-as-read` - Mark as read
- `POST /api/notifications/mark-all-as-read` - Mark all as read

---

## Authorization Summary

### Teacher Role
- Can view/update own data only
- Can create KPIs, MyCPE records, re-evaluation requests
- Can submit annual self-appraisals
- Cannot manage other users or approve requests

### Principal Role
- All Teacher permissions
- Can create/manage classroom observations
- Can create/review annual appraisals
- Can approve/reject KPI and re-evaluation requests
- Can create teachers
- Cannot manage principals or HR admins

### HR Admin Role
- Full system access
- Can manage all users (teachers, principals, HR admins)
- Can finalize annual appraisals
- Can approve/reject all requests
- Can delete evaluations and appraisals

---

## Testing the API

### Example: Login as HR Admin
```powershell
$response = Invoke-WebRequest -Uri 'http://localhost:8888/api/login' -Method POST -Headers @{'Content-Type'='application/json'} -Body '{"email":"hr@ksis.edu.kw","password":"password123"}'
$data = $response.Content | ConvertFrom-Json
$token = $data.access_token
```

### Example: List Teachers (with auth token)
```powershell
$headers = @{
    'Authorization' = "Bearer $token"
    'Accept' = 'application/json'
}
Invoke-WebRequest -Uri 'http://localhost:8888/api/teachers' -Headers $headers
```

### Example: Create Classroom Observation (Principal only)
```powershell
$body = @{
    teacher_id = 1
    principal_id = 1
    observation_date = "2025-11-26"
    subject = "Algebra"
    grade_level = "Grade 10"
    lesson_topic = "Quadratic Equations"
    introduction_score = 8
    content_score = 9
    engagement_score = 8
} | ConvertTo-Json

Invoke-WebRequest -Uri 'http://localhost:8888/api/classroom-observations' -Method POST -Headers $headers -Body $body
```

---

## Backend Status: ✅ COMPLETE

All 15 controllers implemented with comprehensive role-based access control!
