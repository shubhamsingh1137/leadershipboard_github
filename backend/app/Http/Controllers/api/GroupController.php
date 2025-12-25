<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    // 1. Group create (Only for Admin)
    public function createGroup(Request $request)
    {
        $request->validate([
            'group_name' => 'required|string',
            'project_name' => 'required|string',
            'start_date' => 'required|date',
            'deadline' => 'required|date',
            'selectedEmployees' => 'required|array'
        ]);

        // Group save 
        $group = Group::create([
            'name' => $request->group_name,
            'project_name' => $request->project_name,
            'start_date' => $request->start_date,
            'deadline' => $request->deadline,
        ]);

        // Pivot table (group_user)  entries insert 
        $group->employees()->attach($request->selectedEmployees);

        return response()->json([
            'message' => 'Group created and employees assigned successfully!',
            'group' => $group->load('employees')
        ], 201);
    }

    // 2. all group seen
    public function getAllGroups()
    {
        $groups = Group::with('employees')->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $groups
        ]);
    }

    // 3. Group update 
    public function updateGroup(Request $request, $id)
    {
        $request->validate([
            'group_name' => 'required|string',
            'project_name' => 'required|string',
            'start_date' => 'required|date',
            'deadline' => 'required|date',
            'selectedEmployees' => 'required|array'
        ]);

        $group = Group::find($id);

        if (!$group) {
            return response()->json(['message' => 'Group not found'], 404);
        }

        // Basic details update 
        $group->update([
            'name' => $request->group_name,
            'project_name' => $request->project_name,
            'start_date' => $request->start_date,
            'deadline' => $request->deadline,
        ]);


        $group->employees()->sync($request->selectedEmployees);

        return response()->json([
            'message' => 'Group updated successfully!',
            'group' => $group->load('employees')
        ], 200);
    }

    // 4. Group delete 
    public function deleteGroup($id)
    {
        $group = Group::find($id);

        if (!$group) {
            return response()->json(['message' => 'Group not found'], 404);
        }

        // Pivot table  (detach)
        $group->employees()->detach();

        // Group delete 
        $group->delete();

        return response()->json([
            'message' => 'Group deleted successfully!'
        ], 200);
    }
}