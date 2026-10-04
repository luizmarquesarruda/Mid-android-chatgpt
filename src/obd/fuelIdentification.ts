export type FuelIdentificationStatus =
  | 'SEM_DADOS'
  | 'TIPO_VEICULO'
  | 'COMPOSICAO_ECU'
  | 'DADO_INCOERENTE';

export interface FuelIdentification {
  status: FuelIdentificationStatus;
  fuelTypeCode: number | null;
  fuelTypeLabel: string | null;
  alcoholPercent: number | null;
  confidence: 'BAIXA' | 'DIRETA';
  note: string;
}

/**
 * Interpreta apenas evidência fornecida pela ECU.
 * Não estima a mistura com STFT/LTFT/lambda/MAF/consumo.
 */
export function identifyFuelFromObd(
  fuelTypeCode: number | null,
  alcoholPercent: number | null,
): FuelIdentification {
  if (alcoholPercent != null && (!Number.isFinite(alcoholPercent) || alcoholPercent < 0 || alcoholPercent > 100)) {
    return {
      status: 'DADO_INCOERENTE',
      fuelTypeCode,
      fuelTypeLabel: fuelTypeCode === 3 ? 'Etanol' : fuelTypeCode === 1 ? 'Gasolina' : null,
      alcoholPercent: null,
      confidence: 'BAIXA',
      note: 'Percentual de álcool fora da faixa válida; preservar a resposta bruta para investigação.',
    };
  }

  const fuelTypeLabel =
    fuelTypeCode === 1 ? 'Gasolina' :
    fuelTypeCode === 3 ? 'Etanol' :
    fuelTypeCode == null ? null :
    'Código não mapeado';

  if (fuelTypeCode == null && alcoholPercent == null) {
    return { status: 'SEM_DADOS', fuelTypeCode: null, fuelTypeLabel: null, alcoholPercent: null, confidence: 'BAIXA', note: 'A ECU ainda não forneceu dados de identificação de combustível.' };
  }

  if (alcoholPercent != null) {
    return { status: 'COMPOSICAO_ECU', fuelTypeCode, fuelTypeLabel, alcoholPercent, confidence: 'DIRETA', note: 'Percentual informado diretamente pela ECU; não é estimativa do aplicativo.' };
  }

  return { status: 'TIPO_VEICULO', fuelTypeCode, fuelTypeLabel, alcoholPercent: null, confidence: 'DIRETA', note: 'O PID 0151 informa o tipo declarado pela ECU, mas não confirma sozinho a mistura atual.' };
}
