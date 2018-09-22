// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// const context = require.context('./', true, /app\.component\.spec\.ts$/);
// const context = require.context('./', true, /app-routing\.module\.spec\.ts$/);
// const context = require.context('./', true, /flowmap\.component\.spec\.ts$/);
// const context = require.context('./', true, /flowmapdetail\.component\.spec\.ts$/);
// const context = require.context('./', true, /refdata\.component\.spec\.ts$/);
// const context = require.context('./', true, /ref-data-grid\.component\.spec\.ts$/);
// const context = require.context('./', true, /db\.service\.spec\.ts$/);
// const context = require.context('./', true, /flowmap\.service\.spec\.ts$/);
// const context = require.context('./', true, /xml\.service\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
