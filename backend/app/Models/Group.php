<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'project_name',
        'start_date',
        'deadline',
        'status'
    ];

    /**
     * Relationship: Many-to-Many with User (Employees)
     * Updated to include pivot data (task and status)
     */
    public function employees()
    {
        return $this->belongsToMany(User::class, 'group_user', 'group_id', 'user_id')
            ->withPivot('task', 'task_status') // Ye naye columns fetch karne ke liye zaroori hai
            ->withTimestamps(); // created_at aur updated_at ke liye
    }
}