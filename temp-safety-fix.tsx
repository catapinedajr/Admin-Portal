// This is a temporary file to fix the safety simulator
// I need to locate and remove only the hardcoded Safety Skills Simulator 
// and replace it with DatabaseSafetySimulator component

// Import DatabaseSafetySimulator
import { DatabaseSafetySimulator } from "@/components/DatabaseSafetySimulator";

// In the Safety section, replace the hardcoded simulator with:
<DatabaseSafetySimulator />