<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    // 1. Batana ki kaunsi fields admin bhar sakta hai
    protected $fillable = [
        'name',
        'project_name',
        'start_date',
        'deadline'
    ];

    /**
     * 2. Relationship: Many-to-Many with User (Employees)
     * Ek group ke andar bahut saare employees hote hain.
     */
    public function employees()
    {
        // 'group_user' woh pivot table hai jo humne banayi thi
        return $this->belongsToMany(User::class, 'group_user', 'group_id', 'user_id');
    }
}