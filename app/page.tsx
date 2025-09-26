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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Droplets,
  Zap,
  Flame,
  Leaf,
  TrendingDown,
  TrendingUp,
  Minus,
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

  // Lei de Hick-Hyman: Simplificar escolhas com validação automática
  const handleInputChange = (field: keyof ConsumptionData, value: string) => {
    // Apenas números e vírgula/ponto decimal
    const numericValue = value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setConsumption((prev) => ({ ...prev, [field]: numericValue }));
  };

  // Gerar recomendação baseada nos dados (Lei de Hick-Hyman: feedback imediato)
  const generateRecommendation = (data: ConsumptionData): Recommendation => {
    const water = Number.parseFloat(data.water) || 0;
    const energy = Number.parseFloat(data.energy) || 0;
    const gas = Number.parseFloat(data.gas) || 0;

    const total = water + energy + gas;

    if (total === 0) {
      return {
        type: "info",
        message:
          "Adicione seus dados de consumo para receber recomendações personalizadas.",
        icon: <Leaf className="h-4 w-4" />,
      };
    }

    if (total < 50) {
      return {
        type: "success",
        message:
          "Excelente! Seu consumo está muito baixo. Continue assim para manter sua pegada sustentável.",
        icon: <TrendingDown className="h-4 w-4 text-green-500" />,
      };
    } else if (total < 100) {
      return {
        type: "info",
        message:
          "Bom trabalho! Considere pequenos ajustes como banhos mais curtos ou desligar aparelhos em standby.",
        icon: <Minus className="h-4 w-4 text-blue-500" />,
      };
    } else {
      return {
        type: "warning",
        message:
          "Seu consumo está alto. Tente reduzir o tempo de banho, usar lâmpadas LED e verificar vazamentos.",
        icon: <TrendingUp className="h-4 w-4 text-orange-500" />,
      };
    }
  };

  const handleSubmit = () => {
    const rec = generateRecommendation(consumption);
    setRecommendation(rec);
    setIsSubmitted(true);
  };

  // Lei de Fitts: Verificar se pelo menos um campo está preenchido para habilitar botão
  const hasData = consumption.water || consumption.energy || consumption.gas;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header - Princípio da Gestalt: Figura-fundo clara */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-balance">
              Meu Lar Sustentável
            </h1>
          </div>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Registre seu consumo diário de água, energia e gás para receber
            recomendações personalizadas e promover hábitos mais sustentáveis.
          </p>
        </div>

        {/* Formulário Principal - Princípios da Gestalt: Proximidade e Similaridade */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-water" />
              Registro de Consumo Diário
            </CardTitle>
            <CardDescription>
              Insira os dados de consumo para hoje. Os campos aceitam valores
              decimais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Grid de Consumo - Gestalt: Região Comum e Proximidade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Água - Lei de Fitts: Área de toque grande */}
              <div className="space-y-3 p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-water" />
                  <Label htmlFor="water" className="text-base font-medium">
                    Água (Litros)
                  </Label>
                </div>
                <Input
                  id="water"
                  type="text"
                  placeholder="Ex: 150.5"
                  value={consumption.water}
                  onChange={(e) => handleInputChange("water", e.target.value)}
                  className="text-lg h-12 text-center"
                  aria-describedby="water-help"
                />
                <p
                  id="water-help"
                  className="text-sm text-muted-foreground text-center"
                >
                  Consumo médio: 100-200L/dia
                </p>
              </div>

              {/* Energia - Gestalt: Similaridade visual */}
              <div className="space-y-3 p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-energy" />
                  <Label htmlFor="energy" className="text-base font-medium">
                    Energia (kWh)
                  </Label>
                </div>
                <Input
                  id="energy"
                  type="text"
                  placeholder="Ex: 12.3"
                  value={consumption.energy}
                  onChange={(e) => handleInputChange("energy", e.target.value)}
                  className="text-lg h-12 text-center"
                  aria-describedby="energy-help"
                />
                <p
                  id="energy-help"
                  className="text-sm text-muted-foreground text-center"
                >
                  Consumo médio: 8-15 kWh/dia
                </p>
              </div>

              {/* Gás */}
              <div className="space-y-3 p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-gas" />
                  <Label htmlFor="gas" className="text-base font-medium">
                    Gás (m³)
                  </Label>
                </div>
                <Input
                  id="gas"
                  type="text"
                  placeholder="Ex: 2.1"
                  value={consumption.gas}
                  onChange={(e) => handleInputChange("gas", e.target.value)}
                  className="text-lg h-12 text-center"
                  aria-describedby="gas-help"
                />
                <p
                  id="gas-help"
                  className="text-sm text-muted-foreground text-center"
                >
                  Consumo médio: 1-3 m³/dia
                </p>
              </div>
            </div>

            {/* Botão de Ação - Lei de Fitts: Grande e centralizado */}
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                disabled={!hasData}
                size="lg"
                className="h-14 px-8 text-lg font-medium min-w-[200px]"
              >
                {isSubmitted ? "Atualizar Análise" : "Analisar Consumo"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resumo e Recomendação - MPH: Feedback visual imediato */}
        {hasData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumo Rápido - Gestalt: Agrupamento visual */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Dia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <Droplets className="h-6 w-6 text-water mx-auto" />
                    <div className="text-2xl font-bold">
                      {consumption.water || "0"}
                    </div>
                    <div className="text-sm text-muted-foreground">Litros</div>
                  </div>
                  <div className="space-y-2">
                    <Zap className="h-6 w-6 text-energy mx-auto" />
                    <div className="text-2xl font-bold">
                      {consumption.energy || "0"}
                    </div>
                    <div className="text-sm text-muted-foreground">kWh</div>
                  </div>
                  <div className="space-y-2">
                    <Flame className="h-6 w-6 text-gas mx-auto" />
                    <div className="text-2xl font-bold">
                      {consumption.gas || "0"}
                    </div>
                    <div className="text-sm text-muted-foreground">m³</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recomendação - MPH: Processamento cognitivo simplificado */}
            {recommendation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Recomendação Personalizada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert
                    className={`border-l-4 ${
                      recommendation.type === "success"
                        ? "border-l-green-500 bg-green-50 dark:bg-green-950/20"
                        : recommendation.type === "warning"
                        ? "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20"
                        : "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {recommendation.icon}
                      <AlertDescription className="text-sm leading-relaxed">
                        {recommendation.message}
                      </AlertDescription>
                    </div>
                  </Alert>

                  {/* Badge de Status - Gestalt: Figura-fundo */}
                  <div className="mt-4 flex justify-center">
                    <Badge
                      variant={
                        recommendation.type === "success"
                          ? "default"
                          : recommendation.type === "warning"
                          ? "destructive"
                          : "secondary"
                      }
                      className="px-4 py-2"
                    >
                      {recommendation.type === "success"
                        ? "Consumo Sustentável"
                        : recommendation.type === "warning"
                        ? "Atenção Necessária"
                        : "Em Análise"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Dicas Rápidas - MPH: Informação acessível */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Dicas para Economia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Droplets className="h-4 w-4 text-water mt-0.5 flex-shrink-0" />
                <span>Banhos de até 5 minutos economizam até 80L por dia</span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-energy mt-0.5 flex-shrink-0" />
                <span>
                  Desligue aparelhos da tomada para evitar consumo fantasma
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Flame className="h-4 w-4 text-gas mt-0.5 flex-shrink-0" />
                <span>Use panela de pressão para cozinhar mais rápido</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
