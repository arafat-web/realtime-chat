<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'content',
    ];

    /**
     * The ticket this comment belongs to
     */
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * The user who made this comment
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
