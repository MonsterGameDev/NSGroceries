import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { setStatusBarColors } from './app/utils/status-bar-util';

import { AppModule } from "./app/app.module";


setStatusBarColors();

platformNativeScriptDynamic().bootstrapModule(AppModule);
