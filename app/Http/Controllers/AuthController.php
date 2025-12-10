<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:teacher,principal,hr_admin',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        // Auto-create teacher profile if role is teacher
        if ($validated['role'] === 'teacher') {
            $departmentId = $validated['department_id'] ?? 1; // Default to department 1 if not provided
            
            \App\Models\Teacher::create([
                'user_id' => $user->id,
                'department_id' => $departmentId,
                'employee_id' => 'T' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'full_name' => $validated['name'],
                'is_active' => true,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Login attempt', $request->all());

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();
        
        \Illuminate\Support\Facades\Log::info('User found', ['user' => $user]);

        if (!$user) {
            \Illuminate\Support\Facades\Log::info('User not found');
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $check = Hash::check($request->password, $user->password);
        \Illuminate\Support\Facades\Log::info('Hash check', ['match' => $check]);

        if (!$check) {
             \Illuminate\Support\Facades\Log::info('Password mismatch');
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        \Illuminate\Support\Facades\Log::info('Login success', ['user_id' => $user->id]);

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get all users
     */
    public function index(Request $request)
    {
        $users = \App\Models\User::with(['teacher', 'principal', 'hrAdmin'])->get();
        return response()->json($users);
    }

    /**
     * Get user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        
        // Load teacher relationship if user is a teacher
        $teacher = null;
        $department = null;
        $teacherId = null;
        
        if ($user->role === 'teacher') {
            $teacher = \App\Models\Teacher::with('department')->where('user_id', $user->id)->first();
            
            // SELF-HEALING: If teacher profile is missing, create it automatically
            if (!$teacher) {
                // Ensure at least one department exists
                $defaultDept = \App\Models\Department::first();
                if (!$defaultDept) {
                    $defaultDept = \App\Models\Department::create([
                        'name' => 'General Department',
                        'code' => 'GEN', 
                        'description' => 'Default Department',
                        'is_active' => true
                    ]);
                }

                $teacher = \App\Models\Teacher::create([
                    'user_id' => $user->id,
                    'department_id' => $defaultDept->id,
                    'employee_id' => 'T' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                    'full_name' => $user->name,
                    'is_active' => true,
                ]);
                
                // Refresh teacher with department
                $teacher = \App\Models\Teacher::with('department')->find($teacher->id);
            }

            if ($teacher) {
                $teacherId = $teacher->id;
                $department = $teacher->department;
            }
        }
        
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'profile_photo_path' => $user->profile_photo_path,
            'profile_photo_url' => $user->profile_photo_path ? asset('storage/' . $user->profile_photo_path) : null,
            'teacher_id' => $teacherId,
            'teacher' => $teacher ? [
                'id' => $teacher->id,
                'employee_id' => $teacher->employee_id, // Updated to correct field name
                'department_id' => $teacher->department_id,
                'department' => $department ? [
                    'id' => $department->id,
                    'name' => $department->name,
                ] : null
            ] : null,
            'department' => $department ? [
                'id' => $department->id,
                'name' => $department->name,
            ] : null,
        ]);
    }

    /**
     * Update profile photo
     */
    public function updateProfilePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048', // 2MB Max
        ]);

        $user = $request->user();

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($user->profile_photo_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->profile_photo_path);
            }

            $path = $request->file('photo')->store('profile-photos', 'public');
            $user->update(['profile_photo_path' => $path]);
            
            return response()->json([
                'message' => 'Profile photo updated successfully',
                'user' => $user,
                'photo_url' => asset('storage/' . $path),
            ]);
        }

        return response()->json(['message' => 'No photo uploaded'], 400);
    }
}
