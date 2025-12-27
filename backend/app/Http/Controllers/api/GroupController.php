<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    // 1. Group create (Only group_name and selectedEmployees are required)
    public function createGroup(Request $request)
    {
        $request->validate([
            'group_name' => 'required|string',
            'selectedEmployees' => 'required|array|min:1'
        ]);

        // Group save 
        $group = Group::create([
            'name' => $request->group_name,
            'project_name' => $request->project_name ?? null,
            'start_date' => $request->start_date ?? null,
            'deadline' => $request->deadline ?? null,
        ]);

        // Pivot table entry
        $group->employees()->attach($request->selectedEmployees);

        return response()->json([
            'message' => 'Group created and employees assigned successfully!',
            'group' => $group->load('employees')
        ], 201);
    }

    // 2. All groups seen
    public function getAllGroups()
    {
        $groups = Group::with('employees')->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $groups
        ]);
    }

    // 3. Group update (Minimal validation)
    public function updateGroup(Request $request, $id)
    {
        $request->validate([
            'group_name' => 'required|string',
            'selectedEmployees' => 'required|array|min:1'
        ]);

        $group = Group::find($id);

        if (!$group) {
            return response()->json(['message' => 'Group not found'], 404);
        }

        // Details update
        $group->update([
            'name' => $request->group_name,
            'project_name' => $request->project_name ?? $group->project_name,
            'start_date' => $request->start_date ?? $group->start_date,
            'deadline' => $request->deadline ?? $group->deadline,
        ]);

        // Sync pivot table (Add new, remove old)
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

        // Pivot table detach and delete group
        $group->employees()->detach();
        $group->delete();

        return response()->json([
            'message' => 'Group deleted successfully!'
        ], 200);
    }
}