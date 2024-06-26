import { existsSync } from 'fs';
import { join } from 'path';
import { APP_BASE_HREF } from '@angular/common';
import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import 'reflect-metadata';
import {
  ANGULAR_UNIVERSAL_CACHE_OPTIONS,
  ANGULAR_UNIVERSAL_OPTIONS
} from './angular-universal.constants';
import { angularUniversalProviders } from './angular-universal.providers';
import { AngularUniversalOptions } from './interfaces/angular-universal-options.interface';
import { renderUniversal } from './utils/setup-universal.utils';
import { AngularUniversalCacheOptions } from './interfaces/angular-universal-cache-options.interface';

@Module({
  providers: [...angularUniversalProviders]
})
export class AngularUniversalModule implements OnModuleInit {
  constructor(
    @Inject(ANGULAR_UNIVERSAL_OPTIONS)
    private readonly ngOptions: AngularUniversalOptions,
    @Inject(ANGULAR_UNIVERSAL_CACHE_OPTIONS)
    private readonly cacheOptions: AngularUniversalCacheOptions,
    private readonly httpAdapterHost: HttpAdapterHost // eslint-disable-next-line no-empty-function
  ) {}

  static forRoot(options: AngularUniversalOptions): DynamicModule {
    const indexHtml = existsSync(join(options.viewsPath, 'index.original.html'))
      ? 'index.original.html'
      : 'index';

    options = {
      templatePath: indexHtml,
      rootStaticPath: '*.*',
      renderPath: '*',
      ...options
    };

    return {
      module: AngularUniversalModule,
      providers: [
        {
          provide: ANGULAR_UNIVERSAL_OPTIONS,
          useValue: options
        },
        HttpAdapterHost
      ]
    };
  }

  onModuleInit() {
    if (!this.httpAdapterHost) {
      return;
    }
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    if (!httpAdapter) {
      return;
    }
    const app = httpAdapter.getInstance();
    app.get(this.ngOptions.renderPath, (req, res, next) =>
      renderUniversal(req, res, next, this.ngOptions, this.cacheOptions)
    );
  }
}
