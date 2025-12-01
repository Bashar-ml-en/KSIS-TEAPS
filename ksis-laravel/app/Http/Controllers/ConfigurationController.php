<?php

namespace App\Http\Controllers;

use App\Services\ConfigurationService\ConfigurationService;
use Illuminate\Http\Request;

class ConfigurationController extends Controller
{
    protected $configService;

    public function __construct(ConfigurationService $configService)
    {
        $this->configService = $configService;
    }

    /**
     * Get active configuration
     */
    public function show($key)
    {
        $config = $this->configService->get($key);
        return response()->json($config);
    }

    /**
     * Update configuration
     */
    public function update(Request $request, $key)
    {
        $validated = $request->validate([
            'value' => 'required|array',
            'description' => 'nullable|string',
        ]);

        $config = $this->configService->update(
            $key,
            $validated['value'],
            $request->user()->id,
            $validated['description'] ?? null
        );

        return response()->json([
            'message' => 'Configuration updated successfully',
            'config' => $config,
        ]);
    }

    /**
     * Get configuration history
     */
    public function history($key)
    {
        $history = $this->configService->getHistory($key);
        return response()->json($history);
    }

    /**
     * Restore previous version
     */
    public function restore(Request $request, $key, $version)
    {
        $config = $this->configService->restore(
            $key,
            (int)$version,
            $request->user()->id
        );

        return response()->json([
            'message' => "Configuration restored to version {$version}",
            'config' => $config,
        ]);
    }
}
