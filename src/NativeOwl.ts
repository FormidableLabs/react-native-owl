import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {}

// NOTE: We don't use getEnforcing as we don't have a module on ios
export default TurboModuleRegistry.get<Spec>("Owl");
