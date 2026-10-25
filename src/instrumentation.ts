import { assertProductionEnvironment } from '@/lib/config/environment';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    assertProductionEnvironment();
  }
}
