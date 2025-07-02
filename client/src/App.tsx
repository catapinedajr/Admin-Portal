import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import About from "@/pages/about";

// Simplified App for debugging
function SimpleHome() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-3xl font-bold text-orange-500 mb-4">HODLearn</h1>
      <p className="text-zinc-300">App is working! Navigation restored.</p>
      <div className="mt-8 space-y-4">
        <a href="/about" className="block text-orange-400 hover:text-orange-300">
          → About Us (Simplified)
        </a>
        <a href="/learn" className="block text-orange-400 hover:text-orange-300">
          → Learn Section
        </a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/about" component={About} />
      <Route path="/" component={SimpleHome} />
      <Route>
        <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl text-orange-500 mb-4">Page Not Found</h2>
            <a href="/" className="text-orange-400 hover:text-orange-300">← Back to Home</a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
