<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckOptionalToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if ($token) {
            try {
                // Authenticate the user via Sanctum
                $user = auth('sanctum')->user();

                if ($user) {
                    // Set the authenticated user
                    Auth::setUser($user);
                }
            } catch (\Exception $e) {
                // Log the exception for debugging purposes (optional)
                logger()->error('Token authentication failed', ['error' => $e->getMessage()]);

                // Allow the request to proceed without interrupting the flow
                return $next($request);
            }
        }

        // Proceed with the request
        return $next($request);
    }
}