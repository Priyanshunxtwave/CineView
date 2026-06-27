import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { reaction } from 'mobx';
import { router } from './router';
import { validateEnv } from './Common/core/commonUtils';
import { preferencesStore } from './Preferences';
import './Preferences/core/i18n';
import i18n from './Preferences/core/i18n';
import './index.css';
import { watchlistStore } from './Collection';


validateEnv();

// 1. Load theme + language + region from localStorage / OS
preferencesStore.init();
// after preferencesStore.init();
watchlistStore.init();
// 2. Keep i18n in sync when language changes in MobX store
reaction(
  () => preferencesStore.language,
  (language) => {
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
  },
  { fireImmediately: true }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  </React.StrictMode>
);