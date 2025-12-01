<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Teacher;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    /**
     * Display a listing of contracts
     */
    public function index(Request $request)
    {
        $query = Contract::with('teacher');

        // Filter by teacher
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by expiring soon (e.g., within 30 days)
        if ($request->has('expiring_soon')) {
            $query->where('end_date', '<=', now()->addDays(30))
                  ->where('end_date', '>=', now())
                  ->where('status', 'active');
        }

        $contracts = $query->latest('start_date')->paginate($request->get('per_page', 15));

        return response()->json($contracts);
    }

    /**
     * Store a newly created contract
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'type' => 'required|in:permanent,contract,probation,part_time',
            'status' => 'required|in:active,expired,terminated,pending_renewal',
            'document_path' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Deactivate previous active contracts for this teacher if new one is active
        if ($validated['status'] === 'active') {
            Contract::where('teacher_id', $validated['teacher_id'])
                ->where('status', 'active')
                ->update(['status' => 'expired']);
        }

        $contract = Contract::create($validated);

        return response()->json([
            'message' => 'Contract created successfully',
            'contract' => $contract->load('teacher'),
        ], 201);
    }

    /**
     * Display the specified contract
     */
    public function show($id)
    {
        $contract = Contract::with('teacher')->findOrFail($id);
        return response()->json($contract);
    }

    /**
     * Update the specified contract
     */
    public function update(Request $request, $id)
    {
        $contract = Contract::findOrFail($id);

        $validated = $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after:start_date',
            'type' => 'sometimes|in:permanent,contract,probation,part_time',
            'status' => 'sometimes|in:active,expired,terminated,pending_renewal',
            'document_path' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $contract->update($validated);

        return response()->json([
            'message' => 'Contract updated successfully',
            'contract' => $contract->fresh()->load('teacher'),
        ]);
    }

    /**
     * Remove the specified contract
     */
    public function destroy($id)
    {
        $contract = Contract::findOrFail($id);
        $contract->delete();

        return response()->json([
            'message' => 'Contract deleted successfully',
        ]);
    }
}
