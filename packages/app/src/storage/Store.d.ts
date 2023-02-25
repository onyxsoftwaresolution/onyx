import { Store as StoreIos } from './Store.ios';
import * as ios from './Store.ios';
import { Store as StoreAndroid } from './Store.android';
import * as android from './Store.android';
import { Store as StoreWeb } from './Store.web';
import * as web from './Store.web';

declare var _test: typeof ios;
declare var _test: typeof android;
declare var _test: typeof web;

declare var _testDefault: typeof StoreIos;
declare var _testDefault: typeof StoreAndroid;
declare var _testDefault: typeof StoreWeb;

export * from './Store.ios';
export default StoreIos;
