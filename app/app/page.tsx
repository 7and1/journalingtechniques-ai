'use client';

import { JournalExperience } from '@/components/app/JournalExperience';
import { ModelDiagnostics } from '@/components/app/ModelDiagnostics';

export default function PrivateAppPage() {
  return (
    <main className="space-y-6">
      <JournalExperience />
      <ModelDiagnostics />
    </main>
  );
}
