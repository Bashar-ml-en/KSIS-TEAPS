# 🧪 KSIS Manual Testing Guide - Complete Workflow

## 📋 Testing Objective
Test the complete system workflow:
1. ✅ Register as Teacher
2. ✅ Login as Principal → Review & Approve KPI → Give Feedback
3. ✅ Login as HR Admin → View System Performance

---

## 🚀 Before You Start

### ✅ Pre-requisites:
- [ ] Backend running: http://localhost:8000 ✅
- [ ] Frontend running: http://localhost:3001 ✅
- [ ] Database connected ✅
- [ ] Admin account exists: `admin@ksis.edu.kw` / `admin123`

### 🌐 Application URLs:
- **Frontend:** http://localhost:3001 (Use this for testing!)
- **Backend API:** http://localhost:8000/api (Don't access directly)

---

## 📝 Complete Testing Workflow

### ══════════════════════════════════════════════════════
### PHASE 1: Register as New Teacher
### ══════════════════════════════════════════════════════

#### Step 1.1: Create Teacher Account (via HR Admin)

**Why?** Teachers can't self-register for security. HR Admin creates accounts.

1. **Open Application:**
   - Go to: http://localhost:3001
   - You should see the login screen

2. **Login as HR Admin:**
   - Email: `admin@ksis.edu.kw`
   - Password: `admin123`
   - Click "Login"

3. **Go to User Management:**
   - Click "User Management" in sidebar
   - Or click "Add Teacher" if available

4. **Add New Teacher:**
   - Click "Add User" or "Add Teacher" button
   - Fill in details:
     ```
     Name: John Smith
     Email: john.smith@ksis.edu.kw
     Role: Teacher
     Department: (Select one, e.g., Mathematics)
     Password: teacher123
     ```
   - Click "Create" or "Add Teacher"
   - ✅ Teacher account created!

5. **Logout (Admin):**
   - Scroll down sidebar (left side)
   - Click "Logout"

---

#### Step 1.2: Login as Teacher

1. **Login:**
   - Email: `john.smith@ksis.edu.kw`
   - Password: `teacher123`
   - Click "Login"

2. **Explore Teacher Dashboard:**
   - See your dashboard
   - Upload profile picture (top-right corner)
   - View your KPIs
   - Check notifications

3. **Create/Update KPI (if available):**
   - Go to "KPI Information" or "KPI Calculation"
   - View existing KPIs
   - Update progress if possible
   - Note: KPIs might be pre-assigned or need to be created by admin

4. **Check CPE Records:**
   - Go to "Attendance" or "CPE Management"
   - Add CPE activity:
     ```
     Activity Type: Workshop
     Title: "Teaching Excellence Workshop"
     Organizer: "Education Board"
     Start Date: (Select date)
     End Date: (Select date)
     Hours: 8
     ```
   - Click "Submit"
   - Status: Pending (waiting for principal approval)

5. **Request Re-evaluation (Optional):**
   - Go to "Re-evaluation"
   - Submit a re-evaluation request if you have evaluations
   - Provide reason

6. **Logout (Teacher):**
   - Scroll down sidebar
   - Click "Logout"

---

### ══════════════════════════════════════════════════════
### PHASE 2: Create Principal Account & Review
### ══════════════════════════════════════════════════════

#### Step 2.1: Create Principal Account

1. **Login as HR Admin:**
   - Email: `admin@ksis.edu.kw`
   - Password: `admin123`

2. **Add Principal:**
   - Go to "User Management"
   - Click "Add User"
   - Fill in:
     ```
     Name: Sarah Johnson
     Email: principal@ksis.edu.kw
     Role: Principal
     Department: (Any/All)
     Password: principal123
     ```
   - Click "Create"
   - ✅ Principal created!

3. **Logout (Admin):**
   - Sidebar → Logout

---

#### Step 2.2: Login as Principal & Review Teacher

1. **Login as Principal:**
   - Email: `principal@ksis.edu.kw`
   - Password: `principal123`

2. **View Principal Dashboard:**
   - See department overview
   - View teacher statistics
   - Check pending evaluations

3. **Review Teacher KPIs:**
   - Go to "KPI Information" or "Teachers"
   - Find John Smith (the teacher you created)
   - Click to view their KPIs
   - Review KPI progress

4. **Approve CPE Record:**
   - Go to "Attendance" or "CPE Management"
   - See John Smith's CPE record (Pending)
   - Click ✓ (approve button)
   - Status changes to "Approved"
   - ✅ CPE approved!

5. **Provide Evaluation/Feedback:**
   - Go to "Evaluation" or "Teacher Evaluation"
   - Select John Smith
   - Fill evaluation form:
     ```
     Teaching Quality: (Select rating)
     Student Engagement: (Select rating)
     Professional Development: (Select rating)
     Comments: "Excellent progress. Shows dedication..."
     ```
   - Click "Submit Evaluation"
   - ✅ Feedback given!

6. **Review Re-evaluation Request** (if exists):
   - Go to "Re-evaluation"
   - See John Smith's request
   - Approve or provide feedback

7. **Logout (Principal):**
   - Sidebar → Logout

---

### ══════════════════════════════════════════════════════
### PHASE 3: HR Admin - View System Performance
### ══════════════════════════════════════════════════════

#### Step 3.1: Login as HR Admin

1. **Login:**
   - Email: `admin@ksis.edu.kw`
   - Password: `admin123`

