# 🧪 Complete Backend Testing Guide

## 📋 Testing Checklist

Use this guide to test all backend features for the three user roles: HR Admin, Principal, and Teacher.

---

## 🔧 Pre-Testing Setup

1. **Ensure Backend is Running**
   - Server: `http://127.0.0.1:8000`
   - Check: Open `http://127.0.0.1:8000/up` in browser (should see health check)

2. **Open Testing Dashboard**
   - File: `C:\Backend(KSIS)\testing-dashboard.html`
   - Open in Chrome/Edge for best results

---

## 👤 Role 1: HR Admin Testing

**Login Credentials:** `hr@ksis.edu.kw` / `password123`

### ✅ Features to Test

#### 1. User Management
- [ ] **View All Users**
  - Go to Login tab → Click "Login as HR"
  - After login, test: `GET /api/users`
  - Should return list of all users

- [ ] **Create New User**
  - Go to Register tab
  - Fill in: Name, Email, Password, Role
  - Click "Register User"
  - Verify: User created successfully

- [ ] **Update User**
  - Test: `PUT /api/users/{id}`
  - Update user details
  - Verify: Changes saved

- [ ] **Delete User**
  - Test: `DELETE /api/users/{id}`
  - Verify: User removed

#### 2. Department Management
- [ ] **View Departments**
  - Test: `GET /api/departments`
  - Should show: Curriculum, Student Affairs, Co-curriculum

- [ ] **Create Department**
  - Test: `POST /api/departments`
  - Add new department
  - Verify: Department created

- [ ] **Assign Users to Departments**
  - Test: `POST /api/departments/{id}/users`
  - Assign teacher to department
  - Verify: Assignment successful

#### 3. KPI Management
- [ ] **View All KPIs**
  - Go to KPI tab
  - Click "View All KPIs"
  - Should show: All system KPIs

- [ ] **Create New KPI**
  - Click "Create New KPI"
  - Fill in: Name, Description, Target Value, Category
  - Click "Create KPI"
  - Verify: KPI created

- [ ] **Approve KPI Requests**
  - Test: `GET /api/kpi-requests`
  - View pending requests
  - Test: `PUT /api/kpi-requests/{id}/approve`
  - Approve/reject requests

#### 4. Contract Management
- [ ] **View Contracts**
  - Test: `GET /api/contracts`
  - View all employment contracts

- [ ] **Create Contract**
  - Test: `POST /api/contracts`
  - Create new contract for teacher
  - Verify: Contract created

#### 5. System Configuration
- [ ] **View Settings**
  - Test: `GET /api/system-configurations`
  - View system settings

- [ ] **Update Settings**
  - Test: `PUT /api/system-configurations`
  - Change system configurations
  - Verify: Settings updated

#### 6. Reports & Analytics
- [ ] **Performance Reports**
  - Test: `GET /api/annual-appraisals`
  - View all appraisals across departments

- [ ] **Department Analytics**
  - Test: `GET /api/departments/{id}/analytics`
  - View department performance

---

## 🎓 Role 2: Principal Testing

**Login Credentials:** `principal@ksis.edu.kw` / `password123`

### ✅ Features to Test

#### 1. Teacher Management
- [ ] **View Department Teachers**
  - Test: `GET /api/teachers`
  - Filter by department
  - Should show teachers in principal's department

- [ ] **Assign Responsibilities**
  - Test: `POST /api/teachers/{id}/assign`
  - Assign KPI responsibilities
  - Verify: Assignment successful

#### 2. Classroom Observations
- [ ] **Schedule Observation**
  - Test: `POST /api/classroom-observations`
  - Create observation for teacher
  - Fields: teacher_id, date, classroom, subject

- [ ] **Record Observation**
  - Test: `PUT /api/classroom-observations/{id}`
  - Add observation notes and scores
  - Verify: Observation saved

- [ ] **View Observations**
  - Test: `GET /api/classroom-observations`
  - Filter by teacher, date, status
  - Should show all observations

