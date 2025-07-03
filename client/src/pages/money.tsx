import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Money() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              Money Education
            </h1>
            <p className="text-xl text-zinc-300">
              Understanding traditional finance and Bitcoin's revolutionary approach
            </p>
          </div>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-zinc-300">
                  This section will contain comprehensive money education content, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
                  <li>Traditional banking system analysis</li>
                  <li>Inflation and monetary policy impacts</li>
                  <li>Bitcoin's monetary properties</li>
                  <li>Economic sovereignty concepts</li>
                  <li>Financial independence strategies</li>
                </ul>
                <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-orange-200 text-sm">
                    📚 Content is being developed to provide the most comprehensive Bitcoin education experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}