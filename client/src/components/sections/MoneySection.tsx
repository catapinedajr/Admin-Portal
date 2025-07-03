import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MoneySectionProps {
  // We'll add necessary props as we copy the content
}

export default function MoneySection(props: MoneySectionProps) {
  // Local state for this component
  const [inflationAmount, setInflationAmount] = useState<string>("10000");
  const [inflationYears, setInflationYears] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(3.0);
  const [monthlyFee, setMonthlyFee] = useState<string>("12");
  const [wireTransfers, setWireTransfers] = useState<string>("1");
  const [atmWithdrawals, setAtmWithdrawals] = useState<string>("4");
  const [atmFees, setAtmFees] = useState<string>("4");
  const [overdraftFees, setOverdraftFees] = useState<string>("0");
  const [moneySupplyYear, setMoneySupplyYear] = useState<number>(2024);

  return (
    <div className="space-y-8">
      {/* Hero Narrative */}
      <Card className="bg-gradient-to-br from-orange-950/30 via-zinc-900 to-red-950/30 border-orange-800/50">
        <CardContent className="p-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
                Why BTC?
              </h1>
              <p className="text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto">
                You work hard for your money. But while you sleep, invisible forces quietly steal your purchasing power.
              </p>
              <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                Traditional money systems extract value through inflation, fees, and delays. Bitcoin offers an alternative.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rest of Money Section content will be added here */}
      <div className="text-center text-zinc-400">
        MoneySection Component - Full content to be copied
      </div>
    </div>
  );
}