#### 3. Annual Appraisals  
- [ ] **Create Appraisal**
  - Test: `POST /api/annual-appraisals`
  - Create new appraisal for teacher
  - Set review period and status

- [ ] **Score KPIs**
  - Test: `PUT /api/annual-appraisals/{id}/scores`
  - Add scores for each KPI
  - Include comments and evidence

- [ ] **Submit for Review**
  - Test: `POST /api/annual-appraisals/{id}/submit`
  - Submit completed appraisal
  - Verify: Status changes to "submitted"

- [ ] **View Appraisal History**
  - Test: `GET /api/teachers/{id}/appraisals`
  - View teacher's historical performance

#### 4. KPI Requests
- [ ] **Request KPI Change**
  - Test: `POST /api/kpi-requests`
  - Request modification to KPI
  - Provide justification

- [ ] **View Request Status**
  - Test: `GET /api/kpi-requests`
  - Check status of submitted requests

#### 5. Feedback & Communication
- [ ] **View Teacher Feedback**
  - Go to Feedback tab
  - Click "View All Feedback"
  - Should show feedback from students/colleagues

- [ ] **Provide Feedback**
  - Click "Submit Feedback"
  - Write feedback for teacher
  - Rate 1-5 stars
  - Verify: Feedback submitted

#### 6. MyCPE Review
- [ ] **Review CPE Records**
  - Test: `GET /api/mycpe-records`
  - View teacher professional development

- [ ] **Verify CPE Hours**
  - Test: `PUT /api/mycpe-records/{id}/verify`
  - Approve CPE activities
  - Verify: Status updated

---

## 📚 Role 3: Teacher Testing

**Login Credentials:** `sarah.teacher@ksis.edu.kw` / `password123`

### ✅ Features to Test

#### 1. Profile & Dashboard
- [ ] **View Profile**
  - Test: `GET /api/profile`
  - Should show: Name, email, department, role

- [ ] **Update Profile**
  - Test: `PUT /api/profile`
  - Update contact information
  - Verify: Changes saved

#### 2. My KPIs
- [ ] **View Assigned KPIs**
  - Test: `GET /api/my-kpis`
  - Should show: KPIs assigned to teacher

- [ ] **Track Progress**
  - Test: `GET /api/my-kpis/{id}/progress`
  - View progress towards targets

- [ ] **Request KPI Modification**
  - Test: `POST /api/kpi-requests`
  - Request change to assigned KPI
  - Provide reason and proposed value

#### 3. MyCPE (Professional Development)
- [ ] **View CPE Records**
  - Test: `GET /api/my-cpe`
  - See all professional development activities

- [ ] **Add CPE Activity**
  - Test: `POST /api/mycpe-records`
  - Fields: title, description, hours, date, type
  - Upload evidence (certificate/proof)

- [ ] **Track CPE Hours**
  - Test: `GET /api/my-cpe/summary`
  - View total hours by year/category

#### 4. Classroom Observations
- [ ] **View My Observations**
  - Test: `GET /api/my-observations`
  - See scheduled and completed observations

- [ ] **View Observation Results**
  - Test: `GET /api/classroom-observations/{id}`
  - Read principal's feedback and scores

#### 5. Annual Appraisals
- [ ] **View My Appraisals**
  - Test: `GET /api/my-appraisals`
  - See current and historical appraisals

- [ ] **Self-Assessment**
  - Test: `POST /api/annual-appraisals/{id}/self-assessment`
  - Complete self-evaluation
  - Provide evidence for achievements

- [ ] **Request Re-evaluation**
  - Test: `POST /api/reevaluation-requests`
  - Request review of appraisal score
  - Provide justification

#### 6. Feedback
- [ ] **View Feedback Received**
  - Go to Feedback tab
  - Should see feedback from principal/peers

- [ ] **Provide Peer Feedback**
  - Submit feedback for colleague
  - Test collaboration assessment

#### 7. Notifications
- [ ] **View Notifications**
  - Test: `GET /api/notifications`
  - Should show: Upcoming observations, appraisal deadlines, feedback

