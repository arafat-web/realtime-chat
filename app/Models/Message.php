<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'message',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    /**
     * The ticket this message belongs to
     */
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * The user who sent this message
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
