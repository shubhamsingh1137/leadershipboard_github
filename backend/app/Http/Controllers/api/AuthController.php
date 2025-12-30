<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // --- LOGIN (Admin & Employee) ---
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'role' => $user->role, // System Role (admin/employee)
            'user' => $user
        ]);
    }

    // --- CSV IMPORT (Designation as Table Role) ---
    public function importEmployees(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();
        $data = array_map('str_getcsv', file($path));

        // CSV Header remove karne ke liye
        $header = array_shift($data);

        $importedCount = 0;
        $errors = [];

        foreach ($data as $index => $row) {
            // Row validation: Name, Email, Phone, EmpID must exist
            if (count($row) < 4)
                continue;

            // Role Logic: Agar 5th column ($row[4]) me data hai toh wo 'designation' banega, 
            // varna default 'Staff' assign hoga.
            $designation = (!empty($row[4])) ? $row[4] : 'Staff';

            $userData = [
                'name' => $row[0],
                'email' => $row[1],
                'phone' => $row[2],
                'employee_id' => $row[3],
                'designation' => $designation, // Frontend table me 'Role' column ke liye
                'password' => Hash::make('123456'), // Default password
                'role' => 'employee' // System access level
            ];

            $validator = Validator::make($userData, [
                'email' => 'required|email|unique:users,email',
                'employee_id' => 'required|unique:users,employee_id'
            ]);

            if ($validator->fails()) {
                $errors[] = "Row " . ($index + 2) . ": " . implode(", ", $validator->errors()->all());
                continue;
            }

            User::create($userData);
            $importedCount++;
        }

        return response()->json([
            'message' => "Successfully imported $importedCount employees.",
            'errors' => $errors
        ], 200);
    }

    // --- ADMIN CREATE EMPLOYEE ---
    public function createEmployee(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'phone' => 'nullable|string',
            'employee_id' => 'nullable|string|unique:users',
            'designation' => 'nullable|string', // Frontend Role field
            'gender' => 'nullable|in:male,female,other',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $imagePath = null;
        if ($request->hasFile('profile_image')) {
            $imagePath = $request->file('profile_image')->store('employee', 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'employee_id' => $request->employee_id,
            'designation' => $request->designation ?? 'Staff',
            'gender' => $request->gender,
            'profile_image' => $imagePath,
            'role' => 'employee'
        ]);

        return response()->json([
            'message' => 'Employee created successfully',
            'user' => $user
        ], 201);
    }

    // --- GET ALL & SEARCH ---
    public function getAllEmployees(Request $request)
    {
        $search = $request->query('search');

        $employees = User::where('role', 'employee')
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('designation', 'like', "%{$search}%")
                        ->orWhere('employee_id', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc') // Newest first
            ->get();

        return response()->json([
            'success' => true,
            'data' => $employees
        ], 200);
    }

    // --- UPDATE EMPLOYEE ---
    public function updateEmployee(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|min:6',
            'phone' => 'nullable|string',
            'employee_id' => 'nullable|string|unique:users,employee_id,' . $id,
            'designation' => 'nullable|string',
            'gender' => 'nullable|in:male,female,other',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $data = $request->except(['password', 'profile_image']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $data['profile_image'] = $request->file('profile_image')->store('employee', 'public');
        }

        $user->update($data);

        return response()->json([
            'message' => 'Employee updated successfully',
            'user' => $user
        ]);
    }

    // --- DELETE EMPLOYEE ---
    public function deleteEmployee($id)
    {
        $user = User::findOrFail($id);
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }
        $user->delete();

        return response()->json([
            'message' => 'Employee deleted successfully'
        ], 200);
    }
}