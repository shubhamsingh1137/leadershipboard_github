<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    // 1. admin make this feild 
    protected $fillable = [
        'name',
        'project_name',
        'start_date',
        'deadline'
    ];

    /**
     * 2. Relationship: Many-to-Many with User (Employees)
     * in one group many employees are there.
     */
    public function employees()
    {
        // 'group_user' 
        return $this->belongsToMany(User::class, 'group_user', 'group_id', 'user_id');
    }
}