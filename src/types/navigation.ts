import type { ComponentType, SVGProps } from 'react';

export type TabKey = 'text' | 'image' | 'document' | 'audio';

export type NavItem = {
  key: TabKey;
  label: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};
