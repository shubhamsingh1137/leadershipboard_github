<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\User; // Analytics ke liye zaroori hai
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    // === 1. GET ALL GROUPS (With Employees & Pivot Tasks) ===
    public function getAllGroups()
    {
        // employees() relationship mein 'task' aur 'status' pivot columns hone chahiye
        $groups = Group::with([
            'employees' => function ($query) {
                $query->withPivot('task', 'task_status');
            }
        ])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $groups
        ]);
    }

    // === 2. CREATE GROUP ===
    public function createGroup(Request $request)
    {
        $request->validate([
            'group_name' => 'required|string',
            'selectedEmployees' => 'required|array|min:1'
        ]);

        $group = Group::create([
            'name' => $request->group_name,
            'project_name' => $request->project_name ?? null,
            'start_date' => $request->start_date ?? null,
            'deadline' => $request->deadline ?? null,
            'status' => 'active',
        ]);

        // Default task ke saath attach karein
        $group->employees()->attach($request->selectedEmployees, ['task' => 'Assigned to Squad']);

        return response()->json([
            'message' => 'Group created successfully!',
            'group' => $group->load('employees')
        ], 201);
    }

    // === 3. UPDATE GROUP ===
    public function updateGroup(Request $request, $id)
    {
        $request->validate([
            'group_name' => 'required|string',
            'selectedEmployees' => 'required|array|min:1'
        ]);

        $group = Group::findOrFail($id);
        $group->update([
            'name' => $request->group_name,
            'project_name' => $request->project_name ?? $group->project_name,
        ]);

        $group->employees()->sync($request->selectedEmployees);

        return response()->json(['message' => 'Group updated successfully!'], 200);
    }

    // === 4. UPDATE STATUS (Group Toggle) ===
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:active,inactive']);

        $group = Group::findOrFail($id);
        $group->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Group status updated to ' . $request->status,
            'status' => $group->status
        ], 200);
    }

    // === 5. CSV IMPORT (With Group, Project & Individual Tasks) ===
    public function importGroupsCsv(Request $request)
    {
        $request->validate(['data' => 'required|array']);
        $importData = $request->input('data');
        $count = 0;

        try {
            DB::beginTransaction();
            foreach ($importData as $row) {
                if (empty($row['group_name']))
                    continue;

                // 1. Group/Project handle karein
                $group = Group::updateOrCreate(
                    ['name' => $row['group_name']],
                    [
                        'project_name' => $row['project_name'] ?? ($row['group_name'] . " Project"),
                        'status' => $row['status'] ?? 'active'
                    ]
                );

                // 2. Individual Employee aur unki Task handle karein
                if (!empty($row['employee_id'])) {
                    $group->employees()->syncWithoutDetaching([
                        $row['employee_id'] => [
                            'task' => $row['task'] ?? 'General Assignment',
                            'task_status' => $row['task_status'] ?? 'pending'
                        ]
                    ]);
                }
                $count++;
            }
            DB::commit();
            return response()->json(['message' => "Import successful! Processed $count records."], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    // === 6. GET ANALYTICS FOR ADMIN ===
    public function getAnalytics()
    {
        try {
            $analytics = [
                'total_groups' => Group::count(),
                'active_projects' => Group::where('status', 'active')->count(),
                'total_employees' => User::where('role', 'employee')->count(),
                'task_distribution' => DB::table('group_user')
                    ->select('task_status as status', DB::raw('count(*) as total'))
                    ->groupBy('task_status')
                    ->get()
            ];

            return response()->json(['success' => true, 'data' => $analytics], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // === 7. DELETE GROUP ===
    public function deleteGroup($id)
    {
        $group = Group::findOrFail($id);
        $group->employees()->detach();
        $group->delete();
        return response()->json(['message' => 'Group deleted successfully!'], 200);
    }
}