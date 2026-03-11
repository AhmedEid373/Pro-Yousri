'use client';

import { useLanguage } from '@/context/LanguageContext';

export function T({ k, children }: { k: string; children: string }) {
  const { t } = useLanguage();
  return <>{t(k, children)}</>;
}
