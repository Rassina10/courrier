<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organisation extends Model{

    
    protected $fillable = [
        'name',
        'type',
        'address',
        'logo'
    ];

    public function structures()
    {
        return $this->hasMany(Structure::class);
    }
}



