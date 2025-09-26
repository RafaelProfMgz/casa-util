"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Droplets,
  Zap,
  Flame,
  Leaf,
  TrendingDown,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface ConsumptionData {
  water: string;
  energy: string;
  gas: string;
}

interface Recommendation {
  type: "success" | "warning" | "info";
  message: string;
  icon: React.ReactNode;
  score: number;
  actionItems: string[];
}

export default function HomePage() {
  const [consumption, setConsumption] = useState<ConsumptionData>({
    water: "",
    energy: "",
    gas: "",
  });

  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (field: keyof ConsumptionData, value: string) => {
    const numericValue = value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setConsumption((prev) => ({ ...prev, [field]: numericValue }));

    // Feedback imediato - gerar recomendação automaticamente
    if (numericValue && !isNaN(Number(numericValue))) {
      const tempData = { ...consumption, [field]: numericValue };
      const rec = generateRecommendation(tempData);
      setRecommendation(rec);
    }
  };

  const generateRecommendation = (data: ConsumptionData): Recommendation => {
    const water = Number.parseFloat(data.water) || 0;
    const energy = Number.parseFloat(data.energy) || 0;
    const gas = Number.parseFloat(data.gas) || 0;

    const waterScore =
      water <= 150 ? 100 : water <= 200 ? 75 : water <= 300 ? 50 : 25;
    const energyScore =
      energy <= 10 ? 100 : energy <= 15 ? 75 : energy <= 20 ? 50 : 25;
    const gasScore = gas <= 2 ? 100 : gas <= 3 ? 75 : gas <= 4 ? 50 : 25;

    const totalScore = Math.round((waterScore + energyScore + gasScore) / 3);

    const actionItems: string[] = [];

    if (water > 200) actionItems.push("Reduza o tempo de banho para 5 minutos");
    if (energy > 15) actionItems.push("Desligue aparelhos em standby");
    if (gas > 3) actionItems.push("Use panela de pressão para cozinhar");

    if (totalScore >= 85) {
      return {
        type: "success",
        message:
          "Parabéns! Seu consumo está excelente. Você está fazendo a diferença para o planeta.",
        icon: <Award className="h-5 w-5 text-green-500" />,
        score: totalScore,
        actionItems: [
          "Continue mantendo esses hábitos sustentáveis",
          "Compartilhe suas práticas com amigos",
        ],
      };
    } else if (totalScore >= 60) {
      return {
        type: "info",
        message:
          "Bom trabalho! Com pequenos ajustes você pode melhorar ainda mais sua sustentabilidade.",
        icon: <TrendingDown className="h-5 w-5 text-blue-500" />,
        score: totalScore,
        actionItems:
          actionItems.length > 0
            ? actionItems
            : ["Monitore seu consumo diariamente"],
      };
    } else {
      return {
        type: "warning",
        message:
          "Há oportunidades importantes para reduzir seu impacto ambiental. Vamos começar?",
        icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
        score: totalScore,
        actionItems:
          actionItems.length > 0
            ? actionItems
            : ["Comece com banhos mais curtos", "Verifique vazamentos"],
      };
    }
  };

  const hasData = consumption.water || consumption.energy || consumption.gas;

  const getProgressValue = (value: string, max: number) => {
    const num = Number.parseFloat(value) || 0;
    return Math.min((num / max) * 100, 100);
  };

  const getProgressColor = (value: number) => {
    if (value <= 50) return "bg-green-500";
    if (value <= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <ThemeToggle />

      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-12 px-4 md:px-8 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-800">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-balance">
              Meu Lar Sustentável
            </h1>
          </div>
          <p className="text-lg text-white/90 text-pretty max-w-2xl mx-auto leading-relaxed">
            Monitore seu consumo e receba feedback instantâneo para um futuro
            mais sustentável.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-8 -mt-6 pb-16">
        <Card className="w-full shadow-xl border-0 bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl text-card-foreground">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              Registro Diário de Consumo
            </CardTitle>
            <CardDescription className="text-base">
              Digite seus valores e veja o impacto em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Água */}
              <div
                className={`consumption-card space-y-4 p-6 rounded-xl transition-all duration-300 ${
                  focusedField === "water"
                    ? "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-300 dark:border-blue-600 shadow-lg scale-105"
                    : "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Droplets className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <Label
                      htmlFor="water"
                      className="text-lg font-semibold text-blue-900 dark:text-blue-100"
                    >
                      Água
                    </Label>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Litros por dia
                    </p>
                  </div>
                </div>
                <Input
                  id="water"
                  type="text"
                  placeholder="Ex: 150"
                  value={consumption.water}
                  onChange={(e) => handleInputChange("water", e.target.value)}
                  onFocus={() => setFocusedField("water")}
                  onBlur={() => setFocusedField(null)}
                  className="text-2xl h-16 text-center border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-400 bg-white/80 dark:bg-background/80 font-bold"
                />
                {consumption.water && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground">Meta: 150L</span>
                      <span
                        className={
                          getProgressValue(consumption.water, 150) > 100
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }
                      >
                        {consumption.water}L
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={Math.min(
                          getProgressValue(consumption.water, 150),
                          100
                        )}
                        className="h-3 bg-blue-100 dark:bg-blue-900/30"
                      />
                      {getProgressValue(consumption.water, 150) > 100 && (
                        <div className="absolute top-0 right-0 w-2 h-3 bg-red-500 rounded-r"></div>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-sm text-blue-600 dark:text-blue-400 text-center font-medium">
                  Ideal: até 150L/dia
                </p>
              </div>

              {/* Energia */}
              <div
                className={`consumption-card space-y-4 p-6 rounded-xl transition-all duration-300 ${
                  focusedField === "energy"
                    ? "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-300 dark:border-amber-600 shadow-lg scale-105"
                    : "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <Label
                      htmlFor="energy"
                      className="text-lg font-semibold text-amber-900 dark:text-amber-100"
                    >
                      Energia
                    </Label>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      kWh por dia
                    </p>
                  </div>
                </div>
                <Input
                  id="energy"
                  type="text"
                  placeholder="Ex: 12"
                  value={consumption.energy}
                  onChange={(e) => handleInputChange("energy", e.target.value)}
                  onFocus={() => setFocusedField("energy")}
                  onBlur={() => setFocusedField(null)}
                  className="text-2xl h-16 text-center border-amber-200 dark:border-amber-600 focus:border-amber-400 dark:focus:border-amber-400 bg-white/80 dark:bg-background/80 font-bold"
                />
                {consumption.energy && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground">
                        Meta: 10 kWh
                      </span>
                      <span
                        className={
                          getProgressValue(consumption.energy, 10) > 100
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }
                      >
                        {consumption.energy} kWh
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={Math.min(
                          getProgressValue(consumption.energy, 10),
                          100
                        )}
                        className="h-3 bg-amber-100 dark:bg-amber-900/30"
                      />
                      {getProgressValue(consumption.energy, 10) > 100 && (
                        <div className="absolute top-0 right-0 w-2 h-3 bg-red-500 rounded-r"></div>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-sm text-amber-600 dark:text-amber-400 text-center font-medium">
                  Ideal: até 10 kWh/dia
                </p>
              </div>

              {/* Gás */}
              <div
                className={`consumption-card space-y-4 p-6 rounded-xl transition-all duration-300 ${
                  focusedField === "gas"
                    ? "bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 border-red-300 dark:border-red-600 shadow-lg scale-105"
                    : "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Flame className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <Label
                      htmlFor="gas"
                      className="text-lg font-semibold text-red-900 dark:text-red-100"
                    >
                      Gás
                    </Label>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      m³ por dia
                    </p>
                  </div>
                </div>
                <Input
                  id="gas"
                  type="text"
                  placeholder="Ex: 2"
                  value={consumption.gas}
                  onChange={(e) => handleInputChange("gas", e.target.value)}
                  onFocus={() => setFocusedField("gas")}
                  onBlur={() => setFocusedField(null)}
                  className="text-2xl h-16 text-center border-red-200 dark:border-red-600 focus:border-red-400 dark:focus:border-red-400 bg-white/80 dark:bg-background/80 font-bold"
                />
                {consumption.gas && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground">Meta: 2 m³</span>
                      <span
                        className={
                          getProgressValue(consumption.gas, 2) > 100
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }
                      >
                        {consumption.gas} m³
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={Math.min(
                          getProgressValue(consumption.gas, 2),
                          100
                        )}
                        className="h-3 bg-red-100 dark:bg-red-900/30"
                      />
                      {getProgressValue(consumption.gas, 2) > 100 && (
                        <div className="absolute top-0 right-0 w-2 h-3 bg-red-500 rounded-r"></div>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                  Ideal: até 2 m³/dia
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasData && recommendation && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Score Card - Gestalt: Figura-fundo clara */}
            <Card className="shadow-lg border-0 bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-card-foreground">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  Pontuação Sustentável
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-3">
                  <div
                    className={`text-6xl font-bold ${
                      recommendation.score >= 85
                        ? "text-green-600 dark:text-green-400"
                        : recommendation.score >= 60
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {recommendation.score}
                  </div>
                  <div className="text-lg font-medium text-muted-foreground">
                    de 100 pontos
                  </div>
                  <Progress value={recommendation.score} className="h-4" />
                </div>

                <div
                  className={`border-l-4 p-4 rounded-2xl min-h-[80px] ${
                    recommendation.type === "success"
                      ? "border-l-green-500 bg-green-150 dark:bg-green-950/30"
                      : recommendation.type === "warning"
                      ? "border-l-orange-500 bg-orange-100 dark:bg-orange-950/30"
                      : "border-l-blue-500 bg-blue-150 dark:bg-blue-950/30"
                  }`}
                >
                  <div className="relative">
                    <div className="absolute -top-1 -right-1 opacity-20">
                      {recommendation.icon}
                    </div>
                    <AlertDescription className="text-base leading-relaxed pr-8">
                      {recommendation.message}
                    </AlertDescription>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-card-foreground">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  Próximos Passos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendation.actionItems.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{action}</span>
                  </div>
                ))}

                <div className="mt-6 flex justify-center">
                  <Badge
                    variant={
                      recommendation.type === "success"
                        ? "default"
                        : recommendation.type === "warning"
                        ? "destructive"
                        : "secondary"
                    }
                    className="px-6 py-2 text-sm font-medium"
                  >
                    {recommendation.type === "success"
                      ? "🌟 Excelente Desempenho"
                      : recommendation.type === "warning"
                      ? "⚠️ Precisa Melhorar"
                      : "📊 Bom Progresso"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-8 shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3 text-card-foreground">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              Dicas Rápidas de Economia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 p-4 bg-white/60 dark:bg-background/60 rounded-xl hover:bg-white/80 dark:hover:bg-background/80 transition-colors">
                <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                  <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Água
                  </h4>
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    Banhos de 5 minutos economizam 80L/dia
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/60 dark:bg-background/60 rounded-xl hover:bg-white/80 dark:hover:bg-background/80 transition-colors">
                <div className="p-2 bg-amber-500/10 rounded-lg flex-shrink-0">
                  <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Energia
                  </h4>
                  <span className="text-sm text-amber-800 dark:text-amber-200">
                    Desligar standby economiza 10% na conta
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/60 dark:bg-background/60 rounded-xl hover:bg-white/80 dark:hover:bg-background/80 transition-colors">
                <div className="p-2 bg-red-500/10 rounded-lg flex-shrink-0">
                  <Flame className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                    Gás
                  </h4>
                  <span className="text-sm text-red-800 dark:text-red-200">
                    Panela de pressão reduz tempo em 70%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
