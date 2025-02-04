import { lazy } from 'react';
import { IntlProvider } from 'react-intl';
import { Route, Routes } from 'react-router-dom';
import { SessionExpiredDialog } from '@rio-cloud/rio-session-expired-info';
import ApplicationLayout from '@rio-cloud/rio-uikit/ApplicationLayout';
import NotificationsContainer from '@rio-cloud/rio-uikit/NotificationsContainer';

import { DEFAULT_LOCALE } from '../configuration/lang/lang';
import { isUserSessionExpired } from '../configuration/login/loginSlice';
import { useAppDispatch, useAppSelector } from '../configuration/setup/hooks';
import { getDisplayMessages, getLocale } from '../configuration/lang/langSlice';
import { DEFAULT_ROUTE, ROUTE_MORE } from '../routes/routes';
import DefaultRedirect from '../routes/DefaultRedirect';
import RouteUpdater from '../routes/RouteUpdater';
import { getSessionExpiredAcknowledged, hideSessionExpiredDialog } from './appSlice';
import AppHeader from '../features/header/AppHeader';
import SuspendedWithSpinner from '../components/SuspendedWithSpinner';

import './App.css';

// Lazy load pages for better performance and automatically split the bundle accordingly
const Intro = lazy(() => import('../pages/Intro'));
const More = lazy(() => import('../pages/More'));

const App = () => {
    const dispatch = useAppDispatch();

    const userLocale = useAppSelector(getLocale);
    const displayMessages = useAppSelector(getDisplayMessages);
    const isSessionExpired = useAppSelector(isUserSessionExpired);
    const sessionExpiredAcknowledged = useAppSelector(getSessionExpiredAcknowledged);

    if (!(displayMessages && userLocale)) {
        return null;
    }

    const handleSessionExpiredDialogClose = () => dispatch(hideSessionExpiredDialog);
    const showSessionExpired = isSessionExpired && !sessionExpiredAcknowledged;

    return (
        <IntlProvider defaultLocale={DEFAULT_LOCALE} key={userLocale} locale={userLocale} messages={displayMessages}>
            <ApplicationLayout data-testid={'app-layout'}>
                <ApplicationLayout.Header>
                    <AppHeader />
                </ApplicationLayout.Header>
                <ApplicationLayout.Body>
                    <NotificationsContainer />
                    <SessionExpiredDialog
                        locale={userLocale}
                        onClose={handleSessionExpiredDialogClose}
                        show={showSessionExpired}
                    />
                    <Routes>
                        <Route
                            path={DEFAULT_ROUTE}
                            element={
                                <SuspendedWithSpinner>
                                    <Intro />
                                </SuspendedWithSpinner>
                            }
                        />
                        <Route
                            path={ROUTE_MORE}
                            element={
                                <SuspendedWithSpinner>
                                    <More />
                                </SuspendedWithSpinner>
                            }
                        />
                        <Route path="*" element={<DefaultRedirect />} />
                    </Routes>
                    <RouteUpdater />
                </ApplicationLayout.Body>
            </ApplicationLayout>
        </IntlProvider>
    );
};

export default App;
