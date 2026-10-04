#include <Arduino.h>
#include <BluetoothSerial.h>
#include "tidDisplay.h"

BluetoothSerial SerialBT;

static constexpr int KLINE_RX_PIN = 16;
static constexpr int KLINE_TX_PIN = 17;
static constexpr uint32_t KLINE_BAUD = 10400;

HardwareSerial KLine(2);

static constexpr int IGN_PIN = 35;
static constexpr int BUZZER_PIN = 26;

String rxLine;

void sendElm(const String& response) {
  SerialBT.print(response);
  SerialBT.print("\r>");
}

String normalizeCommand(String command) {
  command.trim();
  command.toUpperCase();
  command.replace(" ", "");
  return command;
}

void handleCommand(const String& raw) {
  const String command = normalizeCommand(raw);
  if (command.length() == 0) return;

  Serial.printf("[BT] RX: %s\n", command.c_str());

  // Initial ELM-compatible control layer. Vehicle protocol access is deliberately
  // kept behind KLine so the Android application can use the same command model.
  if (command == "ATZ") {
    sendElm("ELM327 v1.5");
    return;
  }
  if (command == "ATI") {
    sendElm("MERIVA MID ESP32");
    return;
  }
  if (command == "ATE0" || command == "ATL0" || command == "ATS0" ||
      command == "ATH1" || command == "ATSP0") {
    sendElm("OK");
    return;
  }
  if (command == "ATDP") {
    sendElm("ISO 14230-4 (KWP FAST)");
    return;
  }

  // Phase 1: explicit bridge placeholder.
  // Do not fabricate ECU data. Until the K-Line handshake is validated on the
  // physical Meriva, unsupported OBD commands return NO DATA.
  sendElm("NO DATA");
}

void setup() {
  Serial.begin(115200);
  delay(200);

  pinMode(IGN_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  TidDisplay::begin();
  TidDisplay::showBoot();

  KLine.begin(KLINE_BAUD, SERIAL_8N1, KLINE_RX_PIN, KLINE_TX_PIN);

  if (!SerialBT.begin("MERIVA-MID-ESP32")) {
    Serial.println("[BT] Failed to start Bluetooth Classic SPP");
    return;
  }

  Serial.println("[MID] ESP32 Meriva MID bridge started");
  Serial.printf("[KLINE] UART2 RX=%d TX=%d baud=%lu\n",
                KLINE_RX_PIN, KLINE_TX_PIN, KLINE_BAUD);
  Serial.println("[BT] Device: MERIVA-MID-ESP32");
}

void loop() {
  while (SerialBT.available()) {
    const char c = static_cast<char>(SerialBT.read());

    if (c == '\r' || c == '\n') {
      if (rxLine.length() > 0) {
        handleCommand(rxLine);
        rxLine = "";
      }
    } else if (rxLine.length() < 128) {
      rxLine += c;
    } else {
      rxLine = "";
      sendElm("ERROR");
    }
  }

  while (KLine.available()) {
    const int value = KLine.read();
    Serial.printf("[KLINE] RX %02X\n", value & 0xFF);
  }
}
