<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    // LOGIN (Admin & Employee)
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'role' => $user->role,
            'user' => $user
        ]);
    }

    // ADMIN CREATE EMPLOYEE
    public function createEmployee(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'phone' => 'nullable|string',
            'designation' => 'nullable|string',
            'gender' => 'nullable|in:male,female,other',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'

        ]);
        $imagePath = null;

        if ($request->hasFile(('profile_image'))) {
            $imagePath = $request->file('profile_image')->store('employee', 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'designation' => $request->designation,
            'gender' => $request->gender,
            'profile_image' => $imagePath,
            'role' => 'employee'
        ]);

        return response()->json([
            'message' => 'Employee created succesfully',
            'user' => $user
        ], 201);
    }
    // get all employee (admins only)
    public function getAllEmployees(Request $request)
    {
        $search = $request->query('search');

        $employees = User::where('role', 'employee')
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('designation', 'like', "%{$search}%")
                        ->orWhere('id', 'like', "%{$search}%");
                });
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $employees
        ], 200);
    }
    //update employee
    public function updateEmployee(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'nullable|string',
            'desigantion' => 'nullable|string',
            'gender' => 'nullable|in:male,female,other',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $data = $request->except(['password', 'profile_image']);

        //if password is send please update 
        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }
        //image handling 
        if ($request->hasFile('profile_image')) {

            //delete old image
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);

            }
            $data['profile_image'] = $request->file('profile_image')->store('employee', 'public');

        }
        $user->update($data);

        return response()->json([
            'message' => 'Employee updated succesfully',
            'user' => $user
        ]);
    }

    //delete employee
    public function deleteEmployee($id)
    {
        $user = User::findOrFail($id);
        // delete the employee profile image 
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }
        // delete record from the database
        $user->delete();

        return response()->json([
            'message' => 'employee deleted successfully from the database'
        ], 200);
    }
}
