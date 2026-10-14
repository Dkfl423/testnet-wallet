import Link from 'next/link';
import { Wallet } from 'lucide-react';

export default function HomePage() {
  return (
    <section className="flex flex-col items-center gap-6 pt-16 text-center" aria-labelledby="hero-title">
      <div className="rounded-2xl bg-primary/10 p-4 text-primary">
        <Wallet className="size-10" aria-hidden />
      </div>
      <h1 id="hero-title" className="text-3xl font-semibold tracking-tight">
        Testnet Wallet
      </h1>
      <p className="text-muted-foreground">
        Некастодиальный кошелёк для тестовых EVM-сетей. Ключи никогда не покидают ваш браузер.
      </p>
      <Link
        href="/welcome"
        className="inline-flex h-11 items-center rounded-lg bg-primary px-6 font-medium text-primary-foreground hover:opacity-90"
      >
        Начать
      </Link>
    </section>
  );
}
