# Separação entre aplicativo e MID físico

O repositório contém duas partes relacionadas, mas com responsabilidades diferentes.

## Aplicativo Android

O Android é um cliente/ferramenta.

Ele pode:

- configurar;
- diagnosticar;
- registrar;
- visualizar dados;
- receber dados do Smart MID por Bluetooth.

Ele não é necessário para o funcionamento básico do MID físico.

## MID físico

O ESP32 + TID é o produto embarcado.

Ele deve:

- ligar com a ignição;
- comunicar com a ECU;
- controlar o TID;
- manter o estado do MID;
- continuar funcionando sem telefone.

## Regra de dependência

```
MID físico ───────► funciona sozinho

Android ──────────► opcional / ferramenta
```

Não colocar dependência de React Native, Expo ou GPS do celular no firmware do ESP32.

Não colocar lógica de tela Android dentro do firmware.

A comunicação entre os dois será definida por um protocolo próprio depois que o núcleo físico estiver validado.
