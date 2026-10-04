#pragma once

#include <Arduino.h>

/**
 * Interface do TID original da Chevrolet Meriva.
 *
 * O protocolo elétrico/comandos do TID ainda precisa ser confirmado
 * com o hardware real. Este módulo NÃO envia bytes inventados ao TID.
 *
 * Pinagem planejada do Smart MID:
 *   SDA  -> GPIO 33
 *   SCL  -> GPIO 32
 *   MRQ  -> GPIO 27
 */
namespace TidDisplay {

struct Pins {
  int sda = 33;
  int scl = 32;
  int mrq = 27;
};

void begin(const Pins& pins = {});
bool isReady();
void showBoot();
void clear();

} // namespace TidDisplay
