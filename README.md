# Testnet Wallet

> ⚠️ **Учебный проект / Educational project.** Работает только с тестовыми сетями. Не используйте реальные средства и реальные seed-фразы.

Некастодиальный EVM-кошелёк: Next.js 14, viem, wagmi, WebCrypto (AES-GCM + PBKDF2), IndexedDB.
Сети: Ethereum Sepolia, Polygon Amoy, Base Sepolia.

🇬🇧 English version: [README.en.md](./README.en.md) *(в разработке)*

## Статус

| Этап | Статус |
|---|---|
| 1. Каркас, линтеры, CI | ✅ |
| 2. Крипто-ядро (BIP-39/44, vault, валидация) + unit-тесты | ✅ |
| 3. Хранилище IndexedDB, сессия, авто-блокировка | ⏳ |
| 4. Онбординг: создание / импорт / watch-only | ⏳ |
| 5. Сети, балансы, ERC-20 | ⏳ |
| 6. Отправка: газ, симуляция, подтверждение | ⏳ |
| 7. Receive (QR), история | ⏳ |
| 8. Настройки, бэкап | ⏳ |
| 9. E2E (Playwright + Anvil), a11y | ⏳ |
| 10. Документация, скриншоты | ⏳ |

## Запуск

```bash
pnpm install
cp .env.example .env.local   # все ключи опциональны
pnpm dev
pnpm test
```