2. **View Admin Dashboard:**
   - See total users
   - Active evaluations count
   - System status
   - Recent notifications

---

#### Step 3.2: Check Reports & Analytics

1. **Go to Reports:**
   - Click "Reports" in sidebar
   - See school-wide performance

2. **View Performance Metrics:**
   - Total Teachers: Should show John Smith
   - Average Score: See evaluation scores
   - KPI Completion: View progress
   - CPE Compliance: Check John Smith's CPE status

3. **Check Department Rankings:**
   - See which departments performing best
   - View average scores

4. **Export Report** (Optional):
   - Click "Export Report" button
   - Download CSV file
   - Open in Excel/Google Sheets

---

#### Step 3.3: Review System Health

1. **User Management:**
   - Go to "User Management"
   - See all users:
     - Admin (you)
     - John Smith (Teacher)
     - Sarah Johnson (Principal)
   - Check user stats

2. **System Settings:**
   - Go to "System Settings"
   - Review configurations
   - All settings should be loaded

3. **Notifications:**
   - Click bell icon (top-right)
   - Check notifications about:
     - Teacher added
     - CPE submitted
     - CPE approved
     - Evaluation submitted

4. **Profile Picture:**
   - Click profile icon (top-right)
   - Upload your picture
   - See it display in header

---

## ✅ Testing Checklist

### Phase 1: Teacher (John Smith)
- [ ] Login successful
- [ ] Dashboard loads
- [ ] Profile picture upload works
- [ ] Can view KPIs
- [ ] Can submit CPE record
- [ ] Can request re-evaluation
- [ ] Notifications show
- [ ] Logout works

### Phase 2: Principal (Sarah Johnson)
- [ ] Login successful
- [ ] Can view teachers list
- [ ] Can see John Smith's KPIs
- [ ] Can approve CPE records
- [ ] Can submit evaluations
- [ ] Can provide feedback
- [ ] Dashboard shows statistics
- [ ] Logout works

### Phase 3: HR Admin
- [ ] Login successful
- [ ] Dashboard shows all stats
- [ ] Reports load with real data
- [ ] Can see John Smith in reports
- [ ] Can export CSV
- [ ] System settings work
- [ ] User management shows all users
- [ ] Notifications show all activities
- [ ] Logout works

---

## 🎯 Expected Results

### What You Should See:

**Teacher Dashboard:**
- John Smith's name
- KPI list
- Evaluation history
- CPE records (1 pending → 1 approved)

**Principal Dashboard:**
- Teachers list (John Smith)
- Pending approvals
- Department overview
- Evaluation forms

**HR Admin Dashboard:**
- Total users: 3
- Total teachers: 1
- System notifications
- Performance reports showing John Smith's data

---

## 🔧 Troubleshooting

### If Login Fails:
- Check you're on http://localhost:3001 (NOT :8000/api)
- Clear browser cache
- Check backend is running
- Verify credentials

### If Pages Don't Load:
- Check browser console (F12)
- Verify frontend is running on port 3001
- Refresh page (Ctrl+Shift+R)

### If Features Don't Work:
- Check backend logs: `ksis-laravel/storage/logs/laravel.log`
- Verify database connection
- Check API endpoints accessible

### If 404 Error:
- Make sure you're on http://localhost:3001 (frontend)
- NOT http://localhost:8000/api (backend API)
- Frontend URL is the correct one

---

## 📊 Data Flow Testing

This workflow tests:

1. **User Management:**
   - Create teacher ✅
   - Create principal ✅
   - View in system ✅

2. **KPI System:**
   - Assign KPIs ✅
   - Track progress ✅
   - View reports ✅

3. **CPE Management:**
   - Submit CPE ✅
   - Approve CPE ✅
   - Track compliance ✅

4. **Evaluation System:**
   - Submit evaluation ✅
   - Provide feedback ✅
   - View results ✅

5. **Reporting:**
   - Generate reports ✅
   - Export data ✅
   - View analytics ✅

6. **Notifications:**
   - Activity notifications ✅
   - Real-time updates ✅
   - Mark as read ✅

---

## 🎉 Success Criteria

### ✅ Test Passes If:
- All 3 users can login
- Teacher can submit CPE
- Principal can approve and evaluate
- HR Admin can see all data in reports
- No errors in browser console
- All features work smoothly

### ❌ Test Fails If:
- Login doesn't work
- Pages crash/error
- Data doesn't save
- Reports don't show data
- Features are missing

---

## 🌐 Quick Reference

### Login Credentials:

| Role | Email | Password |
|------|-------|----------|
| **HR Admin** | admin@ksis.edu.kw | admin123 |
| **Teacher** | john.smith@ksis.edu.kw | teacher123 |
| **Principal** | principal@ksis.edu.kw | principal123 |

### URLs:
- **App:** http://localhost:3001
- **API:** http://localhost:8000/api

### Logout:
- **Location:** Sidebar (bottom-left)
- **Not in:** Profile dropdown

---

## 📝 Notes

- This tests the **complete E2E workflow**
- All data is real and saved to database
- Each role has different permissions
- Testing validates: Create → Review → Approve → Report
- No external tools needed!

---

**Ready to test! Start with Phase 1! 🚀**

**Open:** http://localhost:3001  
**Login as:** admin@ksis.edu.kw  
**Begin testing!** ✅
