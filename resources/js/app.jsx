import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route as ziggyRoute } from 'ziggy-js';

// Bulletproof global route helper
window.route = function (name, params, absolute, config) {
    const activeZiggy = (typeof window !== 'undefined' && window.Ziggy) 
        ? window.Ziggy 
        : (typeof Ziggy !== 'undefined' ? Ziggy : config);

    if (activeZiggy) {
        try {
            return ziggyRoute(name, params, absolute, activeZiggy);
        } catch (e) {
            console.warn('Ziggy resolution fallback:', e);
        }
    }
    
    // Fallback Routes Mapping
    const routesMap = {
        'home': '/',
        'status.check': '/api/check-status',
        'dashboard': '/dashboard',
        'login': '/login',
        'logout': '/logout',
        'mutation.index': '/mutation',
        'mutation.create': '/mutation/create',
        'mutation.store': '/mutation',
        'mutation.show': (id) => `/mutation/${id}`,
        'mutation.edit': (id) => `/mutation/${id}/edit`,
        'mutation.verify': (id) => `/mutation/${id}/verify`,
        'mutation.update': (id) => `/mutation/${id}/update`,
        'mutation.issue_letter': (id) => `/mutation/${id}/issue-letter`,
        'mutation.download_letter': (id) => `/mutation/${id}/download-letter`,
        'mutation.preview_letter': (id) => `/mutation/${id}/preview-letter`,
        'document.view': (id) => `/document/${id}/view`,
        'document.download': (id) => `/document/${id}/download`,
        'letter.verify': (hash) => `/verify-letter/${hash}`,
    };

    if (!name) {
        return {
            current: (routeName) => {
                const targetPath = typeof routesMap[routeName] === 'string' ? routesMap[routeName] : '';
                return window.location.pathname === targetPath || window.location.pathname === targetPath + '/';
            },
        };
    }

    const matched = routesMap[name];
    if (typeof matched === 'function') {
        const id = (params && typeof params === 'object') ? (params.id || params.hash || Object.values(params)[0]) : params;
        return matched(id);
    }
    if (typeof matched === 'string') {
        if (params && typeof params === 'object') {
            const query = new URLSearchParams(params).toString();
            return query ? `${matched}?${query}` : matched;
        }
        return matched;
    }
    return '/' + name;
};

const appName = import.meta.env.VITE_APP_NAME || 'SIMUTASI PETADIK';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#0284c7',
    },
});
