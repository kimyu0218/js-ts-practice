type Constructor<T = any> = new (...args: any[]) => T;

export class ApplicationContext {
  private static _instance: ApplicationContext;
  private readonly _container = new Map<string, Map<string, any>>();

  private _profile: string = 'dev';
  private _setProfile: boolean = false;

  private constructor() {}

  // for singleton
  static getInstance(): ApplicationContext {
    const instance = ApplicationContext._instance;
    if (!instance) {
      ApplicationContext._instance = new ApplicationContext();
      ApplicationContext._instance.log('Initialized ApplicationContext.');
    }
    return ApplicationContext._instance;
  }

  /**
   * 기본적으로 dev 프로파일을 사용하지만, setProfile 메서드를 이용하여 다른 프로파일로 변경할 수 있다.
   * @param profile 활성화하려는 프로파일
   */
  static setProfile(profile: string) {
    const instance = ApplicationContext.getInstance();
    if (instance._setProfile) {
      // 프로파일을 두 번 이상 변경하려고 하면 예외를 던진다.
      throw new Error(
        `[${ApplicationContext.name}] Profile has already been set to "${instance._profile}". Profile can only be set once.`
      );
    }
    instance._profile = profile;
    instance._setProfile = true;
    instance.log(`Set profile as "${profile}".`);
  }

  /**
   * 특정 프로파일에 key라는 이름으로 빈(컨텍스트 관리 대상)을 등록한다.
   * @param key 빈의 key(빈 이름)
   * @param profile 빈을 등록하려는 프로파일
   * @param clazz 빈(클래스)
   * @param args 생성자 인자
   */
  registerBean(key: string, profile: string, clazz: Constructor, args: any[] = []) {
    if (!this._container.has(profile)) {
      this._container.set(profile, new Map());
    }

    const profileContainer = this._container.get(profile) as Map<string, any>;
    if (profileContainer.has(key)) {
      // 하나의 key에 대해 여러 개의 빈을 등록하려고 하면 예외를 던진다.
      throw new Error(
        `[${ApplicationContext.name}] No qualifying bean of "${key}" available: expected single matching but found N.`
      );
    }
    profileContainer.set(key, new clazz(...args));
    this.log(`Registered bean "${profile}.${key}".`);
  }

  /**
   * 프로파일과 key를 이용하여 빈(컨텍스트 관리 대상)을 반환한다.
   * @param key 빈의 키
   * @returns 빈(싱글톤 인스턴스)
   */
  getBean<T = any>(key: string): T {
    const instance = this._container.get(this._profile)?.get(key);
    this._setProfile = true; // 빈을 조회한 뒤에 다른 프로파일의 빈을 조회하는 것을 막아 프로파일을 유지한다.

    if (!instance) {
      // key에 해당하는 빈을 찾지 못하면 예외를 던진다.
      throw new Error(
        `[${ApplicationContext.name}] No qualifying bean of "${key}" available: expected at least 1 bean which qualifies as autowire.`
      );
    }
    return instance;
  }

  /**
   * 특정 프로파일에 등록된 빈 목록을 반환한다.
   * @returns [빈 이름, 빈 객체] 목록
   */
  getBeans(): [string, any][] {
    this._setProfile = true; // 빈을 조회한 뒤에 다른 프로파일의 빈을 조회하는 것을 막아 프로파일을 유지한다.

    const beans: [string, any][] = [];

    const profileContainer = this._container.get(this._profile) as Map<string, any>;
    for (const [key, bean] of profileContainer) {
      beans.push([key, bean]);
    }
    return beans;
  }

  /**
   * 전역 인스턴스를 애플리케이션 컨텍스트에 등록한다.
   *
   * 프로그램이 시작되면 빈의 생성자를 호출하여 컨텍스트에 새로운 인스턴스를 등록하게 되는데, 컨텍스트를 활용하지 않는 기존 코드는 컨텍스트의 객체가 아닌 전역 인스턴스를 바로 참조한다.
   * 전역 인스턴스와 새로운 인스턴스 간 데이터가 공유되지 않는 문제를 방지하고자 MainScene이 로드될 때 전역 인스턴스를 등록해준다.
   * @param key 빈의 키
   * @param instance 전역 인스턴스
   */
  registerGlobalInstance(key: string, instance: any) {
    this._setProfile = true; // 전역 인스턴스를 등록한 뒤에 프로파일을 바꾸지 못하도록 제한한다.

    if (!this._container.has(this._profile)) {
      this._container.set(this._profile, new Map());
    }

    const profileContainer = this._container.get(this._profile) as Map<string, any>;
    profileContainer.set(key, instance);
    this.log(`Registered global instance "${key}".`);
  }

  // for logging
  private log(message: string) {
    console.log(`[${ApplicationContext.name}] [${this._profile.padEnd(12)}] ${message}`);
  }
}