- [ ] **Mark as Read**
  - Test: `PUT /api/notifications/{id}/read`
  - Clear notification
  - Verify: Status updated

---

## 🔍 Advanced Testing: Feedback Analysis

### NLP Sentiment Analysis

**Note:** This requires the NLP service running on port 5000. Since it's optional, test if available.

- [ ] **Analyze Feedback Content**
  - Go to Feedback tab
  - Click "Analyze Feedback"
  - Should return: Sentiment score, key topics, suggestions

- [ ] **Test Various Inputs**
  - Positive feedback: "Excellent teacher, very engaging"
  - Negative feedback: "Too fast, hard to follow"
  - Mixed feedback: "Good concepts but needs improvement"

---

## 📊 Database Verification

### Check Data Integrity

Use testing dashboard or database client (pgAdmin, DBeaver):

- [ ] **Users Table**
  - Verify: 4 users exist
  - Check: Passwords are hashed
  - Confirm: Roles assigned correctly

- [ ] **Departments Table**
  - Verify: 3+ departments exist
  - Check: Parent-child relationships work

- [ ] **KPIs Table**
  - Verify: Multiple KPIs created
  - Check: Target values set
  - Confirm: Categories assigned

- [ ] **Relationships**
  - User → Department
  - Teacher → Appraisals
  - Appraisal → KPI Scores
  - Observation → Teacher

---

## 🎯 End-to-End Workflow Tests

### Scenario 1: New Teacher Onboarding
1. HR Admin creates teacher account
2. HR Admin assigns to department
3. HR Admin creates contract
4. Principal assigns KPIs to teacher
5. Teacher logs in and views assignments

### Scenario 2: Annual Appraisal Cycle
1. Principal creates appraisal for teacher
2. Teacher completes self-assessment
3. Principal schedules classroom observation
4. Principal records observation results
5. Principal scores KPIs with evidence
6. Principal submits appraisal for HR review
7. HR Admin approves appraisal
8. Teacher views final results

### Scenario 3: KPI Modification Request
1. Teacher requests KPI change
2. Principal reviews and forwards to HR
3. HR Admin approves/rejects request
4. Teacher receives notification
5. KPI updated in system

### Scenario 4: CPE Tracking
1. Teacher adds CPE activity
2. Teacher uploads certificate
3. Principal verifies CPE hours
4. System updates teacher's CPE total
5. Report shows teacher met annual requirement

---

## ✅ Success Criteria

All tests pass if:
- ✅ All API endpoints return 200/201 responses
- ✅ Data persists correctly in database
- ✅ Role-based access control works (teachers can't access HR functions)
- ✅ Relationships between entities are maintained
- ✅ Notifications are sent appropriately
- ✅ Authentication tokens work across requests
- ✅ Error handling returns meaningful messages

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Re-login to get fresh token |
| **404 Not Found** | Check API endpoint spelling |
| **500 Server Error** | Check server logs, verify database connection |
| **Missing APP_KEY** | Run `php artisan key:generate` |
| **Database connection failed** | Verify PostgreSQL is running |

---

## 📝 Testing Log Template

Use this to track your testing:

```
Date: ___________
Tester: ___________

HR Admin Tests: [ ] Complete
Principal Tests: [ ] Complete  
Teacher Tests: [ ] Complete
Database Verification: [ ] Complete
E2E Workflows: [ ] Complete

Issues Found:
1. _______________
2. _______________

Notes:
_______________
```

---

## 🚀 Quick Test Script

For rapid testing without the dashboard:

```bash
# Health Check
curl http://127.0.0.1:8000/up

# Login
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@ksis.edu.kw","password":"password123"}'

# Get Users (replace TOKEN)
curl http://127.0.0.1:8000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# View KPIs
curl http://127.0.0.1:8000/api/kpis \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📞 Support

If you encounter issues during testing:
1. Check server logs in terminal
2. Verify database connection
3. Clear cache: `php artisan config:clear`
4. Restart server if needed

**Happy Testing!** 🎉
