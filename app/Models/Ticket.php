<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'assigned_to',
        'subject',
        'description',
        'priority',
        'status',
        'attachment',
    ];

    /**
     * The user who created the ticket
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The admin assigned to this ticket
     */
    public function assignedAdmin()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * The category of this ticket
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Comments on this ticket
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Chat messages for this ticket
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
