#include "tidDisplay.h"

namespace {
TidDisplay::Pins configuredPins{};
bool initialized = false;
}

namespace TidDisplay {

void begin(const Pins& pins) {
  configuredPins = pins;

  // Somente configura a infraestrutura elétrica básica.
  // O protocolo de escrita do TID será implementado após captura/validação
  // do barramento no TID original. Não enviar dados fictícios.
  pinMode(configuredPins.mrq, OUTPUT);
  digitalWrite(configuredPins.mrq, HIGH);

  initialized = true;

  Serial.printf(
      "[TID] interface preparada SDA=%d SCL=%d MRQ=%d\n",
      configuredPins.sda,
      configuredPins.scl,
      configuredPins.mrq);
}

bool isReady() {
  return initialized;
}

void showBoot() {
  if (!initialized) return;

  Serial.println("[TID] BOOT aguardando protocolo validado");
}

void clear() {
  if (!initialized) return;

  Serial.println("[TID] CLEAR aguardando protocolo validado");
}

} // namespace TidDisplay
