// assets/js/auth.js
function requireRole(role) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    alert("Please log in first.");
    window.location.href = "../pages/login.html";
    return null;
  }
  if (role && user.role !== role) {
    alert(`Access denied. Only ${role}s can view this page.`);
    window.location.href = "../pages/login.html";
    return null;
  }
  return user;
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = "../pages/login.html";
}
