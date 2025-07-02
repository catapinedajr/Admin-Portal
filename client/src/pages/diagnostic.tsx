import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Diagnostic() {
  const [checks, setChecks] = useState({
    localStorage: false,
    sessionData: false,
    apiConnection: false,
    userEndpoint: false,
    databaseConnection: false
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const newChecks = { ...checks };
    const newErrors: string[] = [];

    // Test 1: localStorage access
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      newChecks.localStorage = true;
    } catch (e) {
      newErrors.push('localStorage not accessible');
    }

    // Test 2: Session data exists
    try {
      const session = localStorage.getItem('hodlearn_session');
      const user = localStorage.getItem('hodlearn_user');
      if (session && user) {
        newChecks.sessionData = true;
        setSessionData({ session: session.substring(0, 10) + '...', user: JSON.parse(user) });
      } else {
        newErrors.push('Missing session data');
      }
    } catch (e) {
      newErrors.push('Session data corrupted');
    }

    // Test 3: Basic API connection
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        newChecks.apiConnection = true;
        newChecks.userEndpoint = true;
      } else {
        newErrors.push(`API returned ${response.status}: ${response.statusText}`);
      }
    } catch (e) {
      newErrors.push(`API connection failed: ${e.message}`);
    }

    // Test 4: Database connection via API
    try {
      const response = await fetch('/api/day-metadata/1');
      if (response.ok) {
        newChecks.databaseConnection = true;
      } else {
        newErrors.push(`Database API failed: ${response.status}`);
      }
    } catch (e) {
      newErrors.push(`Database connection failed: ${e.message}`);
    }

    setChecks(newChecks);
    setErrors(newErrors);
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">HODLearn Deployment Diagnostic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* System Checks */}
            <div className="space-y-2">
              <h3 className="font-semibold text-orange-400">System Checks</h3>
              {Object.entries(checks).map(([check, status]) => (
                <div key={check} className="flex justify-between">
                  <span className="text-zinc-300">{check}:</span>
                  <span className={status ? 'text-green-400' : 'text-red-400'}>
                    {status ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-red-400">Errors Found</h3>
                {errors.map((error, idx) => (
                  <div key={idx} className="text-red-300 text-sm">
                    • {error}
                  </div>
                ))}
              </div>
            )}

            {/* Session Data */}
            {sessionData && (
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-400">Session Data</h3>
                <pre className="text-zinc-300 text-xs bg-zinc-900 p-2 rounded">
                  {JSON.stringify(sessionData, null, 2)}
                </pre>
              </div>
            )}

            {/* Environment Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-purple-400">Environment</h3>
              <div className="text-zinc-300 text-sm">
                <div>URL: {window.location.href}</div>
                <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
              </div>
            </div>

            <button
              onClick={runDiagnostics}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
            >
              Run Diagnostics Again
            </button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}