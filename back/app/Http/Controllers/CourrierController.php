<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CourrierService;
use Illuminate\Validation\ValidationException;

class CourrierController extends Controller
{
    protected $courrierService;

    public function __construct(CourrierService $courrierService)
    {
        $this->courrierService = $courrierService;
    }

    public function index()
    {
        return response()->json($this->courrierService->getAllCourriers());
    }

    public function store(Request $request)
    {
        try{
             $data = $request->validate([
            'user_id' => 'required|integer',
            'organisation_id' => 'required|integer',
            'objet' => 'required|string|max:255',
            'statut' => 'nullable|string',
            'date_reception' => 'required|date',
            'numero_registre' => 'required|integer',
            'niveau' => 'required|string',
            'reference' => 'required|string',
            'numerise' => 'required|boolean',
            'type' => 'required|string',
            'nature' => 'required|string',

        ]);
        

         $courrier = $this->courrierService->createCourrier($data);
        return response()->json([
            'success' => true,
            'data' =>$courrier
            ],201);
        }catch(ValidationException $e){
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ],422);
        }
       
    }
}
