# Meriva MID ESP32

Este diretório inicia o núcleo embarcado do **Meriva MID** usando **ESP32-WROOM-32E / ESP32 clássico**.

## Arquitetura

```
Android MID
   │
   │ Bluetooth Classic / SPP
   ▼
ESP32-WROOM-32E
   │
   │ UART2
   ▼
Transceptor K-Line automotivo
   │
   │ OBD-II pino 7
   ▼
ECU da Meriva
```

O ESP32 é o núcleo de campo. O telefone continua sendo a interface de configuração, laboratório e registro.

O ESP32 clássico foi escolhido porque possui Bluetooth Classic. ESP32-C3/S3/C6 não devem ser usados para este caminho SPP.

## Ligações iniciais

- UART2 RX: GPIO 16
- UART2 TX: GPIO 17
- K-Line: através de transceptor automotivo apropriado
- OBD-II pino 7: K-Line
- OBD-II pinos 4/5: GND
- OBD-II pino 16: alimentação do circuito através de proteção e regulador apropriados

**Nunca ligue a K-Line de 12 V diretamente ao GPIO do ESP32.** Use transceptor automotivo ou circuito de nível/proteção adequado.

## Bluetooth

O firmware anuncia:

`MERIVA-MID-ESP32`

e usa Bluetooth Classic SPP.

A primeira camada aceita comandos no estilo ELM327 para que o aplicativo Android possa continuar usando o mesmo modelo de comunicação:

- ATZ
- ATI
- ATE0
- ATL0
- ATS0
- ATH1
- ATSP0
- ATDP

Nesta primeira etapa, comandos OBD ainda retornam `NO DATA`. Isso é intencional: não vamos inventar resposta da ECU antes de validar fisicamente o K-Line.

## K-Line

A Meriva conhecida no projeto usa ISO 14230-4 KWP Fast Init / K-Line. O firmware começa com UART 10400 8N1, mas o handshake KWP e os tempos de inicialização ainda precisam ser validados no veículo.

A camada K-Line será implementada separadamente do Bluetooth para permitir testes unitários e evitar que a interface Android conheça detalhes elétricos do veículo.

## Próximo marco

1. Validar alimentação e proteção.
2. Validar transceptor K-Line.
3. Validar wake/fast-init na Meriva.
4. Capturar TX/RX bruto.
5. Implementar 010C.
6. Implementar descoberta de PIDs.
7. Só depois liberar leitura automática contínua.

## Regra

**Sem resposta real da ECU, o firmware não cria dados falsos.**
