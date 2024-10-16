<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuditTrail;

class AuditTrailController extends Controller
{
    public function index(Request $request) {
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search', '');

        $query = AuditTrail::with('user')->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('email', 'like', "%{$search}%");
                  });
            });
        }

        $auditTrail = $query->paginate($perPage, ['*'], 'page', $page);
        return response()->json($auditTrail);
    }

    public function store(Request $request) {
        $auditTrail = AuditTrail::create($request->all());
        return response()->json($auditTrail);
    }

    public function view($id) {
        $auditTrail = AuditTrail::where('id', $id)->with('user')->first();
        if (!$auditTrail) {
            return response()->json(['error' => 'Audit trail not found'], 404);
        }
        return response()->json($auditTrail);
    }
}
