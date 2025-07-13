import { Container } from '../container';
import { Profile } from '../types';

interface InjectableOptions {
  profile?: Profile;
}

export function Injectable({ profile = 'dev' }: InjectableOptions = { profile: 'dev' }): ClassDecorator {
  return (target: any) => {
    const container = Container.getInstance();
    container.provide(profile, [
      {
        provide: target.name,
        useClass: target,
      },
    ]);
  };
}
